import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './DoctorProfile.module.scss';
import images from '../../assets';
import { DatePicker, Input, message, Modal, Radio } from 'antd';
import Button from '../Button/Button';
import dayjs from 'dayjs';
import convertISODateToLocalDate from '../../utils/convertISODateToLocalDate';
import { useDispatch, useSelector } from 'react-redux';
import * as userService from '../../services/userServices';
import { useMutation } from 'react-query';
import checkStatusResponse from '../../utils/checkStatusResponse';
import { updateUser } from '../../redux/slice/userSlice';
import { CameraOutlined } from '@ant-design/icons';
import InputUpload from '../InputUpload/InputUpload';
import Loading from '../Loading/Loading';

const cx = classNames.bind(styles);

const DoctorProfile = () => {
    const users = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalOpenAvatar, setIsModalOpenAvatar] = useState(false);

    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [gender, setGender] = useState('1');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [qualification, setQualification] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [description, setDescription] = useState('');

    const mutation = useMutation({
        mutationFn: (data) => {
            const { id, ...rests } = data;
            return userService.updateUser(id, rests);
        },
    });

    const { data, isLoading, isSuccess, isError } = mutation;

    const mutationAvatar = useMutation({
        mutationFn: (data) => {
            const { id, ...avatar } = data;
            return userService.updateAvatar(id, avatar);
        },
        onSuccess: (data) => {
            // Cập nhật thông tin người dùng trong Redux store
            dispatch(updateUser({ id: users.id, ...data?.data }));
            message.success('Avatar cập nhật thành công!');
        },
        onError: (error) => {
            message.error('Có lỗi xảy ra khi cập nhật avatar.');
        },
    });


    useEffect(() => {
        if (isSuccess && checkStatusResponse(data)) {
            dispatch(updateUser({ id: users.id, ...data?.data }));
            message.success('Cập nhật thành công');
        } else if (isError) {
            message.error('Cập nhật thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError, data]);

    useEffect(() => {
        if (users) {
            setEmail(users.email);
            setUserName(users.userName);
            setPhone(users.phone);
            setAddress(users.address);
            setAvatar(users.avatar);
            setGender(users.gender);
            setDateOfBirth(users.dateOfBirth);
            setQualification(users.qualification);
            setSpecialty(users.specialty);
            setDescription(users.description);
        }
    }, [users]);

    const handleOnChangeAvatar = (file) => {
        console.log(file);
        setAvatar(file);
    };

    const handleOnChangeName = (e) => {
        setUserName(e.target.value);
    };

    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleOnChangePhone = (e) => {
        setPhone(e.target.value);
    };

    const handleOnChangeAddress = (e) => {
        setAddress(e.target.value);
    };

    const handleOnChangeGender = (e) => {
        setGender(e.target.value);
    };

    const handleOnChangeDateOfBirth = (e) => {
        setDateOfBirth(e.target.value);
    };

    const handleOnChangeQualification = (e) => {
        setQualification(e.target.value);
    };

    const handleOnChangeSpecialty = (e) => {
        setSpecialty(e.target.value);
    };

    const handleOnChangeDescription = (e) => {
        setDescription(e.target.value);
    };

    const showModalEdit = () => {
        setIsModalOpenEdit(true);
    };

    const showModalAvatar = () => {
        setIsModalOpenAvatar(true);
    };

    const handleOkAvatar = () => {
        setIsModalOpenAvatar(false);
        mutationAvatar.mutate({ id: users?.id, avatar });
    };

    const handleCancelAvatar = () => {
        setIsModalOpenAvatar(false);
    };

    const handleOkEdit = () => {
        setIsModalOpenEdit(false);
        mutation.mutate({
            id: users?.id,
            userName,
            email,
            phone,
            address,
            gender,
            dateOfBirth,
            qualification,
            specialty,
            description,
        });
    };

    const handleCancelEdit = () => {
        setIsModalOpenEdit(false);
        setAvatar(users.avatar);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Hồ sơ bác sỹ</div>
            <div className={cx('wrapper-content')}>
                <div className={cx('content-left')}>
                    <div className={cx('wrapper-form')}>
                        <div className={cx('form')}>
                            <div className={cx('title-form-top')}>Thông tin tài khoản</div>
                            <div className={cx('form-user-email')}>
                                <div className={cx('form-label')}>
                                    <label htmlFor="User">HỌ VÀ TÊN</label>
                                    <Input value={users?.userName} className={cx('input')} disabled={true} />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="email">EMAIL</label>
                                    <Input className={cx('input')} disabled={true} value={users?.email} />
                                </div>
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">SỐ ĐIỆN THOẠI</label>
                                <Input className={cx('input')} disabled={true} value={users?.phone} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="address">ĐỊA CHỈ</label>
                                <Input className={cx('input')} disabled={true} value={users?.address} />
                            </div>
                            <div className={cx('wrapper-btn')}>
                                <Button className={cx('btn')} type="primary" onClick={showModalEdit}>
                                    Chỉnh sửa
                                </Button>
                            </div>
                        </div>
                        <div className={cx('form')}>
                            <div className={cx('title-form-top')}>Thông tin chi tiết</div>
                            <div className={cx('form-label')}>
                                <label htmlFor="level">TRÌNH ĐỘ</label>
                                <Radio.Group name="gender" value={users?.qualification} disabled={true}>
                                    <Radio value="Thạc sĩ">THẠC SĨ</Radio>
                                    <Radio value="Tiến sĩ">TIẾN SĨ</Radio>
                                    <Radio value="Chuyên khoa A">CHUYÊN KHOA A</Radio>
                                </Radio.Group>
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="gender">GIỚI TÍNH</label>
                                <Radio.Group name="gender" value={users?.gender} disabled={true}>
                                    <Radio value={1}>Nam</Radio>
                                    <Radio value={2}>Nữ</Radio>
                                    <Radio value={3}>Khác</Radio>
                                </Radio.Group>
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="dateOfBirth">NGÀY SINH</label>
                                <Input
                                    className={cx('input')}
                                    disabled={true}
                                    value={convertISODateToLocalDate(users?.dateOfBirth || '2000-01-01')}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="specialty">CHUYÊN KHOA</label>
                                <Input className={cx('input')} disabled={true} value={users?.specialty} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="workplace">NƠI CÔNG TÁC</label>
                                <Input className={cx('input')} disabled={true} value="Hà Nội" />
                            </div>
                            <div className={cx('more-info')}>
                                <label htmlFor="introduce">GIỚI THIỆU THÊM</label>
                                <div className={cx('info')}>{users?.description}</div>
                            </div>
                            <div className={cx('wrapper-btn')}>
                                <Button className={cx('btn')} type="primary" onClick={showModalEdit}>
                                    Chỉnh sửa
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-right')}>
                    <div className={cx('wrapper-avatar')}>
                        <img
                            className={cx('avatar')}
                            src={users?.avatar ? users?.avatar : images.defaultAvatar}
                            alt="avatar"
                        />
                    </div>
                    <div className={cx('upload-avatar')}>
                        <div className={cx('upload')} onClick={showModalAvatar}>
                            <CameraOutlined style={{ fontSize: '25px' }} />
                        </div>
                    </div>
                    <Modal
                        title="Chỉnh sửa avatar"
                        open={isModalOpenAvatar}
                        onOk={handleOkAvatar}
                        onCancel={handleCancelAvatar}
                    >
                        <InputUpload type="file" avatar={avatar} onChange={handleOnChangeAvatar} />
                    </Modal>
                    <div className={cx('content-right-info')}>
                        <div className={cx('content-right-name')}>Bác sĩ {users?.userName}</div>
                        <div className={cx('content-right-specialty')}>{users?.qualification}</div>
                    </div>
                </div>
            </div>
            <Modal
                title={<div className={cx('title-model-edit')}>Chỉnh sửa hồ sơ bác sỹ </div>}
                open={isModalOpenEdit}
                onCancel={handleCancelEdit}
                width="50%"
                style={{ top: '5px' }}
                footer={null}
            >
                <Loading isLoading={isLoading}>
                    <div className={cx('footer-edit')}>
                        <div className={cx('content-send')}>
                            <div className={cx('form')}>
                                <div className={cx('form-user-email')}>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="User">HỌ VÀ TÊN</label>
                                        <Input value={userName} className={cx('input')} onChange={handleOnChangeName} />
                                    </div>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="email">EMAIL</label>
                                        <Input className={cx('input')} value={email} onChange={handleOnChangeEmail} />
                                    </div>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="phone">SỐ ĐIỆN THOẠI</label>
                                    <Input className={cx('input')} value={phone} onChange={handleOnChangePhone} />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="address">ĐỊA CHỈ</label>
                                    <Input className={cx('input')} value={address} onChange={handleOnChangeAddress} />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="level">TRÌNH ĐỘ</label>
                                    <Radio.Group
                                        name="gender"
                                        value={qualification}
                                        onChange={handleOnChangeQualification}
                                    >
                                        <Radio value="Thạc sĩ">THẠC SĨ</Radio>
                                        <Radio value="Tiến sĩ">TIẾN SĨ</Radio>
                                        <Radio value="Chuyên khoa A">CHUYÊN KHOA A</Radio>
                                    </Radio.Group>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="gender">GIỚI TÍNH</label>
                                    <Radio.Group name="gender" value={gender} onChange={handleOnChangeGender}>
                                        <Radio value={1}>Nam</Radio>
                                        <Radio value={2}>Nữ</Radio>
                                        <Radio value={3}>Khác</Radio>
                                    </Radio.Group>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="dateOfBirth">NGÀY SINH</label>
                                    <DatePicker
                                        format={'YYYY-MM-DD'}
                                        value={dayjs(
                                            convertISODateToLocalDate(dateOfBirth || '2000-01-01'),
                                            'YYYY-MM-DD',
                                        )}
                                        onChange={handleOnChangeDateOfBirth}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="specialty">CHUYÊN KHOA</label>
                                    <Input
                                        className={cx('input')}
                                        value={specialty}
                                        onChange={handleOnChangeSpecialty}
                                    />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="workplace">NƠI CÔNG TÁC</label>
                                    <Input className={cx('input')} value="Hà Nội" />
                                </div>
                                <div className={cx('more-info')}>
                                    <label htmlFor="introduce">GIỚI THIỆU THÊM</label>
                                    <textarea
                                        className={cx('info')}
                                        value={description}
                                        onChange={handleOnChangeDescription}
                                    />
                                </div>
                            </div>
                            <div className={cx('wrapper-btn-save')}>
                                <Button className={cx('btn')} type="primary" onClick={handleOkEdit}>
                                    Lưu
                                </Button>
                            </div>
                        </div>
                    </div>
                </Loading>
            </Modal>
        </div>
    );
};

export default DoctorProfile;
