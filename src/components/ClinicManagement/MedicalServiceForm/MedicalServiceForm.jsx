import { Input, InputNumber, Button, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './MedicalServiceForm.module.scss';
import TableComp from '../../TableComp/TableComp';
import * as doctorService from '../../../services/doctorService';
import { useQuery } from 'react-query';
import { useState } from 'react';

const cx = classNames.bind(styles);

const MedicalServiceForm = ({
    title,
    onBack,
    serviceName,
    setServiceName,
    originalPrice,
    setOriginalPrice,
    currentPrice,
    setCurrentPrice,
    onSubmit,
    rowSelectedClinic,
    doctorIds,
    setDoctorIds,
    dataDoctors,
    setDataDoctors,
    onDelete,
}) => {
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [rowSelectedDoctor, setRowSelectedDoctor] = useState(null);
    const [rowSelectedDoctorAdd, setRowSelectedDoctorAdd] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // --- API GET ALL DOCTORS BY CLINIC ---
    const getAllDoctorsByClinic = async () => {
        const res = await doctorService.getDoctorsByClinicId(rowSelectedClinic);
        return res.data;
    };

    const {
        isLoading: isLoadingDoctorsAdd,
        data: dataDoctorsAdd,
        refetch: refetchDoctorsAdd,
    } = useQuery(['doctors', rowSelectedClinic], getAllDoctorsByClinic, {
        enabled: !!rowSelectedClinic,
    });

    const handleAddDoctor = () => {
        if (rowSelectedDoctorAdd) {
            setDataDoctors((prevData) => {
                if (prevData.some((doctor) => doctor._id === rowSelectedDoctorAdd)) {
                    return prevData;
                }
                const newDoctor = dataDoctorsAdd.find((doctor) => doctor._id === rowSelectedDoctorAdd);
                return [...prevData, newDoctor];
            });
            setDoctorIds((prevIds) => {
                if (!prevIds.includes(rowSelectedDoctorAdd)) {
                    return [...prevIds, rowSelectedDoctorAdd];
                }
                return prevIds;
            });
            setIsDoctorModalOpen(false);
            setRowSelectedDoctorAdd(null);
        }
    };

    const handleDeleteDoctor = () => {
        if (rowSelectedDoctor) {
            setDoctorIds(doctorIds.filter((id) => id !== rowSelectedDoctor));
            setDataDoctors(dataDoctors.filter((doctor) => doctor._id !== rowSelectedDoctor));
            setRowSelectedDoctor(null);
        }
    };

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('delete')} onClick={handleDeleteDoctor}>
                    Xóa bác sĩ
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

    const renderActionDoctor = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('add')} onClick={handleAddDoctor}>
                    Thêm
                </button>
            </div>
        );
    };

    const columnsDoctors = [
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
            render: renderActionDoctor,
        },
    ];

    return (
        <>
            <div>
                <button onClick={onBack} className={cx('back-medical-service')} style={{ backgroundColor: '#ffffff' }}>
                    <ArrowLeftOutlined style={{ fontSize: '20px' }} />
                </button>
            </div>
            <div className={cx('edit-medical-service-text')}>{title}</div>
            <div className={cx('modal-edit')}>
                <div className={cx('modal-edit-item')}>
                    <label htmlFor="name">Tên dịch vụ khám</label>
                    <Input
                        className={cx('input')}
                        id="name"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="Nhập tên dịch vụ"
                    />
                </div>
                <div className={cx('modal-edit-item')}>
                    <label>Giá gốc</label>
                    <InputNumber
                        addonAfter="VND"
                        parser={(value) => value.replace(/[^\d]/g, '')}
                        value={originalPrice}
                        onChange={(val) => setOriginalPrice(val)}
                        style={{ width: '50%' }}
                    />
                </div>
                <div className={cx('modal-edit-item')}>
                    <label>Giá hiện tại</label>
                    <InputNumber
                        addonAfter="VND"
                        parser={(value) => value.replace(/[^\d]/g, '')}
                        value={currentPrice}
                        onChange={(val) => setCurrentPrice(val)}
                        style={{ width: '50%' }}
                    />
                </div>
                <div className={cx('list-doctor')}>
                    <div className={cx('wrapper-title-btn')}>
                        <div className={cx('title-list')}>Danh sách bác sĩ</div>
                        <Button className={cx('btn-add')} onClick={() => setIsDoctorModalOpen(true)}>
                            Thêm bác sĩ
                        </Button>
                    </div>
                    <div className={cx('table')}>
                        <TableComp
                            columns={columns}
                            data={dataDoctors}
                            // isLoading={isLoadingDoctors}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setRowSelectedDoctor(record._id);
                                    },
                                };
                            }}
                            // mutation={mutationDelMany}
                            // refetch={refetchDoctors}
                            defaultPageSize={7}
                        />
                    </div>
                </div>
            </div>
            <Modal
                title={<div className={cx('title-patient')}>Chọn bác sĩ </div>}
                forceRender
                open={isDoctorModalOpen}
                onCancel={() => setIsDoctorModalOpen(false)}
                footer={null}
                width="50%"
            >
                <TableComp
                    columns={columnsDoctors}
                    data={dataDoctorsAdd}
                    isLoading={isLoadingDoctorsAdd}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelectedDoctorAdd(record._id);
                            },
                        };
                    }}
                    // mutation={mutationDelMany}
                    refetch={refetchDoctorsAdd}
                    defaultPageSize={8}
                />
            </Modal>
            <div className={cx('wrapper-btn')}>
                <Button className={cx('btn-save')} type="primary" onClick={onSubmit}>
                    Lưu
                </Button>
            </div>
            {onDelete ? (
                <div className={cx('wrapper-btn')}>
                    <Button
                        className={cx('btn-delete')}
                        type="primary"
                        onClick={() => setIsDeleteModalOpen(true)}
                        danger
                    >
                        Xóa dịch vụ khám
                    </Button>
                    <Modal
                        title={<div className={cx('title-delete')}>Bạn chắc chắn muốn xóa dịch vụ khám này? </div>}
                        forceRender
                        open={isDeleteModalOpen}
                        onCancel={() => setIsDeleteModalOpen(false)}
                        onOk={onDelete}
                    />
                </div>
            ) : null}
        </>
    );
};

export default MedicalServiceForm;
