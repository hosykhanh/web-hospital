import React, { useEffect, useState } from 'react';

import styles from './SignInPage.module.scss';
import classNames from 'classnames/bind';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
// import { loginUser } from '../../services/authService';
import checkStatusResponse from '../../utils/checkStatusResponse';
import { Image, Input, message } from 'antd';
import Button from '../../components/Button/Button';
import Loading from '../../components/Loading/Loading';
import images from '../../assets';
import * as messages from '../../components/Message/Message';
import { SignatureOutlined, UserOutlined } from '@ant-design/icons';
import { loginUser } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slice/userSlice';
import * as userService from '../../services/userServices';
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const location = useLocation();

    const navigate = useNavigate();

    // function call API
    const mutation = useMutation({
        mutationFn: (data) => loginUser(data),
        onError: (error) => {
            message.error(error?.response?.data?.message);
        },
    });

    const { isLoading, isSuccess, data } = mutation;

    const handleGetDetailUser = async (id, access_token) => {
        const res = await userService.getUser(id, access_token);
        dispatch(updateUser({ ...res?.data, access_token }));
        const role = res?.data?.role;
        if (role === 1) {
            message.warning(
                'Tài khoản của bạn không phải là bác sĩ hoặc admin nên không thể đăng nhập vào hệ thống này!',
            );
            return;
        } else if (role === 3) {
            navigate('/admin');
        } else if (role === 2) {
            navigate('/doctor');
        }
        messages.success('Đăng nhập thành công');
    };

    useEffect(() => {
        if (isSuccess && checkStatusResponse(data)) {
            // messages.success('Đăng nhập thành công');
            localStorage.setItem('access_token', JSON.stringify(data?.data?.access_token));

            if (data?.data?.access_token) {
                const decoded = jwtDecode(data?.data?.access_token);
                if (decoded?.id) {
                    handleGetDetailUser(decoded?.id, data?.data?.access_token);
                }
            }
            if (location?.state) {
                navigate(location?.state);
            } else if (!data?.data?.role || data?.data?.role === 1) {
                navigate('/');
            }
        } else if (data?.statusCode === 404) {
            message.error(data?.message);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, data]);

    // function handle UI
    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleOnChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({
            email,
            password,
        });
    };

    return (
        <div className={cx('wapper')}>
            <div className={cx('wapper-content')}>
                <form onSubmit={(e) => handleSubmit(e)} className={cx('content')}>
                    <div className={cx('app-name')}>
                        <img src={images.logo} alt="" width="35px" /> <span>MedMeet</span>
                    </div>
                    <div className={cx('form')}>
                        <div className={cx('form-title')}>Login</div>
                        <div className={cx('form-label')}>
                            <label htmlFor="User">
                                <UserOutlined /> Email
                            </label>
                            <Input
                                onChange={handleOnChangeEmail}
                                value={email}
                                id="email"
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className={cx('form-label')}>
                            <label htmlFor="Password">
                                <SignatureOutlined /> Password
                            </label>
                            <Input.Password
                                type="password"
                                onChange={handleOnChangePassword}
                                value={password}
                                id="password"
                                required
                                placeholder="Enter your pasword"
                            />
                        </div>

                        <a className={cx('forgot-password')} href="/">
                            Forgot password?
                        </a>
                        <div style={{ marginTop: '40px' }}>
                            <Loading isLoading={isLoading}>
                                <Button className={cx('btn-form')} type="primary">
                                    Login
                                </Button>
                            </Loading>
                        </div>
                    </div>
                </form>
            </div>
            <div className={cx('image')}>
                <Image
                    preview={false}
                    style={{ height: '550px', objectFit: 'cover' }}
                    src={images.imageLogin}
                    alt="sign up"
                />
            </div>
        </div>
    );
};

export default SignInPage;
