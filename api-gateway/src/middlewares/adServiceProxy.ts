import { Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { serviceUrls } from '../config/serviceUrls.js';

export const adServiceProxy = createProxyMiddleware({
    target: serviceUrls.adService,
    changeOrigin: true,
    pathRewrite: {
        '^/api/ad': '',
    },
    proxyTimeout: 30000,
    timeout: 30000,
    onError: (err: Error, req: Request, res: Response, target: string) => {
        console.error('[Ad Service Proxy Error]:', err);
        if (!res.headersSent) {
            if (err.message === 'socket hang up' || (err as any).code === 'ECONNRESET') {
                res.writeHead(502, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({ 
                    error: 'Service Unavailable', 
                    message: 'Please check if the ad service is running on port 3002'
                }));
            } else {
                res.writeHead(500, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({ error: 'Ad Service Error' }));
            }
        }
    },
    logLevel: 'debug',
    secure: false,
    ws: true,
    xfwd: true,
    retry: 3,
} as Options); 