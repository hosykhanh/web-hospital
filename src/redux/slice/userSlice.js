import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userName: '',
    email: '',
    phone: '',
    address: '',
    gender: 1,
    access_token: '',
    id: '',
    dateOfBirth: '',
    role: 1,
    avatar: '',
    province: '',
    district: '',
    medicalServiceId: '',
    clinicId: '',
    specialty: '',
    qualification: '',
    description: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {
                userName = '',
                email = '',
                phone = '',
                address = '',
                access_token = '',
                _id = '',
                gender = 1,
                dateOfBirth = '',
                role = 1,
                avatar = '',
                province = '',
                district = '',
                medicalServiceId = '',
                clinicId = '',
                specialty = '',
                qualification = '',
                description = '',
            } = action.payload;
            state.userName = userName;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.id = _id;
            state.gender = gender;
            state.access_token = access_token;
            state.dateOfBirth = dateOfBirth;
            state.role = role;
            state.avatar = avatar;
            state.province = province;
            state.district = district;
            state.medicalServiceId = medicalServiceId;
            state.clinicId = clinicId;
            state.specialty = specialty;
            state.qualification = qualification;
            state.description = description;
        },

        resetUser: (state) => {
            state.userName = '';
            state.email = '';
            state.access_token = '';
            state.phone = '';
            state.address = '';
            state.gender = 1;
            state.id = '';
            state.dateOfBirth = '';
            state.role = 1;
            state.avatar = '';
            state.province = '';
            state.district = '';
            state.medicalServiceId = '';
            state.clinicId = '';
            state.specialty = '';
            state.qualification = '';
            state.description = '';
        },
    },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
