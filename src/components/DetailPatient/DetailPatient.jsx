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

const cx = classNames.bind(styles);

const DetailPatient = ({ onBack }) => {
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
            {isEditDetailVisible ? (
                <EditDetailPatient onBack={() => setIsEditDetailVisible(false)} />
            ) : (
                <>
                    <div className={cx('title')}>Thông tin bệnh nhân</div>
                    <div className={cx('wrapper')}>
                        <div>
                            <button onClick={onBack} className={cx('back')}>
                                <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                            </button>
                        </div>
                        <div className={cx('form')}>
                            <div className={cx('form-grid-1')}>
                                <div className={cx('form-label')}>
                                    <label htmlFor="PatientID">MÃ BỆNH NHÂN</label>
                                    <Input value="12345" className={cx('input')} required disabled={true} />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="User">HỌ VÀ TÊN</label>
                                    <Input value="Nguyễn Văn A" className={cx('input')} required disabled={true} />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="dateOfBirth">NGÀY SINH</label>
                                    <Input className={cx('input')} required disabled={true} value="01-01-2000" />
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
                                    <label htmlFor="blood">NHÓM MÁU:</label>
                                    <span>AB</span>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="phone">CHIỀU CAO:</label>
                                    <span>175 cm</span>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="phone">CÂN NẶNG:</label>
                                    <span>60 Kg</span>
                                </div>
                            </div>
                            <div className={cx('form-grid-3')}>
                                <div className={cx('form-label')}>
                                    <label htmlFor="email">EMAIL:</label>
                                    <span>nguyenvana@gmail.com</span>
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="phone">SỐ ĐIỆN THOẠI:</label>
                                    <span>123456789</span>
                                </div>
                            </div>
                            <div className={cx('form-label')}>
                                <label>TIỀN SỬ BỆNH LÝ:</label>
                                <span>Không</span>
                            </div>
                            <div className={cx('wrapper-btn')}>
                                <Button
                                    className={cx('btn')}
                                    type="primary"
                                    onClick={() => setIsEditDetailVisible(true)}
                                >
                                    <EditOutlined />&nbsp;Chỉnh sửa
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
                </>
            )}
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
                // mutation={mutation}
            />
        </div>
    );
};

export default DetailPatient;
