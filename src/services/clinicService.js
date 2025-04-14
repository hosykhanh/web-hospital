import axiosJWT from './axiosService';

const getAllClinics = async () => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/clinic`);
    return res.data;
};

const getClinicById = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/clinic/${id}`);
    return res.data;
};

export { getAllClinics, getClinicById };
