import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './EditDetailPatient.module.scss';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { DatePicker, Input, InputNumber, Radio, Select } from 'antd';
import TableComp from '../../TableComp/TableComp';
import Button from '../../Button/Button';
import dayjs from 'dayjs';
import convertISODateToLocalDate from '../../../utils/convertISODateToLocalDate';
import { Option } from 'antd/es/mentions';
import UpdateExaminationDrawer from '../../UpdateExaminationDrawer/UpdateExaminationDrawer';

const cx = classNames.bind(styles);

const EditDetailPatient = ({ onBack }) => {
    const [rowSelected, setRowSelected] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date('2000-02-01'));
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('view')} onClick={() => setIsOpenDrawer(true)}>
                    Chi tiết
                </button>
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
                    // onClick={() => setIsDeleteModalOpen(true)}
                />
            </div>
        );
    };

    const cityData = ['A', 'B', 'AB', 'O'];
    const [secondCity, setSecondCity] = useState(cityData[0]);

    const onSecondCityChange = (value) => {
        setSecondCity(value);
    };

    const dataUser = {
        length: 7, // Độ dài của danh sách
        data: [
            {
                _id: 1,
                patient_id: '123456',
                examination: 'Khám răng',
                date: '01/01/1970',
            },
            {
                _id: 2,
                patient_id: '123456',
                examination: 'Khám răng',
                date: '01/01/1970',
            },
            {
                _id: 3,
                patient_id: '123456',
                examination: 'Khám răng',
                date: '01/01/1970',
            },
            {
                _id: 4,
                patient_id: '123456',
                examination: 'Khám răng',
                date: '01/01/1970',
            },
            {
                _id: 5,
                patient_id: '123456',
                examination: 'Khám răng',
                date: '01/01/1970',
            },
            {
                _id: 6,
                patient_id: '123456',
                examination: 'Khám răng',
                date: '01/01/1970',
            },
            {
                _id: 7,
                patient_id: '123456',
                examination: 'Khám răng',
                date: '01/01/1970',
            },
            {
                _id: 8,
                patient_id: '123456',
                examination: 'Khám răng',
                date: '01/01/1970',
            },
        ],
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: '_id',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Ngày khám',
            dataIndex: 'date',
        },
        {
            title: 'Dịch vụ khám',
            dataIndex: 'examination',
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
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
                                <Input value="12345" className={cx('input')} required disabled={true} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="User">HỌ VÀ TÊN</label>
                                <Input value="Nguyễn Văn A" className={cx('input')} required />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="dateOfBirth" style={{ marginBottom: '5px' }}>
                                    NGÀY SINH
                                </label>
                                <DatePicker
                                    format={'YYYY-MM-DD'}
                                    value={dayjs(convertISODateToLocalDate(dateOfBirth || '2000-01-01'), 'YYYY-MM-DD')}
                                    onChange={(date) => setDateOfBirth(date)}
                                    dateFormat="yyyy-MM-dd"
                                />
                            </div>
                            <></>
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="gender">GIỚI TÍNH:</label>
                            <Radio.Group name="gender">
                                <Radio value="Male">Nam</Radio>
                                <Radio value="Female">Nữ</Radio>
                                <Radio value="Other">Khác</Radio>
                            </Radio.Group>
                        </div>
                        <div className={cx('form-grid-2')}>
                            <div className={cx('form-label')}>
                                <label htmlFor="email">EMAIL:</label>
                                <Input className={cx('input')} required value="nguyenvana@gmail.com" />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">SỐ ĐIỆN THOẠI:</label>
                                <Input className={cx('input')} required value="123456789" />
                            </div>
                        </div>
                        <div className={cx('form-grid-2')}>
                            <div className={cx('form-label')}>
                                <label htmlFor="conscious">TỈNH/ THÀNH PHỐ:</label>
                                <Input className={cx('input')} required value="Hà Nội" />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="district">QUẬN/ HUYỆN:</label>
                                <Input className={cx('input')} required value="Hà Đông" />
                            </div>
                        </div>
                        <div className={cx('form-grid-2')}>
                            <div className={cx('form-label')}>
                                <label htmlFor="address">ĐỊA CHỈ:</label>
                                <Input className={cx('input')} required value="Mỗ Lao" />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="commune">PHƯỜNG/ XÃ:</label>
                                <Input className={cx('input')} required value="Mỗ Lao" />
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
                                    value={secondCity}
                                    onChange={onSecondCityChange}
                                    options={cityData.map((city) => ({
                                        label: city,
                                        value: city,
                                    }))}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">CHIỀU CAO:</label>
                                <InputNumber formatter={(value) => `${value} cm`} defaultValue={170} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">CÂN NẶNG:</label>
                                <InputNumber formatter={(value) => `${value} Kg`} defaultValue={50} />
                            </div>
                        </div>
                        <div className={cx('form-label')} style={{ display: 'flex', flexDirection: 'column' }}>
                            <label>TIỀN SỬ BỆNH LÝ:</label>
                            <textarea className={cx('medical-history')}></textarea>
                        </div>
                    </div>
                    <div className={cx('wrapper-btn')}>
                        <Button className={cx('btn')} type="primary">
                            Lưu
                        </Button>
                    </div>
                </div>
                <div className={cx('title')}>Lịch sử khám bệnh</div>
                <div className={cx('table')}>
                    <TableComp
                        columns={columns}
                        data={dataUser}
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
        </div>
    );
};

export default EditDetailPatient;
