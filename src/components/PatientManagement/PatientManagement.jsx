import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './PatientManagement.module.scss';
import TableComp from '../TableComp/TableComp';
import { DeleteOutlined } from '@ant-design/icons';
import DetailPatient from '../DetailPatient/DetailPatient';
import { Popover } from 'antd';
import Search from 'antd/es/transfer/search';

const cx = classNames.bind(styles);

const PatientManagement = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isDetailVisible, setIsDetailVisible] = useState(false);

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <div style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsDetailVisible(true)}>
                    Xem chi tiết
                </div>
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
                    // onClick={() => setIsDeleteModalOpen(true)}
                />
            </div>
        );
    };

    const columns = [
        {
            title: 'Mã bệnh nhân',
            dataIndex: 'patientCode',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'name',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
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
                    <div className={cx('search')}>
                        {/* <Popover trigger="click" placement="bottomLeft"> */}
                            <div onClick={(e) => e.stopPropagation()}>
                                <Search
                                    className={cx('search-input')}
                                    placeholder="Tìm kiếm..."
                                    allowClear
                                    enterButton="Tìm kiếm"
                                    size="large"
                                    // style={{ height: '50px', fontSize: '18px' }}
                                    // onChange={onSearch}
                                    // value={searchValue}
                                />
                            </div>
                        {/* </Popover> */}
                    </div>
                    <div className={cx('table')}>
                        <TableComp
                            columns={columns}
                            // data={dataUser}
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
                        />
                    </div>
                    <div style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsDetailVisible(true)}>
                        Xem chi tiết
                    </div>
                </>
            )}
        </div>
    );
};

export default PatientManagement;
