import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './PatientManagement.module.scss';
import TableComp from '../TableComp/TableComp';
// import { DeleteOutlined } from '@ant-design/icons';
import DetailPatient from '../DetailPatient/DetailPatient';
import Search from 'antd/es/transfer/search';
// import ModalConfirm from '../ModalConfirm/ModalConfirm';
// import { useMutation } from 'react-query';
// import * as userService from '../../services/userServices';
import convertISODateToLocalDate from '../../utils/convertISODateToLocalDate';

const cx = classNames.bind(styles);

const PatientManagement = ({ isLoading, data, refetch }) => {
    const [rowSelected, setRowSelected] = useState('');
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const filteredData = data?.filter((item) => item.userName.toLowerCase().includes(searchValue.toLowerCase()));

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('view')} onClick={() => setIsDetailVisible(true)}>
                    Chi tiết
                </button>
                {/* <DeleteOutlined
                    style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
                    onClick={() => setIsDeleteModalOpen(true)}
                /> */}
            </div>
        );
    };

    const columns = [
        {
            title: 'Mã bệnh nhân',
            dataIndex: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'userName',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            render: (text, record) => convertISODateToLocalDate(record.dateOfBirth),
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    // const mutation = useMutation({
    //     mutationFn: (data) => userService.deleteUser(data),
    // });

    return (
        <div className={cx('wrapper')}>
            {isDetailVisible ? (
                <DetailPatient onBack={() => setIsDetailVisible(false)} rowSelectedDetail={rowSelected} />
            ) : (
                <>
                    <div className={cx('title')}>Quản lý bệnh nhân</div>
                    <div className={cx('list')}>Danh sách bệnh nhân đã đặt lịch</div>
                    <div className={cx('search')}>
                        <Search
                            className={cx('search-input')}
                            placeholder="Tìm kiếm bệnh nhân..."
                            allowClear
                            enterButton="Tìm kiếm"
                            style={{ height: '50px', fontSize: '18px' }}
                            onChange={handleSearch}
                            value={searchValue}
                        />
                    </div>
                    <div className={cx('table')}>
                        <TableComp
                            columns={columns}
                            data={filteredData}
                            isLoading={isLoading}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setRowSelected(record._id);
                                    },
                                };
                            }}
                            // mutation={mutationDelMany}
                            refetch={refetch}
                            defaultPageSize={8}
                        />
                    </div>
                    {/* <ModalConfirm
                        isOpen={isDeleteModalOpen}
                        setIsOpen={setIsDeleteModalOpen}
                        rowSelected={rowSelected}
                        title="Bạn có chắc chắn xóa bệnh nhân này?"
                        refetch={refetch}
                        mutation={mutation || {}}
                    /> */}
                </>
            )}
        </div>
    );
};

export default PatientManagement;
