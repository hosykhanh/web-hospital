import axiosJWT from './axiosService';

const getDashboardMedicalConsultationHistory = async (params) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/dashboard/medical-consultation-history`, {
        params,
    });
    return res.data;
};

const getDashboardPatient = async (params) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/dashboard/patient`, {
        params,
    });
    return res.data;
};

const getDashboardDoctor = async (params) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/dashboard/doctor`, {
        params,
    });
    return res.data;
};

const getDashboardRevenue = async (params) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/dashboard/revenue`, {
        params,
    });
    return res.data;
};

export { getDashboardMedicalConsultationHistory, getDashboardPatient, getDashboardDoctor, getDashboardRevenue };
