import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './CreateDoctor.module.scss';
import { DatePicker, Input, message, Radio } from 'antd';
import Button from '../../Button/Button';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from 'react-query';
import checkStatusResponse from '../../../utils/checkStatusResponse';
import { districts, getProvinces, wards } from 'vietnam-provinces';
import Loading from '../../Loading/Loading';
import TextArea from 'antd/lib/input/TextArea';
import * as clinicService from '../../../services/clinicService';
import * as doctorService from '../../../services/doctorService';

const cx = classNames.bind(styles);

const CreateDoctor = ({ onBack, refetch }) => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [commune, setCommune] = useState('');
    const [address, setAddress] = useState('');
    // const [avatar, setAvatar] = useState(null);
    const [gender, setGender] = useState('1');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [qualification, setQualification] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [description, setDescription] = useState('');

    const [provincesList, setProvincesList] = useState([]);
    const [districtsList, setDistrictsList] = useState([]);
    const [wardsList, setWardsList] = useState([]);
    const [clinicId, setClinicId] = useState('');

    // --- API GET ALL CLINICS ---
    const { data: dataClinics } = useQuery(['clinics'], () => clinicService.getAllClinics(), {
        enabled: true,
        select: (data) => data?.data?.items,
    });

    const mutation = useMutation({
        mutationFn: (data) => {
            return doctorService.createDoctor(data);
        },
    });

    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess && checkStatusResponse(data)) {
            message.success('Tạo mới bác sĩ thành công');
            onBack();
            refetch();
        } else if (isError) {
            message.error('Tạo mới bác sĩ thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError, data]);

    // Load provinces on component mount
    useEffect(() => {
        const allProvinces = getProvinces();
        setProvincesList(allProvinces);
    }, []);

    // Load districts when province changes
    useEffect(() => {
        if (province) {
            const filteredDistricts = districts.filter((district) => district.province_name === province);
            setDistrictsList(filteredDistricts);
            setWardsList([]);
        }
    }, [province]);

    // Load wards when district changes
    useEffect(() => {
        if (district) {
            const filteredWards = wards.filter((ward) => ward.district_name === district);
            setWardsList(filteredWards);
        }
    }, [district]);

    const handleSubmit = () => {
        mutation.mutate({
            userName,
            email,
            password,
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
            clinicId,
        });
    };

    return (
        <div>
            <div>
                <button onClick={onBack} className={cx('back')}>
                    <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                </button>
            </div>
            <div className={cx('wrapper-content')}>
                <div className={cx('form')}>
                    <div className={cx('formHeader')}>
                        <h2>Thêm mới bác sĩ</h2>
                        <p>Vui lòng điền đầy đủ thông tin để thêm bác sĩ</p>
                    </div>
                    {/* <div className={cx('wrapper-avatar')}>
                        <img className={cx('avatar')} src={images.avatar} alt="avatar" />
                    </div> */}
                    <div className={cx('form-grid-1')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="User">HỌ VÀ TÊN</label>
                            <Input
                                value={userName}
                                className={cx('input')}
                                required
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Nhập họ và tên"
                            />
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="email">EMAIL</label>
                            <Input
                                className={cx('input')}
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
                            />
                        </div>
                    </div>
                    <div className={cx('form-grid-1')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="password">MẬT KHẨU</label>
                            <Input.Password
                                className={cx('input')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Nhập mật khẩu"
                            />
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="phone">SỐ ĐIỆN THOẠI</label>
                            <Input
                                className={cx('input')}
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                    </div>
                    <div className={cx('form-grid-1')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="Province">TỈNH/ THÀNH PHỐ</label>
                            <select
                                name="patientProvince"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                className={cx('formInput', 'formSelect')}
                            >
                                <option value="">Chọn tỉnh/thành phố</option>

                                {provincesList.map((province) => (
                                    <option key={province.code} value={province.name}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="District">QUẬN/ HUYỆN</label>
                            <select
                                name="patientDistrict"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className={cx('formInput', 'formSelect')}
                                disabled={!province}
                            >
                                <option value="">Chọn quận/huyện</option>
                                {districtsList.map((district) => (
                                    <option key={district.code} value={district.name}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={cx('form-grid-1')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="address">ĐỊA CHỈ</label>
                            <Input
                                className={cx('input')}
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Nhập địa chỉ"
                            />
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="Commune">PHƯỜNG/ XÃ</label>
                            <select
                                name="patientCommune"
                                value={commune}
                                onChange={(e) => setCommune(e.target.value)}
                                className={cx('formInput', 'formSelect')}
                                disabled={!district}
                            >
                                <option value="">Chọn phường/xã</option>
                                {wardsList.map((ward) => (
                                    <option key={ward.code} value={ward.name}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="level">TRÌNH ĐỘ</label>
                        <Radio.Group
                            name="gender"
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                        >
                            <Radio value="Thạc sĩ">THẠC SĨ</Radio>
                            <Radio value="Tiến sĩ">TIẾN SĨ</Radio>
                            <Radio value="Chuyên khoa A">CHUYÊN KHOA A</Radio>
                        </Radio.Group>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="gender">GIỚI TÍNH</label>
                        <Radio.Group name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <Radio value={1}>Nam</Radio>
                            <Radio value={2}>Nữ</Radio>
                            <Radio value={3}>Khác</Radio>
                        </Radio.Group>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="dateOfBirth">NGÀY SINH</label>
                        <DatePicker format="DD/MM/YYYY" value={dateOfBirth} onChange={(date) => setDateOfBirth(date)} />
                    </div>

                    <div className={cx('form-label')}>
                        <label>PHÒNG KHÁM</label>
                        <select
                            name="clinic"
                            onChange={(e) => setClinicId(e.target.value)}
                            className={cx('formInput', 'formSelect')}
                        >
                            <option value={''}>Chọn phòng khám</option>
                            {dataClinics?.map((service) => (
                                <option key={service._id} value={service._id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cx('form-label')}>
                        <label htmlFor="specialty">CHUYÊN KHOA</label>
                        <Input
                            className={cx('input')}
                            required
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            placeholder="Nhập chuyên khoa"
                        />
                    </div>
                    <div className={cx('more-info')}>
                        <label htmlFor="introduce">GIỚI THIỆU THÊM</label>
                        <TextArea
                            className={cx('info')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập giới thiệu thêm về bác sĩ"
                        ></TextArea>
                    </div>
                    <div className={cx('wrapper-btn-save')}>
                        <Loading isLoading={isLoading}>
                            <Button className={cx('btn')} type="primary" onClick={handleSubmit}>
                                Xác nhận thêm mới
                            </Button>
                        </Loading>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateDoctor;
