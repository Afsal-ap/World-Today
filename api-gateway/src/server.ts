import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import cors from 'cors';
import { HttpMethod } from './constants/httpMethods';
import errorHandler from './middlewares/errorHandler';
import { adProxy } from './routes/adRoute';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const frontendPort = process.env.FRONTEND_PORT;

const corsOptions = {
    origin: frontendPort,
    methods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.PATCH, HttpMethod.DELETE],
    credentials: true,
};

app.use(cors(corsOptions));

// Apply proxies
// app.use('/api/user', userProxy);
// app.use('/api/company', companyProxy);
app.use('/api/ad', adProxy);

app.get('/', (req, res) => {
    res.send('API Gateway is running');
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
}); 