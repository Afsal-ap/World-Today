import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { serviceUrls } from '../config/serviceUrls.js';

const router = Router();

export const adProxy = createProxyMiddleware({
    target: serviceUrls.adService,
    changeOrigin: true,
    pathRewrite: {
        '^/api/ad': '',
    },
    onError: (err, req, res) => {
        console.error('[Ad Service Proxy Error]:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Ad Service Error' });
        }
    },
    logLevel: 'debug'
});

router.post('/advertiser/register', upload.single('logo'), async (req, res) => {
  try {
    // Log the incoming request
    console.log('Received registration request:', {
      body: req.body,
      file: req.file
    });

    const formData = new FormData();
    // Add all fields from req.body
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });
    
    // Add the logo file if it exists
    if (req.file) {
      formData.append('logo', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
    }

    const response = await adServiceClient.post('/advertiser/register', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Registration failed'
    });
  }
});