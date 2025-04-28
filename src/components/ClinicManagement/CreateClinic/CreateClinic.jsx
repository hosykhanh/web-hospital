import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './CreateClinic.module.scss';
import { Input, message } from 'antd';
import Button from '../../Button/Button';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useMutation, useQuery } from 'react-query';
import * as clinicService from '../../../services/clinicService';
import * as medicalService from '../../../services/medicalService';
import * as scheduleService from '../../../services/scheduleService';
import MedicalServiceManager from '../MedicalServiceManager/MedicalServiceManager';
import ClinicScheduleManager from '../ClinicScheduleManager/ClinicScheduleManager';

const cx = classNames.bind(styles);

const CreateClinic = ({ onBack, refetch }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [hotline, setHotline] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');

    const [clinicId, setClinicId] = useState('');
    const [isMedicalService, setIsMedicalService] = useState(false);
    const [isClinicSchedule, setIsClinicSchedule] = useState(false);

    const mutation = useMutation({
        mutationFn: (data) => clinicService.createClinic(data),
        onSuccess: (data) => {
            console.log(data);
            setClinicId(data.data._id);
            message.success('Tạo phòng khám thành công!');
            setIsMedicalService(true);
        },
        onError: (error) => {
            message.error(`Tạo phòng khám thất bại! ${error.response.data.message}`);
        },
    });

    const handleCreateClinic = () => {
        mutation.mutate({
            name,
            email,
            hotline,
            address,
            description,
        });
    };

    // --- API GET ALL MEDICAL SERVICE BY CLINIC ID ---
    const {
        isLoading: isLoadingMedicalService,
        data: dataMedicalService,
        refetch: refetchMedicalService,
    } = useQuery(['medicalService', clinicId], () => medicalService.getAllMedicalService(clinicId), {
        enabled: !!clinicId,
        select: (data) => data?.data?.items,
    });

    // --- API GET ALL SCHEDULE BY CLINIC ID ---
    const {
        data: dataClinicSchedule,
        isLoading: isLoadingClinicSchedule,
        refetch: refetchClinicSchedule,
    } = useQuery(['clinicSchedule', clinicId], () => scheduleService.getClinicSchedule(clinicId), {
        enabled: !!clinicId,
        select: (data) => data?.data,
    });

    const handleNextClinicSchedule = () => {
        setIsMedicalService(false);
        setIsClinicSchedule(true);
    };

    const handleCompleteCreateClinic = () => {
        message.success('Hoàn thành tạo phòng khám thành công!');
        onBack();
        refetch();
    };

    return (
        <div>
            <div>
                <button onClick={onBack} className={cx('back')}>
                    <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                </button>
            </div>
            <div className={cx('wrapper-content')}>
                {isMedicalService ? (
                    <div className={cx('form')}>
                        <MedicalServiceManager
                            dataMedicalService={dataMedicalService}
                            isLoadingMedicalService={isLoadingMedicalService}
                            rowSelectedClinic={clinicId}
                            refetchMedicalService={refetchMedicalService}
                        />
                        <div className={cx('formHeader')}>
                            <p>Bạn có thể thêm dịch vụ khám hoặc nhấn tiếp theo để bỏ qua bước này!</p>
                        </div>
                        <div className={cx('wrapper-btn')}>
                            <Button className={cx('btn')} type="primary" onClick={handleNextClinicSchedule}>
                                Tiếp theo
                            </Button>
                        </div>
                    </div>
                ) : isClinicSchedule ? (
                    <div className={cx('form')}>
                        <ClinicScheduleManager
                            dataClinicSchedule={dataClinicSchedule}
                            isLoadingClinicSchedule={isLoadingClinicSchedule}
                            rowSelectedClinic={clinicId}
                            refetchClinicSchedule={refetchClinicSchedule}
                        />
                        <div className={cx('formHeader')}>
                            <p>Bạn có thể thêm thời gian làm việc hoặc nhấn hoàn thành để bỏ qua bước này!</p>
                        </div>
                        <div className={cx('wrapper-btn')}>
                            <Button className={cx('btn')} type="primary" onClick={handleCompleteCreateClinic}>
                                Hoàn thành
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className={cx('form')}>
                        <div className={cx('formHeader')}>
                            <h2>Thêm mới phòng khám</h2>
                            <p>Vui lòng điền đầy đủ thông tin để thêm phòng khám</p>
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="User">TÊN PHÒNG KHÁM</label>
                            <Input
                                className={cx('input')}
                                required
                                placeholder="Nhập tên phòng khám"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className={cx('form-user-email')}>
                            <div className={cx('form-label')}>
                                <label htmlFor="email">EMAIL</label>
                                <Input
                                    className={cx('input')}
                                    required
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">HOLINE</label>
                                <Input
                                    className={cx('input')}
                                    required
                                    placeholder="Nhập số điện thoại"
                                    value={hotline}
                                    onChange={(e) => setHotline(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="address">ĐỊA CHỈ</label>
                            <Input
                                className={cx('input')}
                                required
                                placeholder="Nhập địa chỉ"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className={cx('more-info')}>
                            <label htmlFor="introduce">GIỚI THIỆU THÊM</label>
                            <TextArea
                                className={cx('info')}
                                placeholder="Nhập giới thiệu thêm về phòng khám"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></TextArea>
                        </div>
                        <div className={cx('wrapper-btn')}>
                            <Button className={cx('btn')} type="primary" onClick={handleCreateClinic}>
                                Lưu
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateClinic;
