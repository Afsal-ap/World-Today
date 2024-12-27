import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { HttpMethod } from './constants/httpMethods.js';
import errorHandler from './middlewares/errorHandler.js';
import { userServiceProxy } from './middlewares/userServiceProxy.js';
import { adProxy } from './routes/adRoute.js'; 
import { channelServiceProxy } from './middlewares/channelServiceProxy.js'; 

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;
const frontendPort = process.env.FRONTEND_PORT;

const corsOptions = {
    origin: frontendPort,
    methods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.PATCH, HttpMethod.DELETE],
    credentials: true,
};

app.use(cors(corsOptions));

// Add these lines before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply proxies
app.use('/api/user', userServiceProxy);
app.use('/api/ad', adProxy);
app.use('/api/channel', channelServiceProxy);

app.get('/', (req, res) => {
    res.send('API Gateway is running');
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});