import axios from 'axios';
import axiosJWT from './axiosService';

const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/sign-in`, data);
    return res.data;
};

const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
    return res.data;
};

const refreshToken = async () => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/auth/refresh`);
    return res.data;
};

export { loginUser, logoutUser, refreshToken};
