import React, { use, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './EditDetailPatient.module.scss';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { DatePicker, Input, InputNumber, message, Radio, Select } from 'antd';
import TableComp from '../../TableComp/TableComp';
import Button from '../../Button/Button';
import dayjs from 'dayjs';
import convertISODateToLocalDate from '../../../utils/convertISODateToLocalDate';
import UpdateExaminationDrawer from '../../UpdateExaminationDrawer/UpdateExaminationDrawer';
import { useMutation } from 'react-query';
import * as userService from '../../../services/userServices';
import * as patientService from '../../../services/patientService';
import ModalConfirm from '../../ModalConfirm/ModalConfirm';
import { set } from 'date-fns';

const cx = classNames.bind(styles);

const EditDetailPatient = ({ onBack, dataUser, dataTable, dataHealthRecord, refetchUser, refetchHealthRecord }) => {
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('1');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [commune, setCommune] = useState('');

    const [bloodType, setBloodType] = useState('');
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [healthHistory, setHealthHistory] = useState('');

    const bloodTypeData = ['A', 'B', 'AB', 'O'];

    useEffect(() => {
        if (dataUser) {
            setEmail(dataUser.email);
            setUserName(dataUser.userName);
            setPhoneNumber(dataUser.phoneNumber);
            setAddress(dataUser.address);
            setGender(dataUser.gender);
            setDateOfBirth(dataUser.dateOfBirth);
            setProvince(dataUser.province);
            setDistrict(dataUser.district);
            setCommune(dataUser.commune);
        }
    }, [dataUser]);

    useEffect(() => {
        if (dataHealthRecord) {
            setBloodType(dataHealthRecord.bloodType);
            setHeight(dataHealthRecord.height);
            setWeight(dataHealthRecord.weight);
            setHealthHistory(dataHealthRecord.healthHistory);
        }
    }, [dataHealthRecord]);

    const mutationUser = useMutation({
        mutationFn: (data) => {
            const { id, ...rests } = data;
            return userService.updateUser(id, rests);
        },
        onSuccess: () => {
            refetchUser();
            message.success('Cập nhật thành công');
            onBack();
        },
        onError: () => {
            message.error('Cập nhật thất bại');
        },
    });

    const mutationUpdateHealthRecord = useMutation({
        mutationFn: async (data) => {
            const { id, ...rests } = data;
            const response = await patientService.updateHealthRecord(id, rests);
            console.log('response', response.data);
            return response?.data;
        },
        onSuccess: () => {
            refetchHealthRecord();
            message.success('Cập nhật thành công');
            onBack();
        },
        onError: () => {
            message.error('Cập nhật thất bại');
        },
    });

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('view')} onClick={() => setIsOpenDrawer(true)}>
                    Chi tiết
                </button>
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
                    onClick={() => setIsDeleteModalOpen(true)}
                />
            </div>
        );
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ngày khám',
            dataIndex: 'examinationDate',
            render: (text, record) => convertISODateToLocalDate(record.examinationDate),
        },
        {
            title: 'Dịch vụ khám',
            dataIndex: 'medicalServiceName',
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    const handleSubmit = async () => {
        mutationUpdateHealthRecord.mutate({ id: dataUser._id, bloodType, height, weight, healthHistory });
        mutationUser.mutate({
            id: dataUser._id,
            email,
            userName,
            phoneNumber,
            address,
            gender,
            dateOfBirth,
            province,
            district,
            commune,
        });
    };

    const mutationMedicalConsultationHistory = useMutation({
        mutationFn: (data) => patientService.deleteMedicalConsultationHistory(data),
    });

    return (
        <div>
            <div className={cx('title')}>Chỉnh sửa thông tin bệnh nhân</div>
            <div className={cx('wrapper')}>
                <div>
                    <button onClick={onBack} className={cx('back')}>
                        <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                    </button>
                </div>
                <div className={cx('form')}>
                    <div className={cx('form-1')}>
                        <div className={cx('title-form')}>Thông tin cá nhân</div>
                        <div className={cx('form-grid-1')}>
                            <div className={cx('form-label')}>
                                <label htmlFor="PatientID">MÃ BỆNH NHÂN</label>
                                <Input value={dataUser?._id} className={cx('input')} required disabled={true} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="User">HỌ VÀ TÊN</label>
                                <Input
                                    value={userName}
                                    className={cx('input')}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="dateOfBirth" style={{ marginBottom: '5px' }}>
                                    NGÀY SINH
                                </label>
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    value={dayjs(dateOfBirth, 'YYYY-MM-DD')}
                                    onChange={(date) => setDateOfBirth(date)}
                                />
                            </div>
                            <></>
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="gender">GIỚI TÍNH:</label>
                            <Radio.Group name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                <Radio value={1}>Nam</Radio>
                                <Radio value={2}>Nữ</Radio>
                                <Radio value={3}>Khác</Radio>
                            </Radio.Group>
                        </div>
                        <div className={cx('form-grid-2')}>
                            <div className={cx('form-label')}>
                                <label htmlFor="email">EMAIL:</label>
                                <Input
                                    className={cx('input')}
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">SỐ ĐIỆN THOẠI:</label>
                                <Input
                                    className={cx('input')}
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('form-grid-2')}>
                            <div className={cx('form-label')}>
                                <label htmlFor="conscious">TỈNH/ THÀNH PHỐ:</label>
                                <Input
                                    className={cx('input')}
                                    required
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="district">QUẬN/ HUYỆN:</label>
                                <Input
                                    className={cx('input')}
                                    required
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('form-grid-2')}>
                            <div className={cx('form-label')}>
                                <label htmlFor="address">ĐỊA CHỈ:</label>
                                <Input
                                    className={cx('input')}
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="commune">PHƯỜNG/ XÃ:</label>
                                <Input
                                    className={cx('input')}
                                    required
                                    value={commune}
                                    onChange={(e) => setCommune(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cx('title-form')}>Hồ sơ sức khỏe</div>
                    <div className={cx('form-grid-2')}>
                        <div>
                            <div className={cx('form-label')}>
                                <label htmlFor="blood">NHÓM MÁU:</label>
                                <Select
                                    style={{
                                        width: 80,
                                    }}
                                    value={bloodType}
                                    onChange={(e) => setBloodType(e)}
                                    options={bloodTypeData.map((city) => ({
                                        label: city,
                                        value: city,
                                    }))}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">CHIỀU CAO:</label>
                                <InputNumber
                                    formatter={(value) => `${value} cm`}
                                    value={height}
                                    onChange={(e) => setHeight(e)}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">CÂN NẶNG:</label>
                                <InputNumber
                                    formatter={(value) => `${value} Kg`}
                                    value={weight}
                                    onChange={(e) => setWeight(e)}
                                />
                            </div>
                        </div>
                        <div className={cx('form-label')} style={{ display: 'flex', flexDirection: 'column' }}>
                            <label>TIỀN SỬ BỆNH LÝ:</label>
                            <textarea
                                className={cx('medical-history')}
                                value={healthHistory}
                                onChange={(e) => setHealthHistory(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className={cx('wrapper-btn')}>
                        <Button className={cx('btn')} type="primary" onClick={handleSubmit}>
                            Lưu
                        </Button>
                    </div>
                </div>
                <div className={cx('title')}>Lịch sử khám bệnh</div>
                <div className={cx('table')}>
                    <TableComp
                        columns={columns}
                        data={dataTable}
                        // isLoading={isLoadingUser}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    setRowSelected(record._id);
                                },
                            };
                        }}
                        // mutation={mutationDelMany}
                        // refetch={refetch}
                        defaultPageSize={8}
                    />
                </div>
            </div>
            <UpdateExaminationDrawer
                visible={isOpenDrawer}
                setIsOpenDrawer={setIsOpenDrawer}
                rowSelected={rowSelected}
                // refetch={refetch}
            />
            <ModalConfirm
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                rowSelected={rowSelected}
                title="Bạn có chắc chắn xóa lịch sử khám bệnh này này?"
                // refetch={refetch}
                mutation={mutationMedicalConsultationHistory}
            />
        </div>
    );
};

export default EditDetailPatient;
