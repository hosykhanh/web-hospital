import axiosJWT from './axiosService';

const getAllClinics = async () => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/clinic`);
    return res.data;
};

const getClinicById = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/clinic/${id}`);
    return res.data;
};

const createClinic = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/clinic`, data);
    return res.data;
};

const updateClinic = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/clinic/${id}/update`, data);
    return res.data;
};

const updateLogo = async (id, logo) => {
    const formData = new FormData();
    formData.append('file', logo.logo);
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/clinic/${id}/update-logo`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

const deleteClinic = async (id) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/clinic/${id}/delete`);
    return res.data;
};

export { getAllClinics, getClinicById, createClinic, updateClinic, updateLogo, deleteClinic };
