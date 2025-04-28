import axiosJWT from './axiosService';

const getAllMedicalService = async (clinicId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/medical-service`, {
        params: { clinicId },
    });
    return res.data;
};

const getMedicalServiceById = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/medical-service/${id}`);
    return res.data;
};

const createMedicalService = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/medical-service`, data);
    return res.data;
};

const updateMedicalService = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/medical-service/${id}/update`, data);
    return res.data;
};

export { getAllMedicalService, getMedicalServiceById, createMedicalService, updateMedicalService };
