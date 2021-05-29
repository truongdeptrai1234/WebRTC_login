const currentNetworkIpAddress = '192.168.1.212';
const currentApiPort = 12021;

// only for local
export const environment = {
    isProduction: false,
    baseApiURL: `http://${currentNetworkIpAddress}:${currentApiPort}`,
    wsUrl: `ws://${currentNetworkIpAddress}:${currentApiPort}`
};
