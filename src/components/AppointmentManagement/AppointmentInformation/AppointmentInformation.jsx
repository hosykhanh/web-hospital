import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './AppointmentInformation.module.scss';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Modal, Radio } from 'antd';

import Button from '../../Button/Button';
import UpdateExaminationDrawer from '../../UpdateExaminationDrawer/UpdateExaminationDrawer';
import ModalConfirm from '../../ModalConfirm/ModalConfirm';
import TableComp from '../../TableComp/TableComp';

const cx = classNames.bind(styles);

const AppointmentInformation = ({ onBack }) => {
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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
            <div className={cx('title')}>Thông tin lịch khám</div>
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
                        <></>
                    </div>
                    <div className={cx('form-grid-2')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="day">NGÀY KHÁM:</label>
                            <span>09/03/2025</span>
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="hour">GIỜ KHÁM:</label>
                            <span>10 giờ</span>
                        </div>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="service">DỊCH VỤ KHÁM:</label>
                        <span>Khám tổng quát</span>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="status">TRẠNG THÁI:</label>
                        <Radio.Group name="gender">
                            <Radio value="Male">Chờ khám</Radio>
                            <Radio value="Female">Đã hủy</Radio>
                            <Radio value="Other">Hoàn thành</Radio>
                        </Radio.Group>
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
                        <label>LÝ DO KHÁM:</label>
                        <span>Không</span>
                    </div>
                    <div className={cx('wrapper-btn')}>
                        <div>
                            <Button className={cx('btn-save')} type="primary">
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
                    <Modal
                        forceRender
                        open={isCancelModalOpen}
                        onCancel={() => setIsCancelModalOpen(false)}
                        footer={null}
                    >
                        <div className={cx('wrapper-model')}>
                            <h2 className={cx('title-model')}>Bạn chắc chắn muốn hủy lịch hẹn?</h2>
                            <div>
                                <Button outline large onClick={() => setIsCancelModalOpen(false)}>
                                    Thoát
                                </Button>
                                <Button danger large onClick={() => setIsCancelModalOpen(false)}>
                                    Xác nhận hủy
                                </Button>
                            </div>
                        </div>
                    </Modal>
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

export default AppointmentInformation;
