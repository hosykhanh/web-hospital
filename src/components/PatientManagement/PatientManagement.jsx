import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './PatientManagement.module.scss';
import TableComp from '../TableComp/TableComp';
import { DeleteOutlined } from '@ant-design/icons';
import DetailPatient from '../DetailPatient/DetailPatient';
import { Popover } from 'antd';
import Search from 'antd/es/transfer/search';
import ModalConfirm from '../ModalConfirm/ModalConfirm';

const cx = classNames.bind(styles);

const PatientManagement = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('view')} onClick={() => setIsDetailVisible(true)}>
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
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 2,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 3,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 4,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 5,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 6,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 7,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 8,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
        ],
    };

    const columns = [
        {
            title: 'Mã bệnh nhân',
            dataIndex: 'patient_id',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'patient_name',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'patient_dob',
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    return (
        <div className={cx('wrapper')}>
            {isDetailVisible ? (
                <DetailPatient onBack={() => setIsDetailVisible(false)} />
            ) : (
                <>
                    <div className={cx('title')}>Quản lý bệnh nhân</div>
                    <div className={cx('list')}>Danh sách bệnh nhân đã đặt lịch</div>
                    <div className={cx('search')}>
                        <Search
                            className={cx('search-input')}
                            placeholder="Tìm kiếm..."
                            allowClear
                            enterButton="Tìm kiếm"
                            // size="large"
                            style={{ height: '50px', fontSize: '18px' }}
                            // onChange={onSearch}
                            // value={searchValue}
                        />
                    </div>
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
                    <ModalConfirm
                        isOpen={isDeleteModalOpen}
                        setIsOpen={setIsDeleteModalOpen}
                        rowSelected={rowSelected}
                        title="Bạn có chắc chắn xóa bệnh nhân này?"
                        // refetch={refetch}
                        // mutation={mutation}
                    />
                </>
            )}
        </div>
    );
};

export default PatientManagement;
