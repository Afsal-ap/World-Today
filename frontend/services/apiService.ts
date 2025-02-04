import axios, { AxiosInstance } from 'axios';

const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await fetch('/auth/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();
        if (data.success) {
            localStorage.setItem('userToken', data.accessToken);
            return data.accessToken;
        } else {
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        // Handle token refresh failure (e.g., logout user)
        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
};

const setupInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            }
            return Promise.reject(error);
        }
    );
};
