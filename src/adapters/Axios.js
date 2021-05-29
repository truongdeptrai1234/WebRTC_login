import axios from 'axios';
import { environment } from '../environment/environment';
import { CURRENT_USER, USER_REFRESH_TOKEN, USER_TOKEN } from '../constants/StorageKeys';

export class Axios {
	static _baseURL = environment.baseApiURL;
	static _currentUserToken = null;
	static _currentUser = null;

	static async getAuthToken() {
		if (this._currentUserToken) return this._currentUserToken;
		const token = localStorage.getItem(USER_TOKEN);
		this._currentUserToken = token;
		return token;
	}

	static async setToken(data) {
		const { refreshToken, token, user } = data;
		this._currentUser = user;
		this._currentUserToken = token;
		localStorage.setItem(CURRENT_USER, JSON.stringify(user))
		localStorage.setItem(USER_TOKEN, token)
		localStorage.setItem(USER_REFRESH_TOKEN, refreshToken)

	}

	static async getRequestParams(
		additionalConfig = {},

	) {
		const token = await this.getAuthToken();
		const { headers, ...others } = additionalConfig;
		return {
			baseURL: environment.baseApiURL,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token || ''}`,
				...(headers || {}),
			},
			...others,
		};
	}

	static getCurrentUser() {
		return this._currentUser;
	}

	static async get(
		path,
		additionalConfig = {},
	) {
		const requestUrl = `${this._baseURL}${path}`;
		const request = (config) => axios.get(requestUrl, config);
		return this.executeRequest(request, additionalConfig);
	}

	static async post(
		path,
		data,
		additionalConfig = {},
	) {
		const requestUrl = `${this._baseURL}${path}`;
		const request = (config) => axios.post(requestUrl, data, config);
		return this.executeRequest(request, additionalConfig);
	}

	static async put(
		path,
		data,
		additionalConfig = {},
	) {
		const requestUrl = `${this._baseURL}${path}`;
		const request = (config) => axios.put(requestUrl, data, config);
		return this.executeRequest(request, additionalConfig);
	}

	static async patch(
		pat,
		data,
		additionalConfig = {},
	) {
		const requestUrl = `${this._baseURL}${path}`;
		const request = (config) => axios.patch(requestUrl, data, config);
		return this.executeRequest(request, additionalConfig);
	}

	static async delete(
		path,
		additionalConfig = {},
	) {
		const requestUrl = `${this._baseURL}${path}`;
		const request = (config) => axios.delete(requestUrl, config);
		return this.executeRequest(request, additionalConfig);
	}

	static async executeRequest(
		request,
		additionalRequestConfig = {},
	) {
		const requestConfig = await this.getRequestParams(additionalRequestConfig);
		const response = await request(requestConfig);

		const { data } = response;
		if (response && response.status < 400) return response;
		return await this.strategyReloader(request, additionalRequestConfig);
	}

	static async refreshToken(refreshToken) {
		const defaultRefreshTokenPath = '/auth/refresh';
		if (!refreshToken) throw new Error('Refresh token not found');
		const config = await this.getRequestParams({
			headers: {
				'x-refresh-token': `${refreshToken}`,
			},
		});
		return await axios.get(defaultRefreshTokenPath, config);
	}

	// TODO: get token invalid error and reload the command with refresh strategy
	static async strategyReloader(
		reloadedRequest,
		additionalRequestConfig,
	) {
		const defaultRefreshTokenPath = '/auth/refresh';
		const refreshToken = localStorage.getItem(USER_REFRESH_TOKEN);
		if (!refreshToken) return null;
		const config = await this.getRequestParams({
			headers: {
				'x-refresh-token': `${refreshToken}`,
			},
		});
		const { data, ...others } = await axios.get(defaultRefreshTokenPath, config);
		if (!data || !data.token) return null;
		await this.setToken(data);
		const newConfig = await this.getRequestParams(additionalRequestConfig);
		return await reloadedRequest(newConfig);
	}
}
