import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './DetailClinic.module.scss';
import images from '../../../assets';
import { Input, Tag } from 'antd';
import Button from '../../Button/Button';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TableComp from '../../TableComp/TableComp';
import DetailDoctor from '../../DoctorManagement/DetailDoctor/DetailDoctor';

const cx = classNames.bind(styles);

const DetailClinic = ({ onBack }) => {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

    const showModalEdit = () => {
        setIsModalOpenEdit(true);
    };

    const handleCancelComment = () => {
        setIsModalOpenEdit(false);
    };

    const timeSlots = [
        '08:00 - 09:00',
        '09:00 - 10:00',
        '10:00 - 11:00',
        '13:00 - 14:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
    ];

    const [rowSelected, setRowSelected] = useState('');
    const [isDetailVisible, setIsDetailVisible] = useState(false);

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('view')} onClick={() => setIsDetailVisible(true)}>
                    Chi tiết
                </button>
            </div>
        );
    };

    const dataUser = {
        length: 8,
        data: [
            {
                _id: 1,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 2,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 3,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 4,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 5,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 6,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 7,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 8,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
        ],
    };

    const columns = [
        {
            title: 'Mã bác sĩ',
            dataIndex: '_id',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'doctor_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Chuyên khoa',
            dataIndex: 'specialty',
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    return (
        <div>
            {isDetailVisible ? (
                <DetailDoctor onBack={() => setIsDetailVisible(false)} />
            ) : (
                <div className={cx('wrapper')}>
                    <div>
                        <button onClick={onBack} className={cx('back')}>
                            <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                        </button>
                    </div>
                    <div className={cx('title')}>Thông tin phòng khám</div>
                    <div className={cx('wrapper-content')}>
                        <div className={cx('content')}>
                            <div className={cx('content-left')}>
                                <div className={cx('wrapper-form')}>
                                    <div className={cx('form')}>
                                        <div className={cx('title-form-top')}>Thông tin chi tiết</div>
                                        <div className={cx('form-user-email')}>
                                            <div className={cx('form-label')}>
                                                <label htmlFor="User">TÊN PHÒNG KHÁM</label>
                                                <Input value="Hà Nội" className={cx('input')} required disabled />
                                            </div>
                                            <div className={cx('form-label')}>
                                                <label htmlFor="Status">TRẠNG THÁI</label>
                                                <Input
                                                    className={cx('input')}
                                                    required
                                                    value="Đang hoạt động"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className={cx('form-user-email')}>
                                            <div className={cx('form-label')}>
                                                <label htmlFor="email">EMAIL</label>
                                                <Input
                                                    className={cx('input')}
                                                    required
                                                    value="clinic@gmail.com"
                                                    disabled
                                                />
                                            </div>
                                            <div className={cx('form-label')}>
                                                <label htmlFor="phone">HOLINE</label>
                                                <Input className={cx('input')} required value="092352352" disabled />
                                            </div>
                                        </div>
                                        <div className={cx('form-label')}>
                                            <label htmlFor="address">ĐỊA CHỈ</label>
                                            <Input className={cx('input')} required value="Hà Nội" disabled />
                                        </div>
                                        <div className={cx('form-label')}>
                                            <label htmlFor="address">THỜI GIAN LÀM VIỆC</label>
                                            <div className="mt-4">
                                                {timeSlots.map((time) => (
                                                    <Tag
                                                        key={time}
                                                        color="blue"
                                                        // closable
                                                        // onClose={() => removeTime(time)}
                                                        style={{ marginRight: 5, fontSize: 14 }}
                                                        // closeIcon={<CloseOutlined style={{ fontSize: '15px'}}/>}
                                                    >
                                                        {time}
                                                    </Tag>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={cx('wrapper-btn')}>
                                            <Button className={cx('btn-edit')} type="primary" onClick={showModalEdit}>
                                                Chỉnh sửa
                                            </Button>
                                            <Button className={cx('btn-delete')} type="primary" onClick={showModalEdit}>
                                                Xóa
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('content-right')}>
                                <div className={cx('wrapper-avatar')}>
                                    <img className={cx('avatar')} src={images.clinic} alt="avatar" />
                                </div>
                                <div className={cx('more-info')}>
                                    <label htmlFor="introduce">GIỚI THIỆU</label>
                                    <div className={cx('info')}>
                                        Phòng khám [Tên Phòng Khám] tự hào mang đến dịch vụ y tế chất lượng cao với đội
                                        ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại và không gian khám chữa
                                        bệnh tiện nghi. Chúng tôi cam kết cung cấp dịch vụ tận tâm, nhanh chóng, giúp
                                        khách hàng an tâm trong hành trình chăm sóc sức khỏe.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('list-doctor')}>
                            <div className={cx('title-list')}>Danh sách bác sĩ</div>
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
                                    defaultPageSize={7}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailClinic;
