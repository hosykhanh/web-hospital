import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './DetailDoctor.module.scss';
import images from '../../../assets';
import { DatePicker, Input, message, Modal, Radio } from 'antd';
import Button from '../../Button/Button';
import dayjs from 'dayjs';
import convertISODateToLocalDate from '../../../utils/convertISODateToLocalDate';
import { ArrowLeftOutlined, CameraOutlined } from '@ant-design/icons';
import PersonalSchedule from '../PersonalSchedule/PersonalSchedule';
import * as userService from '../../../services/userServices';
import * as clinicService from '../../../services/clinicService';
import { useMutation, useQuery } from 'react-query';
import checkStatusResponse from '../../../utils/checkStatusResponse';
import InputUpload from '../../InputUpload/InputUpload';
import TextArea from 'antd/es/input/TextArea';
import Loading from '../../Loading/Loading';

const cx = classNames.bind(styles);

const DetailDoctor = ({ onBack, rowSelected, refetch }) => {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalOpenAvatar, setIsModalOpenAvatar] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);

    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [commune, setCommune] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [gender, setGender] = useState('1');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [qualification, setQualification] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [description, setDescription] = useState('');

    const getDoctor = async () => {
        const res = await userService.getUser(rowSelected);
        return res.data;
    };

    const {
        // isLoading: isLoadingDoctor,
        data: dataDoctor,
        refetch: refetchDoctor,
    } = useQuery(['doctor', rowSelected], getDoctor, {
        enabled: !!rowSelected,
    });

    // --- API GET CLINIC ---
    const { data: dataClinic } = useQuery(['clinic'], () => clinicService.getClinicById(dataDoctor?.clinicId), {
        enabled: !!dataDoctor?.clinicId,
        select: (data) => data?.data,
    });

    useEffect(() => {
        if (dataDoctor) {
            setEmail(dataDoctor.email);
            setUserName(dataDoctor.userName);
            setPhoneNumber(dataDoctor.phoneNumber);
            setProvince(dataDoctor.province);
            setDistrict(dataDoctor.district);
            setCommune(dataDoctor.commune);
            setAddress(dataDoctor.address);
            setAvatar(dataDoctor.avatar);
            setGender(dataDoctor.gender);
            setDateOfBirth(dataDoctor.dateOfBirth);
            setQualification(dataDoctor.qualification);
            setSpecialty(dataDoctor.specialty);
            setDescription(dataDoctor.description);
        }
    }, [dataDoctor]);

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
            message.success('Avatar cập nhật thành công!');
            refetchDoctor();
        },
        onError: (error) => {
            message.error('Có lỗi xảy ra khi cập nhật avatar.');
        },
    });

    const mutationDeleteDoctor = useMutation({
        mutationFn: (data) => userService.deleteUser(data),
        onSuccess: () => {
            message.success('Xoá bác sĩ thành công!');
            onBack();
            refetch();
        },
        onError: () => {
            message.error('Xoá bác sĩ thất bại!');
        },
    });

    useEffect(() => {
        if (isSuccess && checkStatusResponse(data)) {
            message.success('Cập nhật thành công');
            refetchDoctor();
        } else if (isError) {
            message.error('Cập nhật thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError, data]);

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
        setPhoneNumber(e.target.value);
    };

    const handleOnChangeAddress = (e) => {
        setAddress(e.target.value);
    };

    const handleOnChangeProvince = (e) => {
        setProvince(e.target.value);
    };

    const handleOnChangeDistrict = (e) => {
        setDistrict(e.target.value);
    };

    const handleOnChangeCommune = (e) => {
        setCommune(e.target.value);
    };

    const handleOnChangeGender = (e) => {
        setGender(e.target.value);
    };

    const handleOnChangeDateOfBirth = (date, dateString) => {
        setDateOfBirth(dateString);
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

    const showModalAvatar = () => {
        setIsModalOpenAvatar(true);
    };

    const handleOkAvatar = () => {
        setIsModalOpenAvatar(false);
        mutationAvatar.mutate({ id: dataDoctor?._id, avatar });
    };

    const handleCancelAvatar = () => {
        setIsModalOpenAvatar(false);
    };

    const showModalEdit = () => {
        setIsModalOpenEdit(true);
    };

    const handleOkEdit = () => {
        setIsModalOpenEdit(false);
        mutation.mutate({
            id: dataDoctor?._id,
            userName,
            email,
            phoneNumber,
            address,
            province,
            district,
            commune,
            gender,
            dateOfBirth,
            qualification,
            specialty,
            description,
        });
    };

    const handleCancelEdit = () => {
        setIsModalOpenEdit(false);
    };

    const showModalDelete = () => {
        setIsModalDelete(true);
    };

    const handleCancelDelete = () => {
        setIsModalDelete(false);
    };

    const handleOkDelete = () => {
        mutationDeleteDoctor.mutate(rowSelected);
        setIsModalDelete(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div>
                <button onClick={onBack} className={cx('back')}>
                    <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                </button>
            </div>
            <div className={cx('title')}>Thông tin bác sỹ</div>
            <div className={cx('wrapper-content')}>
                <div className={cx('content-left')}>
                    <div className={cx('wrapper-form')}>
                        <div className={cx('form')}>
                            <div className={cx('title-form-top')}>Thông tin tài khoản</div>
                            <div className={cx('form-grid-1')}>
                                <div className={cx('form-label')}>
                                    <label htmlFor="User">HỌ VÀ TÊN</label>
                                    <Input
                                        value={dataDoctor?.userName}
                                        className={cx('input')}
                                        required
                                        disabled={true}
                                    />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="email">EMAIL</label>
                                    <Input className={cx('input')} required disabled={true} value={dataDoctor?.email} />
                                </div>
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">SỐ ĐIỆN THOẠI</label>
                                <Input
                                    className={cx('input')}
                                    required
                                    disabled={true}
                                    value={dataDoctor?.phoneNumber}
                                />
                            </div>
                            <div className={cx('form-grid-1')}>
                                <div className={cx('form-label')}>
                                    <label htmlFor="Province">TỈNH/ THÀNH PHỐ</label>
                                    <Input value={dataDoctor?.province} className={cx('input')} disabled={true} />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="District">QUẬN/ HUYỆN</label>
                                    <Input className={cx('input')} disabled={true} value={dataDoctor?.district} />
                                </div>
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="Commune">PHƯỜNG/ XÃ</label>
                                <Input className={cx('input')} disabled={true} value={dataDoctor?.commune} />
                            </div>
                            <div className={cx('form-label')} style={{ marginBottom: '40px' }}>
                                <label htmlFor="address">ĐỊA CHỈ</label>
                                <Input className={cx('input')} required disabled={true} value={dataDoctor?.address} />
                            </div>
                            <div className={cx('title-form-top')}>Thông tin chi tiết</div>
                            <div className={cx('form-label')}>
                                <label htmlFor="level">TRÌNH ĐỘ</label>
                                <Radio.Group name="qualification" value={dataDoctor?.qualification} disabled={true}>
                                    <Radio value="Thạc sĩ">THẠC SĨ</Radio>
                                    <Radio value="Tiến sĩ">TIẾN SĨ</Radio>
                                    <Radio value="Chuyên khoa A">CHUYÊN KHOA A</Radio>
                                </Radio.Group>
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="gender">GIỚI TÍNH</label>
                                <Radio.Group name="gender" value={dataDoctor?.gender} disabled={true}>
                                    <Radio value={1}>Nam</Radio>
                                    <Radio value={2}>Nữ</Radio>
                                    <Radio value={3}>Khác</Radio>
                                </Radio.Group>
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="dateOfBirth">NGÀY SINH</label>
                                <Input
                                    className={cx('input')}
                                    required
                                    disabled={true}
                                    value={convertISODateToLocalDate(dataDoctor?.dateOfBirth || '01/01/2000')}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="specialty">CHUYÊN KHOA</label>
                                <Input className={cx('input')} required disabled={true} value={dataDoctor?.specialty} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="workplace">NƠI CÔNG TÁC</label>
                                <Input className={cx('input')} required disabled={true} value={dataClinic?.address} />
                            </div>
                            <div className={cx('more-info')}>
                                <label htmlFor="introduce">GIỚI THIỆU THÊM</label>
                                <div className={cx('info')}>{dataDoctor?.description}</div>
                            </div>
                            <div className={cx('wrapper-btn')}>
                                <Button className={cx('btn-edit')} type="primary" onClick={showModalEdit}>
                                    Chỉnh sửa
                                </Button>
                                <Button className={cx('btn-delete')} type="primary" onClick={showModalDelete}>
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-right')}>
                    <div className={cx('wrapper-avatar')}>
                        <img
                            className={cx('avatar')}
                            src={dataDoctor?.avatar ? dataDoctor?.avatar : images.defaultAvatar}
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
                        <div className={cx('content-right-name')}>Bác sĩ {dataDoctor?.userName}</div>
                        <div className={cx('content-right-specialty')}>{dataDoctor?.qualification}</div>
                    </div>
                    <div className={cx('schedule')}>
                        <PersonalSchedule doctorId={rowSelected} />
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
                                <div className={cx('form-grid-1')}>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="User">HỌ VÀ TÊN</label>
                                        <Input
                                            value={userName}
                                            className={cx('input')}
                                            required
                                            onChange={handleOnChangeName}
                                        />
                                    </div>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="email">EMAIL</label>
                                        <Input
                                            className={cx('input')}
                                            required
                                            value={email}
                                            onChange={handleOnChangeEmail}
                                        />
                                    </div>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="phone">SỐ ĐIỆN THOẠI</label>
                                    <Input
                                        className={cx('input')}
                                        required
                                        value={phoneNumber}
                                        onChange={handleOnChangePhone}
                                    />
                                </div>
                                <div className={cx('form-grid-1')}>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="Province">TỈNH/ THÀNH PHỐ</label>
                                        <Input
                                            value={province}
                                            className={cx('input')}
                                            onChange={handleOnChangeProvince}
                                        />
                                    </div>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="District">QUẬN/ HUYỆN</label>
                                        <Input
                                            className={cx('input')}
                                            value={district}
                                            onChange={handleOnChangeDistrict}
                                        />
                                    </div>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="Commune">PHƯỜNG/ XÃ</label>
                                    <Input className={cx('input')} value={commune} onChange={handleOnChangeCommune} />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="address">ĐỊA CHỈ</label>
                                    <Input
                                        className={cx('input')}
                                        required
                                        value={address}
                                        onChange={handleOnChangeAddress}
                                    />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="level">TRÌNH ĐỘ</label>
                                    <Radio.Group
                                        name="qualification"
                                        value={qualification}
                                        onChange={handleOnChangeQualification}
                                    >
                                        <Radio value="Thạc sĩ">THẠC SĨ</Radio>
                                        <Radio value="Tiến sĩ">TIẾN SĨ</Radio>
                                        <Radio value="Chuyên khoa A">CHUYÊN KHOA A</Radio>
                                    </Radio.Group>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="gender" disabled={true}>
                                        GIỚI TÍNH
                                    </label>
                                    <Radio.Group name="gender" value={gender} onChange={handleOnChangeGender}>
                                        <Radio value={1}>Nam</Radio>
                                        <Radio value={2}>Nữ</Radio>
                                        <Radio value={3}>Khác</Radio>
                                    </Radio.Group>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="dateOfBirth">NGÀY SINH</label>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={dayjs(convertISODateToLocalDate(dateOfBirth, 'YYYY-MM-DD'))}
                                        onChange={handleOnChangeDateOfBirth}
                                    />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="specialty">CHUYÊN KHOA</label>
                                    <Input
                                        className={cx('input')}
                                        required
                                        value={specialty}
                                        onChange={handleOnChangeSpecialty}
                                    />
                                </div>
                                <div className={cx('more-info')}>
                                    <label htmlFor="introduce">GIỚI THIỆU THÊM</label>
                                    <TextArea
                                        className={cx('info')}
                                        value={description}
                                        onChange={handleOnChangeDescription}
                                    ></TextArea>
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
            <Modal
                title="Bạn có chắc muốn xóa bác sĩ này?"
                open={isModalDelete}
                onOk={handleOkDelete}
                onCancel={handleCancelDelete}
                okButtonProps={{ style: { backgroundColor: '#ff4d4f' } }}
            />
        </div>
    );
};

export default DetailDoctor;
