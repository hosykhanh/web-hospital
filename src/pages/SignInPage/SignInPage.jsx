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
import { SignatureOutlined, UserOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const SignInPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const location = useLocation();

    // const navigate = useNavigate();

    // function call API
    // const mutation = useMutation({
    //     mutationFn: (data) => loginUser(data),
    // });

    // const { isLoading, isSuccess, data } = mutation;

    // useEffect(() => {
    //     if (isSuccess && checkStatusResponse(data)) {
    //         if (location?.state) {
    //             navigate(location?.state);
    //         } else {
    //             navigate('/verify-otp', { state: { loginRespone: data }});
    //         }
    //     } else if (data?.status === 'err') {
    //         message.error(data?.message);
    //     }

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isSuccess, data]);

    // function handle UI
    const handleOnChangeUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleOnChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // mutation.mutate({
        //     email,
        //     password,
        // });
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
                                <UserOutlined /> Username
                            </label>
                            <Input
                                onChange={handleOnChangeUsername}
                                value={username}
                                id="username"
                                required
                                placeholder="Enter your username"
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
                        {/* <Loading> */}
                        <Button className={cx('btn-form')} type="primary">
                            Login
                        </Button>
                        {/* </Loading> */}
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
