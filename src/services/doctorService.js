import axiosJWT from './axiosService';

const getAllDoctors = async () => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user`, {
        params: {
            role: 2,
        },
    });
    return res.data;
};

const getDoctorsByClinicId = async (id, params) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/clinic/${id}/doctors`, {
        params,
    });
    return res.data;
};

const createDoctor = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/user/create-doctor`, data);
    return res.data;
};

const updateDoctor = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/${id}/update-doctor`, data);
    return res.data;
};

const getDotorSchedules = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/${id}/schedules`);
    return res.data;
};

const getDoctorWorkingSchedules = async (id, date) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/${id}/working-schedules`, {
        params: {
            date,
        },
    });
    return res.data;
};

export {
    getAllDoctors,
    getDoctorsByClinicId,
    createDoctor,
    updateDoctor,
    getDotorSchedules,
    getDoctorWorkingSchedules,
};
