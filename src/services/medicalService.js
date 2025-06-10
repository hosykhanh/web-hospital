import axiosJWT from './axiosService';

const getAllMedicalService = async (clinicId, doctorId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/medical-service`, {
        params: { clinicId, doctorId },
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

const updateLogoMedicalService = async (id, logo) => {
    const formData = new FormData();
    formData.append('file', logo.logo);
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/medical-service/${id}/update-logo`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

const deleteMedicalService = async (id) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/medical-service/${id}/delete`);
    return res.data;
};

export {
    getAllMedicalService,
    getMedicalServiceById,
    createMedicalService,
    updateMedicalService,
    updateLogoMedicalService,
    deleteMedicalService,
};
