import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './DetailClinic.module.scss';
import { Input, message, Modal, Tag } from 'antd';
import Button from '../../Button/Button';
import { ArrowLeftOutlined, CameraOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';
import TableComp from '../../TableComp/TableComp';
import DetailDoctor from '../../DoctorManagement/DetailDoctor/DetailDoctor';
import * as doctorService from '../../../services/doctorService';
import * as clinicService from '../../../services/clinicService';
import * as scheduleService from '../../../services/scheduleService';
import * as medicalService from '../../../services/medicalService';
import { useMutation, useQuery } from 'react-query';
import Loading from '../../Loading/Loading';
import InputUpload from '../../InputUpload/InputUpload';
import ClinicScheduleManager from '../ClinicScheduleManager/ClinicScheduleManager';
import MedicalServiceManager from '../MedicalServiceManager/MedicalServiceManager';

const cx = classNames.bind(styles);

const DetailClinic = ({ onBack, rowSelectedClinic, refetch }) => {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalOpenMedicalService, setIsModalOpenMedicalService] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);
    const [isModalOpenLogo, setIsModalOpenLogo] = useState(false);
    const [isModalOpenClinicSchedule, setIsModalOpenClinicSchedule] = useState(false);

    const [rowSelected, setRowSelected] = useState('');
    const [isDetailVisible, setIsDetailVisible] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [hotline, setHotline] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setLogo] = useState(null);

    // --- API GET CLINICS BY ID ---
    const getClinicById = async () => {
        const res = await clinicService.getClinicById(rowSelectedClinic);
        return res.data;
    };

    const {
        isLoading: isLoadingClinic,
        data: dataClinic,
        refetch: refetchClinic,
    } = useQuery(['clinic', rowSelectedClinic], getClinicById, {
        enabled: !!rowSelectedClinic,
    });

    // --- API GET ALL DOCTORS BY CLINIC ---
    const getAllDoctorsByClinic = async () => {
        const res = await doctorService.getDoctorsByClinicId(rowSelectedClinic);
        return res.data;
    };

    const {
        isLoading: isLoadingDoctors,
        data: dataDoctors,
        refetch: refetchDoctors,
    } = useQuery(['doctors', rowSelectedClinic], getAllDoctorsByClinic, {
        enabled: !!rowSelectedClinic,
    });

    // --- API GET ALL MEDICAL SERVICE BY CLINIC ID ---
    const {
        isLoading: isLoadingMedicalService,
        data: dataMedicalService,
        refetch: refetchMedicalService,
    } = useQuery(['medicalService', rowSelectedClinic], () => medicalService.getAllMedicalService(rowSelectedClinic), {
        enabled: !!rowSelectedClinic,
        select: (data) => data?.data?.items,
    });

    // --- API GET ALL SCHEDULE BY CLINIC ID ---
    const {
        data: dataClinicSchedule,
        isLoading: isLoadingClinicSchedule,
        refetch: refetchClinicSchedule,
    } = useQuery(['clinicSchedule', rowSelectedClinic], () => scheduleService.getClinicSchedule(rowSelectedClinic), {
        enabled: !!rowSelectedClinic,
        select: (data) => data?.data,
    });

    useEffect(() => {
        if (dataClinic) {
            setName(dataClinic.name);
            setEmail(dataClinic.email);
            setHotline(dataClinic.hotline);
            setAddress(dataClinic.address);
            setDescription(dataClinic.description);
            setLogo(dataClinic.logo);
        }
    }, [dataClinic]);

    const mutationEdit = useMutation({
        mutationFn: (data) => clinicService.updateClinic(rowSelectedClinic, data),
        onSuccess: () => {
            message.success('Cập nhật phòng khám thành công!');
            refetchClinic();
        },
        onError: () => {
            message.error('Cập nhật phòng khám thất bại!');
        },
    });

    const mutationLogo = useMutation({
        mutationFn: (data) => {
            const { id, ...logo } = data;
            return clinicService.updateLogo(id, logo);
        },
        onSuccess: (data) => {
            message.success('Logo cập nhật thành công!');
            refetchClinic();
        },
        onError: (error) => {
            message.error('Có lỗi xảy ra khi cập nhật logo.');
        },
    });

    const mutationDeleteClinic = useMutation({
        mutationFn: (data) => clinicService.deleteClinic(data),
        onSuccess: () => {
            message.success('Xoá phòng khám thành công!');
            onBack();
            refetch();
        },
        onError: () => {
            message.error('Xoá phòng khám thất bại!');
        },
    });

    const handleOnChangeLogo = (file) => {
        setLogo(file);
    };

    const showModalLogo = () => {
        setIsModalOpenLogo(true);
    };

    const handleOkLogo = () => {
        setIsModalOpenLogo(false);
        mutationLogo.mutate({ id: dataClinic?._id, logo });
    };

    const handleCancelLogo = () => {
        setIsModalOpenLogo(false);
    };

    const showModalEdit = () => {
        setIsModalOpenEdit(true);
    };

    const cancelModalEdit = () => {
        setIsModalOpenEdit(false);
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        if (name === 'name') setName(value);
        if (name === 'email') setEmail(value);
        if (name === 'hotline') setHotline(value);
        if (name === 'address') setAddress(value);
        if (name === 'description') setDescription(value);
    };

    const handleOkEdit = () => {
        mutationEdit.mutate({ name, email, hotline, address, description });
        setIsModalOpenEdit(false);
    };

    const showModalClinicSchedule = () => {
        setIsModalOpenClinicSchedule(true);
    };

    const cancelModalClinicSchedule = () => {
        setIsModalOpenClinicSchedule(false);
    };

    const showModalMedicalService = () => {
        setIsModalOpenMedicalService(true);
    };

    const cancelModalMedicalService = () => {
        setIsModalOpenMedicalService(false);
    };

    const showModalDelete = () => {
        setIsModalDelete(true);
    };

    const cancelModalDelete = () => {
        setIsModalDelete(false);
    };

    const handleOkModalDelete = () => {
        mutationDeleteClinic.mutate(rowSelectedClinic);
        setIsModalDelete(false);
    };

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
            sorter: (a, b) => a.code.localeCompare(b.code),
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
                        <Loading isLoading={isLoadingClinic}>
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
                                                <div className={cx('time-work')}>
                                                    <label htmlFor="time">THỜI GIAN LÀM VIỆC</label>
                                                    <EditOutlined
                                                        onClick={showModalClinicSchedule}
                                                        className={cx('edit-icon')}
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    {dataClinicSchedule?.map((time) => (
                                                        <Tag
                                                            key={time?._id}
                                                            color="blue"
                                                            style={{ marginRight: 5, marginTop: 5, fontSize: 14 }}
                                                        >
                                                            {time?.startTime} - {time?.endTime}
                                                        </Tag>
                                                    ))}
                                                </div>
                                            </div>
                                            <Modal
                                                title={
                                                    <div className={cx('title-modal-clinic-schedule')}>
                                                        Chỉnh sửa thời gian làm việc
                                                    </div>
                                                }
                                                open={isModalOpenClinicSchedule}
                                                onCancel={cancelModalClinicSchedule}
                                                footer={null}
                                                width="45%"
                                            >
                                                <div className={cx('content-modal-time')}>
                                                    <ClinicScheduleManager
                                                        dataClinicSchedule={dataClinicSchedule}
                                                        isLoadingClinicSchedule={isLoadingClinicSchedule}
                                                        rowSelectedClinic={rowSelectedClinic}
                                                        refetchClinicSchedule={refetchClinicSchedule}
                                                    />
                                                </div>
                                            </Modal>

                                            <div className={cx('form-label')}>
                                                <label htmlFor="service">DỊCH VỤ KHÁM</label>
                                                <Button className={cx('btn-service')} onClick={showModalMedicalService}>
                                                    <UnorderedListOutlined />
                                                    &nbsp; Danh sách dịch vụ khám
                                                </Button>
                                            </div>
                                            <Modal
                                                title={
                                                    <div className={cx('modal-medical-title')}>
                                                        Danh sách dịch vụ khám
                                                    </div>
                                                }
                                                open={isModalOpenMedicalService}
                                                onCancel={cancelModalMedicalService}
                                                footer={null}
                                                width="55%"
                                                style={{ top: 5 }}
                                            >
                                                <MedicalServiceManager
                                                    dataMedicalService={dataMedicalService}
                                                    isLoadingMedicalService={isLoadingMedicalService}
                                                    rowSelectedClinic={rowSelectedClinic}
                                                    refetchMedicalService={refetchMedicalService}
                                                />
                                            </Modal>
                                            <div className={cx('wrapper-btn')}>
                                                <Button
                                                    className={cx('btn-edit')}
                                                    type="primary"
                                                    onClick={showModalEdit}
                                                >
                                                    Chỉnh sửa
                                                </Button>
                                                <Button
                                                    className={cx('btn-delete')}
                                                    type="primary"
                                                    onClick={showModalDelete}
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('content-right')}>
                                    <div className={cx('wrapper-avatar')}>
                                        {dataClinic?.logo ? (
                                            <div style={{ width: '100%' }}>
                                                <img className={cx('avatar')} src={dataClinic?.logo} alt="avatar" />
                                                <div className={cx('wrapper-btn-logo')}>
                                                    <Button className={cx('btn-edit-logo')} onClick={showModalLogo}>
                                                        <CameraOutlined />
                                                        &nbsp; Chỉnh sửa ảnh
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={cx('upload-avatar')}>
                                                <div className={cx('upload')} onClick={showModalLogo}>
                                                    <CameraOutlined
                                                        style={{
                                                            fontSize: '30px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                        }}
                                                    />
                                                    <div className={cx('upload-text')}>Tải ảnh lên</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <Modal
                                        title="Chỉnh sửa logo"
                                        open={isModalOpenLogo}
                                        onOk={handleOkLogo}
                                        onCancel={handleCancelLogo}
                                    >
                                        <InputUpload type="file" avatar={logo} onChange={handleOnChangeLogo} />
                                    </Modal>
                                    <div className={cx('more-info')}>
                                        <label htmlFor="introduce">GIỚI THIỆU</label>
                                        <div className={cx('info')}>{dataClinic?.description}</div>
                                    </div>
                                </div>
                            </div>
                        </Loading>
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
                        <Modal
                            title={<div className={cx('modal-edit-title')}>Chỉnh sửa phòng khám</div>}
                            open={isModalOpenEdit}
                            onCancel={cancelModalEdit}
                            footer={null}
                            width="50%"
                            style={{ top: 5 }}
                        >
                            <div className={cx('modal-edit')}>
                                <div className={cx('modal-edit-item')}>
                                    <label htmlFor="name">Tên phòng khám</label>
                                    <Input
                                        className={cx('input')}
                                        id="name"
                                        name="name"
                                        value={name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={cx('modal-edit-grid')}>
                                    <div className={cx('modal-edit-item')}>
                                        <label htmlFor="email">Email</label>
                                        <Input
                                            className={cx('input')}
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={cx('modal-edit-item')}>
                                        <label htmlFor="hotline">Holine</label>
                                        <Input
                                            className={cx('input')}
                                            id="hotline"
                                            name="hotline"
                                            value={hotline}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className={cx('modal-edit-item')}>
                                    <label htmlFor="address">Địa chỉ</label>
                                    <Input
                                        className={cx('input')}
                                        id="address"
                                        name="address"
                                        value={address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={cx('modal-edit-item')}>
                                    <label htmlFor="description">Giới thiệu</label>
                                    <Input.TextArea
                                        className={cx('input')}
                                        id="description"
                                        name="description"
                                        value={description}
                                        onChange={handleChange}
                                        rows={6}
                                    />
                                </div>
                            </div>
                            <div className={cx('wrapper-btn')}>
                                <Button className={cx('btn-save')} type="primary" onClick={handleOkEdit}>
                                    Lưu
                                </Button>
                            </div>
                        </Modal>
                        <Modal
                            title="Bạn có chắc muốn xóa phòng khám này?"
                            open={isModalDelete}
                            onOk={handleOkModalDelete}
                            onCancel={cancelModalDelete}
                            okButtonProps={{ style: { backgroundColor: '#ff4d4f' } }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailClinic;
