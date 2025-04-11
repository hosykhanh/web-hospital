import axiosJWT from './axiosService';

const getAllMedicalService = async (clinicId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/medical-service`, {
        params: { clinicId },
    });
    return res.data;
};

export { getAllMedicalService };