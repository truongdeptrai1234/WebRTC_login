// const currentNetworkIpAddress = '192.168.1.212';
// const currentApiPort = 12021;

// // only for local
// export const environment = {
//     isProduction: false,
//     baseApiURL: `http://${currentNetworkIpAddress}:${currentApiPort}`,
//     wsUrl: `ws://${currentNetworkIpAddress}:${currentApiPort}`
// };


export const environment = {
    isProduction: true,
    apiUrl: `https://webrtc-api.ddns.net`,
    wsUrl: `wss://webrtc-api.ddns.net`,
};
