import axiosJWT from './axiosService';

const getAllPatients = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/${id}/patients`);
    return res.data;
};

const getHealthRecord = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/health-record/${id}`);
    return res.data;
};

const updateHealthRecord = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/health-record/${id}`, data);
    return res.data;
};

const getAllMedicalConsultationHistory = async (patientId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/medical-consultation-history`, {
        params: { patientId },
    });
    return res.data;
};

const getMedicalConsultationHistory = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/medical-consultation-history/${id}`);
    return res.data;
};

const updateMedicalConsultationHistory = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/medical-consultation-history/${id}/update`, data);
    return res.data;
};

const deleteMedicalConsultationHistory = async (id) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/medical-consultation-history/${id}/delete`);
    return res.data;
};

export {
    getAllPatients,
    getHealthRecord,
    updateHealthRecord,
    getAllMedicalConsultationHistory,
    getMedicalConsultationHistory,
    updateMedicalConsultationHistory,
    deleteMedicalConsultationHistory,
};
