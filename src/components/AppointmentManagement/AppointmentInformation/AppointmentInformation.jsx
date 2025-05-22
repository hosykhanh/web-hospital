import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './AppointmentInformation.module.scss';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { DatePicker, Input, message, Modal, Radio } from 'antd';

import Button from '../../Button/Button';
import * as patientService from '../../../services/patientService';
import * as userService from '../../../services/userServices';
import * as doctorService from '../../../services/doctorService';
import { useQuery } from 'react-query';
import convertISODateToLocalDate from '../../../utils/convertISODateToLocalDate';
import { useSelector } from 'react-redux';
import { useColumnSearch } from '../../../hooks/useColumnSearch';
import TableComp from '../../TableComp/TableComp';

const cx = classNames.bind(styles);

const AppointmentInformation = ({ onBack, rowSelectedInfo, refetch }) => {
    const user = useSelector((state) => state.user);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [doctor, setDoctor] = useState([]);
    const [rowSelectedDoctor, setRowSelectedDoctor] = useState('');

    const [patientStatus, setPatientStatus] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [reExaminateDate, setReExaminateDate] = useState(null);
    const [noteFromDoctor, setNoteFromDoctor] = useState('');

    const [clinicId, setClinicId] = useState('');
    const [medicalServiceId, setMedicalServiceId] = useState('');

    const getColumnSearchProps = useColumnSearch();

    const {
        data: dataInfo,
        // isLoading: isLoadingInfo,
        refetch: refetchInfo,
    } = useQuery(
        ['medicalHistoryInfo', rowSelectedInfo], // Key để caching dữ liệu
        () => patientService.getMedicalConsultationHistory(rowSelectedInfo),
        {
            enabled: !!rowSelectedInfo,
            select: (data) => data?.data,
        },
    );

    const {
        data: dataHealthRecord,
        // isLoading: isLoadingHealthRecord,
        refetch: refetchHealthRecord,
    } = useQuery(['healthRecord', dataInfo?.patientId], () => patientService.getHealthRecord(dataInfo?.patientId), {
        enabled: !!dataInfo?.patientId,
        select: (data) => data?.data || null,
    });

    // --- API GET ALL DOCTORS ---
    const {
        isLoading: isLoadingDoctors,
        data: dataDoctors,
        refetch: refetchDoctors,
    } = useQuery(
        ['doctor', clinicId, medicalServiceId],
        () =>
            doctorService.getDoctorsByClinicId(clinicId, {
                medicalServiceId,
            }),
        {
            enabled: !!clinicId && !!medicalServiceId,
            select: (data) => data?.data,
        },
    );

    useEffect(() => {
        if (dataInfo) {
            setMedicalServiceId(dataInfo?.medicalServiceId);
            setClinicId(dataInfo?.clinicId);
        }
    }, [dataInfo]);

    useEffect(() => {
        if (dataInfo?.responsibilityDoctorId) {
            const getDoctor = async () => {
                const res = await userService.getUser(dataInfo?.responsibilityDoctorId);
                setDoctor(res.data);
            };
            getDoctor();
        }
    }, [dataInfo]);

    useEffect(() => {
        if (rowSelectedDoctor) {
            const updateResponsibilityDoctor = async () => {
                try {
                    const res = await patientService.updateMedicalConsultationHistory(rowSelectedInfo, {
                        ...dataInfo,
                        responsibilityDoctorId: rowSelectedDoctor,
                    });
                    if (res.statusCode === 200) {
                        message.success('Thay đổi bác sĩ phụ trách thành công');
                        setIsDoctorModalOpen(false);
                        refetchInfo();
                    } else {
                        message.error('Thay đổi bác sĩ phụ trách thất bại', res.message);
                    }
                } catch (error) {
                    message.error('Có lỗi xảy ra khi thay đổi bác sĩ phụ trách');
                }
            };
            updateResponsibilityDoctor();
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelectedDoctor]);

    const onSubmitComplete = async () => {
        const data = {
            ...dataInfo,
            patientStatus: patientStatus,
            diagnosis: diagnosis,
            reExaminateDate: reExaminateDate,
            noteFromDoctor: noteFromDoctor,
        };
        const requiredFields = {
            responsibilityDoctorId: 'Bác sĩ phụ trách',
            patientStatus: 'Tình trạng bệnh nhân',
            diagnosis: 'Chẩn đoán',
        };

        const missingFields = Object.entries(requiredFields).filter(
            ([key]) => !data[key] || (typeof data[key] === 'string' && data[key].trim() === ''),
        );

        if (missingFields.length > 0) {
            const missingLabels = missingFields.map(([_, label]) => label);
            message.error(`Vui lòng điền: ${missingLabels.join(', ')}`);
            return;
        }
        try {
            const res = await patientService.completeMedicalConsultationHistory(rowSelectedInfo, data);
            if (res.statusCode === 200) {
                message.success('Hoàn thành lịch khám thành công');
                setIsCompleteModalOpen(false);
                refetchInfo();
                refetchHealthRecord();
            } else {
                message.error('Hoàn thành lịch khám thất bại', res.message);
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi hoàn thành lịch khám');
        }
    };

    const onSubimtCancel = async () => {
        const res = await patientService.cancelMedicalConsultationHistory(rowSelectedInfo);
        if (res.statusCode === 200) {
            message.success('Hủy lịch khám thành công');
            setIsCancelModalOpen(false);
            refetchInfo();
            refetchHealthRecord();
        } else {
            message.error('Hủy lịch khám thất bại', res.message);
        }
    };

    const onClickBack = () => {
        onBack();
        refetch();
    };

    const renderActionDoctor = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('add')} onClick={() => setIsDoctorModalOpen(false)}>
                    Thay đổi
                </button>
            </div>
        );
    };

    const columnsDoctors = [
        {
            title: 'Mã bác sĩ',
            dataIndex: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
            ...getColumnSearchProps('code'),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'userName',
            ...getColumnSearchProps('userName'),
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            render: (text, record) => convertISODateToLocalDate(record.dateOfBirth),
            ...getColumnSearchProps('dateOfBirth'),
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderActionDoctor,
        },
    ];

    return (
        <div>
            <div className={cx('title')}>Thông tin lịch khám</div>
            <div className={cx('wrapper')}>
                <div>
                    <button onClick={onClickBack} className={cx('back')}>
                        <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                    </button>
                </div>
                <div className={cx('form')}>
                    <div className={cx('title-form')}>Thông tin bệnh nhân</div>
                    <div className={cx('form-grid-1')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="PatientID">MÃ BỆNH NHÂN</label>
                            <Input value={dataInfo?.code} className={cx('input')} required disabled={true} />
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="User">HỌ VÀ TÊN BỆNH NHÂN</label>
                            <Input value={dataInfo?.patientName} className={cx('input')} required disabled={true} />
                        </div>
                        <></>
                    </div>
                    <div className={cx('form-grid-3')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="email">EMAIL:</label>
                            <span>{dataInfo?.patientEmail}</span>
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="phone">SỐ ĐIỆN THOẠI:</label>
                            <span>{dataInfo?.patientPhoneNumber}</span>
                        </div>
                    </div>
                    <div className={cx('title-form')}>Thông tin khám</div>
                    <div className={cx('form-grid-2')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="day">NGÀY KHÁM:</label>
                            <span>{convertISODateToLocalDate(dataInfo?.examinationDate)}</span>
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="hour">GIỜ KHÁM:</label>
                            <span>
                                {dataInfo?.clinicSchedule?.startTime} - {dataInfo?.clinicSchedule?.endTime}
                            </span>
                        </div>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="service">DỊCH VỤ KHÁM:</label>
                        <span>{dataInfo?.medicalServiceName}</span>
                    </div>
                    <div className={cx('form-grid-1')}>
                        <div className={cx('form-label')}>
                            <label style={{ marginRight: '5px' }}>BÁC SĨ PHỤ TRÁCH</label>
                            {user?.role === 2 || user?.role === 1 ? (
                                <></>
                            ) : (
                                <>
                                    <EditOutlined
                                        onClick={() => setIsDoctorModalOpen(true)}
                                        className={cx('edit-icon')}
                                    />
                                    <Modal
                                        title={<div className={cx('title-patient')}>Thay đổi bác sĩ phụ trách </div>}
                                        forceRender
                                        open={isDoctorModalOpen}
                                        onCancel={() => setIsDoctorModalOpen(false)}
                                        footer={null}
                                        width="50%"
                                    >
                                        <TableComp
                                            columns={columnsDoctors}
                                            data={dataDoctors}
                                            isLoading={isLoadingDoctors}
                                            onRow={(record, rowIndex) => {
                                                return {
                                                    onClick: (event) => {
                                                        setRowSelectedDoctor(record._id);
                                                    },
                                                };
                                            }}
                                            // mutation={mutationDelMany}
                                            refetch={refetchDoctors}
                                            defaultPageSize={8}
                                        />
                                    </Modal>
                                </>
                            )}
                            <Input
                                value={doctor?.userName}
                                className={cx('input')}
                                required
                                disabled={true}
                                width="25%"
                            />
                        </div>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="status">TRẠNG THÁI:</label>
                        <Radio.Group name="gender" value={dataInfo?.status} disabled={true}>
                            <Radio value={1} style={{ color: 'orange', fontSize: '1rem', fontWeight: '500' }}>
                                Chờ khám
                            </Radio>
                            <Radio value={2} style={{ color: 'red', fontSize: '1rem', fontWeight: '500' }}>
                                Đã hủy
                            </Radio>
                            <Radio value={3} style={{ color: 'green', fontSize: '1rem', fontWeight: '500' }}>
                                Hoàn thành
                            </Radio>
                        </Radio.Group>
                    </div>
                    <div className={cx('form-label')}>
                        <label>LÝ DO KHÁM:</label>
                        <span>{dataInfo?.examinationReason}</span>
                    </div>
                    {dataInfo?.status === 2 || dataInfo?.status === 3 ? (
                        <>
                            <div className={cx('form-label')}>
                                <label>NGÀY KHÁM:</label>
                                <span>{convertISODateToLocalDate(dataInfo?.examinationDate)}</span>
                            </div>
                            <div className={cx('form-label')}>
                                <label>TÌNH TRẠNG:</label>
                                <span>{dataInfo?.patientStatus}</span>
                            </div>
                            <div className={cx('form-label')}>
                                <label>CHẨN ĐOÁN:</label>
                                <span>{dataInfo?.diagnosis}</span>
                            </div>
                            <div className={cx('form-label')}>
                                <label>GHI CHÚ:</label>
                                <span>{dataInfo?.noteFromDoctor}</span>
                            </div>
                            <div className={cx('form-label')}>
                                <label>NGÀY TÁI KHÁM:</label>
                                <span>{convertISODateToLocalDate(dataInfo?.reExaminateDate)}</span>
                            </div>
                        </>
                    ) : (
                        <div className={cx('wrapper-btn')}>
                            <div>
                                <Button
                                    className={cx('btn-save')}
                                    type="primary"
                                    onClick={() => setIsCompleteModalOpen(true)}
                                >
                                    Hoàn thành
                                </Button>
                                <Button
                                    className={cx('btn-cancel')}
                                    type="primary"
                                    onClick={() => setIsCancelModalOpen(true)}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    )}
                    <Modal
                        title={<div className={cx('title-model-complete')}>Cập nhật thông tin khám</div>}
                        width="45%"
                        style={{ top: '10px' }}
                        forceRender
                        open={isCompleteModalOpen}
                        onCancel={() => setIsCompleteModalOpen(false)}
                        footer={null}
                        className={cx('modal-complete')}
                    >
                        <div className={cx('wrapper-model-complete')}>
                            <div className={cx('form')}>
                                <div className={cx('form-label')}>
                                    <label htmlFor="Doctor">BÁC SĨ PHỤ TRÁCH</label>
                                    <Input value={doctor?.userName} className={cx('input')} required disabled={true} />
                                </div>
                                <div className={cx('form-grid-4')}>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="Service">DỊCH VỤ KHÁM</label>
                                        <Input
                                            value={dataInfo?.medicalServiceName}
                                            className={cx('input')}
                                            required
                                            disabled={true}
                                        />
                                    </div>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="User">NGÀY KHÁM</label>
                                        <Input
                                            value={convertISODateToLocalDate(dataInfo?.examinationDate)}
                                            className={cx('input')}
                                            required
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className={cx('form-label')}>
                                    <label>TÌNH TRẠNG</label>
                                    <Input.TextArea
                                        name="patientStatus"
                                        placeholder="Nhập tình trạng"
                                        value={patientStatus}
                                        className={cx('formInput')}
                                        rows={3}
                                        onChange={(e) => setPatientStatus(e.target.value)}
                                    />
                                </div>
                                <div className={cx('form-label')}>
                                    <label>CHẨN ĐOÁN</label>
                                    <Input.TextArea
                                        name="diagnosis"
                                        placeholder="Nhập chẩn đoán"
                                        value={diagnosis}
                                        className={cx('formInput')}
                                        rows={3}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                    />
                                </div>
                                <div className={cx('form-label')}>
                                    <label>NGÀY TÁI KHÁM</label>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={reExaminateDate}
                                        onChange={(date) => setReExaminateDate(date)}
                                    />
                                </div>
                                <div className={cx('form-label')}>
                                    <label>GHI CHÚ</label>
                                    <Input.TextArea
                                        name="noteFromDoctor"
                                        placeholder="Nhập ghi chú"
                                        value={noteFromDoctor}
                                        className={cx('formInput')}
                                        rows={4}
                                        onChange={(e) => setNoteFromDoctor(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Button outline onClick={() => setIsCompleteModalOpen(false)}>
                                    Quay lại
                                </Button>
                                <Button primary onClick={onSubmitComplete}>
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        forceRender
                        open={isCancelModalOpen}
                        onCancel={() => setIsCancelModalOpen(false)}
                        footer={null}
                    >
                        <div className={cx('wrapper-model')}>
                            <h2 className={cx('title-model')}>Bạn chắc chắn muốn hủy lịch khám?</h2>
                            <div>
                                <Button outline large onClick={() => setIsCancelModalOpen(false)}>
                                    Thoát
                                </Button>
                                <Button danger large onClick={onSubimtCancel}>
                                    Xác nhận hủy
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </div>
                <div className={cx('form')}>
                    <div className={cx('title-form-2')}>Hồ sơ sức khỏe bệnh nhân</div>
                    <div className={cx('form-grid-2')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="blood">NHÓM MÁU:</label>
                            <span>{dataHealthRecord?.bloodType}</span>
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="phone">CHIỀU CAO:</label>
                            <span>{dataHealthRecord?.height} cm</span>
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="phone">CÂN NẶNG:</label>
                            <span>{dataHealthRecord?.weight} Kg</span>
                        </div>
                    </div>
                    <div className={cx('form-label')}>
                        <label>TIỀN SỬ BỆNH LÝ:</label>
                        <span>{dataHealthRecord?.healthHistory}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentInformation;
