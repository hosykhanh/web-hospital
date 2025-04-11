import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './DetailPatient.module.scss';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Input, Radio } from 'antd';
import TableComp from '../TableComp/TableComp';
import Button from '../Button/Button';
import EditDetailPatient from './EditDetailPatient/EditDetailPatient';
import UpdateExaminationDrawer from '../UpdateExaminationDrawer/UpdateExaminationDrawer';
import ModalConfirm from '../ModalConfirm/ModalConfirm';
import * as userService from '../../services/userServices';
import * as patientService from '../../services/patientService';
import Loading from '../Loading/Loading';
import convertISODateToLocalDate from '../../utils/convertISODateToLocalDate';
import { useMutation, useQuery } from 'react-query';

const cx = classNames.bind(styles);

const DetailPatient = ({ onBack, rowSelectedDetail }) => {
    const [rowSelected, setRowSelected] = useState('');
    const [isEditDetailVisible, setIsEditDetailVisible] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const {
        isLoading: isLoadingUser,
        data: dataUser,
        refetch: refetchUser,
    } = useQuery(['user', rowSelectedDetail], () => userService.getUser(rowSelectedDetail), {
        enabled: !!rowSelectedDetail, // Chỉ chạy khi rowSelectedDetail có giá trị
        select: (data) => data?.data,
    });

    const {
        isLoading: isLoadingHealthRecord,
        data: dataHealthRecord,
        refetch: refetchHealthRecord,
    } = useQuery(['healthRecord', rowSelectedDetail], () => patientService.getHealthRecord(rowSelectedDetail), {
        enabled: !!rowSelectedDetail,
        select: (data) => data?.data || null,
    });

    const {
        data: dataHistory,
        isLoading: isLoadingHistory,
        refetch: refetchHistory,
    } = useQuery(
        ['medicalHistory', rowSelectedDetail], // Key để caching dữ liệu
        () => patientService.getAllMedicalConsultationHistory({ patientId: rowSelectedDetail, status: 3 }),
        {
            enabled: !!rowSelectedDetail,
            select: (data) => data?.data?.items || [],
        },
    );

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

    const mutationMedicalConsultationHistory = useMutation({
        mutationFn: (data) => patientService.deleteMedicalConsultationHistory(data),
    });

    return (
        <div>
            {isEditDetailVisible ? (
                <EditDetailPatient
                    onBack={() => setIsEditDetailVisible(false)}
                    dataUser={dataUser}
                    dataTable={dataHistory}
                    dataHealthRecord={dataHealthRecord}
                    refetchUser={refetchUser}
                    refetchHealthRecord={refetchHealthRecord}
                />
            ) : (
                <>
                    <div className={cx('title')}>Thông tin bệnh nhân</div>
                    <div className={cx('wrapper')}>
                        <div>
                            <button onClick={onBack} className={cx('back')}>
                                <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                            </button>
                        </div>
                        <Loading isLoading={isLoadingUser || isLoadingHealthRecord}>
                            <div className={cx('form')}>
                                <div className={cx('title-form')}>Thông tin cá nhân</div>
                                <div className={cx('form-grid-1')}>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="PatientID">MÃ BỆNH NHÂN</label>
                                        <Input
                                            value={dataUser?.code}
                                            className={cx('input')}
                                            required
                                            disabled={true}
                                        />
                                    </div>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="User">HỌ VÀ TÊN</label>
                                        <Input
                                            value={dataUser?.userName}
                                            className={cx('input')}
                                            required
                                            disabled={true}
                                        />
                                    </div>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="dateOfBirth">NGÀY SINH</label>
                                        <Input
                                            className={cx('input')}
                                            required
                                            disabled={true}
                                            value={convertISODateToLocalDate(dataUser?.dateOfBirth)}
                                        />
                                    </div>
                                    <></>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="gender">GIỚI TÍNH:</label>
                                    <Radio.Group name="gender" disabled={true} value={dataUser?.gender}>
                                        <Radio value={1}>Nam</Radio>
                                        <Radio value={2}>Nữ</Radio>
                                        <Radio value={3}>Khác</Radio>
                                    </Radio.Group>
                                </div>
                                <div className={cx('form-grid-2')}>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="email">EMAIL:</label>
                                        <span>{dataUser?.email}</span>
                                    </div>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="phone">SỐ ĐIỆN THOẠI:</label>
                                        <span>{dataUser?.phone}</span>
                                    </div>
                                </div>
                                <div className={cx('form-grid-3')}>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="conscious">TỈNH/ THÀNH PHỐ:</label>
                                        <span>{dataUser?.province}</span>
                                    </div>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="district">QUẬN/ HUYỆN:</label>
                                        <span>{dataUser?.district}</span>
                                    </div>
                                    <div className={cx('form-label')}>
                                        <label htmlFor="commune">PHƯỜNG/ XÃ:</label>
                                        <span>{dataUser?.commune}</span>
                                    </div>
                                </div>
                                <div className={cx('form-label')} style={{ marginBottom: '30px' }}>
                                    <label htmlFor="address">ĐỊA CHỈ:</label>
                                    <span>{dataUser?.address}</span>
                                </div>
                                <div className={cx('title-form')}>Hồ sơ sức khỏe</div>
                                <div className={cx('form-grid-4')}>
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
                                <div className={cx('wrapper-btn')}>
                                    <Button
                                        className={cx('btn')}
                                        type="primary"
                                        onClick={() => setIsEditDetailVisible(true)}
                                    >
                                        <EditOutlined />
                                        &nbsp;Chỉnh sửa
                                    </Button>
                                </div>
                            </div>
                        </Loading>
                        <div className={cx('title')}>Lịch sử khám bệnh</div>
                        <div className={cx('table')}>
                            <TableComp
                                columns={columns}
                                data={dataHistory}
                                isLoading={isLoadingHistory}
                                onRow={(record, rowIndex) => {
                                    return {
                                        onClick: (event) => {
                                            setRowSelected(record._id);
                                        },
                                    };
                                }}
                                // mutation={mutationDelMany}
                                refetch={refetchHistory}
                                defaultPageSize={8}
                            />
                        </div>
                    </div>
                    <UpdateExaminationDrawer
                        visible={isOpenDrawer}
                        setIsOpenDrawer={setIsOpenDrawer}
                        rowSelected={rowSelected}
                        refetch={refetchHistory}
                    />
                    <ModalConfirm
                        isOpen={isDeleteModalOpen}
                        setIsOpen={setIsDeleteModalOpen}
                        rowSelected={rowSelected}
                        title="Bạn có chắc chắn xóa lịch sử khám bệnh này này?"
                        refetch={refetchHistory}
                        mutation={mutationMedicalConsultationHistory}
                    />
                </>
            )}
        </div>
    );
};

export default DetailPatient;
