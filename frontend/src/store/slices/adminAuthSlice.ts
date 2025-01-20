import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminAuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: any | null;
}                          

const initialState: AdminAuthState = {
    token: localStorage.getItem('adminToken'),
    isAuthenticated: !!localStorage.getItem('adminToken'),
    user: null
};

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        setAdminCredentials: (state, action: PayloadAction<{ token: string; user: any }>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            localStorage.setItem('adminToken', action.payload.token);
        },
        adminLogout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('adminToken');
        }
    }
});

export const { setAdminCredentials, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer; 