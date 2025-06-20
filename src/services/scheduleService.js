import axiosJWT from './axiosService';

const getLeaveSchedule = async (doctorId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/leave-schedule/${doctorId}`);
    return res.data;
};

const createLeaveSchedule = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/leave-schedule`, data);
    return res.data;
};

const inActiveLeaveSchedule = async (id) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/leave-schedule/${id}/inactive`);
    return res.data;
};

const getSchedulesByMedicalService = async (medicalServiceId, params) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/medical-service/${medicalServiceId}/schedules`, {
        params,
    });
    return res.data;
};

const getClinicSchedule = async (clinicId, params) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/clinic-schedule/${clinicId}`, {
        params,
    });
    return res.data;
};

const createClinicSchedule = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/clinic-schedule`, data);
    return res.data;
};

const deleteClinicSchedule = async (id) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/clinic-schedule/${id}/delete`);
    return res.data;
};

const getAllRequestChangeScheduleByClinic = async (params) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/request-change-schedule`, { params });
    return res.data;
};

const createRequestChangeSchedule = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/request-change-schedule`, data);
    return res.data;
};

const getRequestChangeSchedule = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/request-change-schedule/${id}`);
    return res.data;
};

const updateRequestChangeSchedule = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/request-change-schedule/${id}`, data);
    return res.data;
};

const deleteRequestChangeSchedule = async (id) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/request-change-schedule/${id}`);
    return res.data;
};

export {
    getLeaveSchedule,
    createLeaveSchedule,
    inActiveLeaveSchedule,
    getSchedulesByMedicalService,
    getClinicSchedule,
    getAllRequestChangeScheduleByClinic,
    createRequestChangeSchedule,
    getRequestChangeSchedule,
    deleteRequestChangeSchedule,
    updateRequestChangeSchedule,
    createClinicSchedule,
    deleteClinicSchedule,
};
