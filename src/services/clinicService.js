import axiosJWT from './axiosService';

const getAllClinics = async () => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/clinic`);
    return res.data;
};

export { getAllClinics };