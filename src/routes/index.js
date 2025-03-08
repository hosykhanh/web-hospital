import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout';
import DoctorPage from '../pages/DoctorPage/DoctorPage';
import SignInPage from '../pages/SignInPage/SignInPage';

export const routes = [
    {
        path: '/',
        page: SignInPage,
        layout: DefaultLayout,
    },
    {
        path: '/doctor',
        page: DoctorPage,
        layout: DefaultLayout,
    },
]