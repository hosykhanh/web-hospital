import axios from 'axios';
import axiosJWT from './axiosService';

const signUpUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/sign-up`, data);
    return res.data;
};

// const getUserMe = async () => {
//     const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/me`);
//     return res.data;
// };

const getUser = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/${id}`);
    return res.data;
};

const getAllUser = async ({ name }) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user`, {
        params: {
            name: name,
        },
    });
    return res.data;
};

const updateAvatar = async (id, avatar) => {
    const formData = new FormData();
    formData.append('file', avatar.avatar);
    console.log(formData);

    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/${id}/update-avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data;
};

const deleteUser = async ({ id }) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/${id}/delete`);
    return res.data;
};

const deleteManyUser = async ({ _id }) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/user/delete-many`, { _id });
    return res.data;
};

const updateUser = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/${id}/update`, data);
    return res.data;
};

export { getAllUser, getUser, signUpUser, updateUser, updateAvatar, deleteUser, deleteManyUser, axiosJWT };
