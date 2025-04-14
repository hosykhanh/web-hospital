import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './DetailClinic.module.scss';
import images from '../../../assets';
import { Input, Tag } from 'antd';
import Button from '../../Button/Button';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TableComp from '../../TableComp/TableComp';
import DetailDoctor from '../../DoctorManagement/DetailDoctor/DetailDoctor';
import * as doctorService from '../../../services/doctorService';
import * as clinicService from '../../../services/clinicService';
import * as scheduleService from '../../../services/scheduleService';
import { useQuery } from 'react-query';

const cx = classNames.bind(styles);

const DetailClinic = ({ onBack, rowSelectedClinic }) => {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

    // --- API GET CLINICS BY ID ---
    const getClinicById = async () => {
        const res = await clinicService.getClinicById(rowSelectedClinic);
        console.log('res', res);
        return res.data;
    };

    const {
        isLoading: isLoadingClinic,
        data: dataClinic,
        refetch: refetchClinic,
    } = useQuery(['clinic', rowSelectedClinic], getClinicById, {
        enabled: !!rowSelectedClinic,
    });

    // --- API GET ALL DOCTORS ---
    const getAllDoctors = async () => {
        const res = await doctorService.getAllDoctors();
        return res.data.items;
    };

    const {
        isLoading: isLoadingDoctors,
        data: dataDoctors,
        refetch: refetchDoctors,
    } = useQuery(['doctors', rowSelectedClinic], getAllDoctors, {
        enabled: !!rowSelectedClinic,
    });

    const {
        data: dataClinicSchedule,
        isLoading: isLoadingClinicSchedule,
        refetch: refetchClinicSchedule,
    } = useQuery(['clinicSchedule', rowSelectedClinic], () => scheduleService.getClinicSchedule(rowSelectedClinic), {
        enabled: !!rowSelectedClinic,
        select: (data) => data?.data,
    });

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

    const columns = [
        {
            title: 'Mã bác sĩ',
            dataIndex: 'code',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'userName',
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
                <DetailDoctor onBack={() => setIsDetailVisible(false)} rowSelected={rowSelected} />
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
                                                <Input
                                                    value={dataClinic?.name}
                                                    className={cx('input')}
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <div className={cx('form-label')}>
                                                <label htmlFor="Status">TRẠNG THÁI</label>
                                                <Input
                                                    className={cx('input')}
                                                    required
                                                    value={dataClinic?.status === 1 ? 'Đang hoạt động' : 'Tạm dừng'}
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
                                                    value={dataClinic?.email}
                                                    disabled
                                                />
                                            </div>
                                            <div className={cx('form-label')}>
                                                <label htmlFor="phone">HOLINE</label>
                                                <Input
                                                    className={cx('input')}
                                                    required
                                                    value={dataClinic?.hotline}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className={cx('form-label')}>
                                            <label htmlFor="address">ĐỊA CHỈ</label>
                                            <Input
                                                className={cx('input')}
                                                required
                                                value={dataClinic?.address}
                                                disabled
                                            />
                                        </div>
                                        <div className={cx('form-label')}>
                                            <label htmlFor="address">THỜI GIAN LÀM VIỆC</label>
                                            <div className="mt-4">
                                                {dataClinicSchedule?.map((time) => (
                                                    <Tag
                                                        key={time?._id}
                                                        color="blue"
                                                        style={{ marginRight: 5, fontSize: 14 }}
                                                    >
                                                        {time?.startTime} - {time?.endTime}
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
                                    data={dataDoctors}
                                    isLoading={isLoadingDoctors}
                                    onRow={(record, rowIndex) => {
                                        return {
                                            onClick: (event) => {
                                                setRowSelected(record._id);
                                            },
                                        };
                                    }}
                                    // mutation={mutationDelMany}
                                    refetch={refetchDoctors}
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
