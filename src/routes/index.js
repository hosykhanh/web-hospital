import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout';
import AdminPage from '../pages/AdminPage/AdminPage';
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
    {
        path: '/admin',
        page: AdminPage,
        layout: DefaultLayout,
    },
]