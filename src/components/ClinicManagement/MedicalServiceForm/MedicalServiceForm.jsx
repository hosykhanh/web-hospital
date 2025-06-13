import { Input, InputNumber, Button, Modal, message } from 'antd';
import { ArrowLeftOutlined, CameraOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './MedicalServiceForm.module.scss';
import TableComp from '../../TableComp/TableComp';
import * as doctorService from '../../../services/doctorService';
import * as medicalService from '../../../services/medicalService';
import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';
import InputUpload from '../../InputUpload/InputUpload';

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
    logo,
    setLogo,
    isLogo,
    serviceId,
    onDelete,
    dataDetailService,
    description,
    setDescription,
    symptom,
    setSymptom,
    relatedService,
    setRelatedService,
}) => {
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [rowSelectedDoctor, setRowSelectedDoctor] = useState(null);
    const [rowSelectedDoctorAdd, setRowSelectedDoctorAdd] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isModalOpenLogo, setIsModalOpenLogo] = useState(false);
    let isNotInAnotherMedicalService = 1;

    // --- API GET ALL DOCTORS BY CLINIC ---
    const getAllDoctorsByClinic = async () => {
        const res = await doctorService.getDoctorsByClinicId(rowSelectedClinic, { isNotInAnotherMedicalService });
        return res.data;
    };

    const {
        isLoading: isLoadingDoctorsAdd,
        data: dataDoctorsAdd,
        refetch: refetchDoctorsAdd,
    } = useQuery(['doctorsAdd', rowSelectedClinic], getAllDoctorsByClinic, {
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

    const mutationLogo = useMutation({
        mutationFn: (data) => {
            const { id, ...logo } = data;
            return medicalService.updateLogoMedicalService(id, logo);
        },
        onSuccess: (data) => {
            message.success('Logo cập nhật thành công!');
            setLogo(data.data.logo);
        },
        onError: (error) => {
            message.error('Có lỗi xảy ra khi cập nhật logo.');
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
        mutationLogo.mutate({ id: serviceId, logo });
    };

    const handleCancelLogo = () => {
        setIsModalOpenLogo(false);
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
                {isLogo === true ? (
                    <div className={cx('wrapper-avatar')}>
                        {logo ? (
                            <div className={cx('avatar-btn-logo')}>
                                <img className={cx('avatar')} src={logo} alt="avatar" />
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
                ) : (
                    <></>
                )}
                <Modal title="Chỉnh sửa logo" open={isModalOpenLogo} onOk={handleOkLogo} onCancel={handleCancelLogo}>
                    <InputUpload type="file" avatar={logo} onChange={handleOnChangeLogo} />
                </Modal>
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
                    <label htmlFor="description">Mô tả dịch vụ khám</label>
                    <Input
                        className={cx('input')}
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Nhập mô tả"
                    />
                </div>
                <div className={cx('modal-edit-item')}>
                    <label htmlFor="symptom">Triệu chứng</label>
                    <Input
                        className={cx('input')}
                        id="symptom"
                        value={symptom}
                        onChange={(e) => setSymptom(e.target.value)}
                        placeholder="Nhập triệu chứng"
                    />
                </div>
                <div className={cx('modal-edit-item')}>
                    <label htmlFor="relatedService">Dịch vụ liên quan</label>
                    <Input
                        className={cx('input')}
                        id="relatedService"
                        value={relatedService}
                        onChange={(e) => setRelatedService(e.target.value)}
                        placeholder="Nhập dịch vụ liên quan"
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
                {dataDetailService ? (
                    <>
                        <div className={cx('modal-edit-item')}>
                            <label>Mô tả</label>
                            <Input.TextArea className={cx('input')} value={dataDetailService.description} rows={4} />
                        </div>
                        <div className={cx('modal-edit-item')}>
                            <label>Dịch vụ liên quan</label>
                            <Input.TextArea className={cx('input')} value={dataDetailService.relatedService} rows={4} />
                        </div>
                        <div className={cx('modal-edit-item')}>
                            <label>Triệu chứng liên quan</label>
                            <Input.TextArea className={cx('input')} value={dataDetailService.symptom} rows={4} />
                        </div>
                    </>
                ) : (
                    <></>
                )}
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
