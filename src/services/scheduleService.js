import axiosJWT from './axiosService';

const getLeaveSchedule = async (doctorId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/leave-schedule/${doctorId}`);
    return res.data;
};

const createLeaveSchedule = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/leave-schedule`, data);
    return res.data;
};

const getClinicSchedule = async (clinicId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/clinic-schedule/${clinicId}`);
    return res.data;
};

export { getLeaveSchedule, createLeaveSchedule, getClinicSchedule };
