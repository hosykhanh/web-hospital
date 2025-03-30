import axiosJWT from './axiosService';

const createDoctor = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/create-doctor`, data);
    return res.data;
};

const getDotorSchedules = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/${id}/schedules`);
    return res.data;
};

export { createDoctor, getDotorSchedules };