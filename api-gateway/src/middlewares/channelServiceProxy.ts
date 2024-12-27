import { createProxyMiddleware } from 'http-proxy-middleware';
import { serviceUrls } from '../config/serviceUrls.js';

export const channelServiceProxy = createProxyMiddleware({
    target: serviceUrls.channelService,
    changeOrigin: true,
    pathRewrite: {
        '^/api/channel': '',
    },
}); 