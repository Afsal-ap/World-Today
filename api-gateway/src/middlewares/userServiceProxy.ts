import { createProxyMiddleware } from 'http-proxy-middleware';
import { serviceUrls } from '../config/serviceUrls.js';

export const userServiceProxy = createProxyMiddleware({
    target: serviceUrls.userService,
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '',
    },
}); 