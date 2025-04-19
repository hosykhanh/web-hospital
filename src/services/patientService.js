import axiosJWT from './axiosService';

const getAllPatients = async () => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user`, {
        params: {
            role: 1,
        },
    });
    return res.data;
};

const getAllPatientsByDoctorId = async (id, isGetAllPatient) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/${id}/patients`, {
        params: {
            isGetAllPatient,
        },
    });
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

const getAllMedicalConsultationHistory = async (filters = {}) => {
    const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined),
    );
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/medical-consultation-history`, { params });
    return res.data;
};

const getMedicalConsultationHistory = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/medical-consultation-history/${id}`);
    return res.data;
};

const createMedicalConsultationHistory = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/medical-consultation-history`, data);
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

const completeMedicalConsultationHistory = async (id, data) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/medical-consultation-history/${id}/complete`,
        data,
    );
    return res.data;
};

const cancelMedicalConsultationHistory = async (id) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/medical-consultation-history/${id}/cancel`);
    return res.data;
};

export {
    getAllPatients,
    getAllPatientsByDoctorId,
    getHealthRecord,
    updateHealthRecord,
    getAllMedicalConsultationHistory,
    getMedicalConsultationHistory,
    createMedicalConsultationHistory,
    updateMedicalConsultationHistory,
    deleteMedicalConsultationHistory,
    completeMedicalConsultationHistory,
    cancelMedicalConsultationHistory,
};
