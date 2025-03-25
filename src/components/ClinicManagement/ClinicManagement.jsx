import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './ClinicManagement.module.scss';
import TableComp from '../TableComp/TableComp';
import { FormOutlined } from '@ant-design/icons';
import Button from '../Button/Button';
import { TextField, InputAdornment, IconButton, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CreateClinic from './CreateClinic/CreateClinic';
import DetailClinic from './DetailClinic/DetailClinic';

const cx = classNames.bind(styles);

const ClinicManagement = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isCreateClinic, setIsCreateClinic] = useState(false);

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('view')} onClick={() => setIsDetailVisible(true)}>
                    Chi tiết
                </button>
            </div>
        );
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [filter, setFilter] = useState('');

    const handleOpenFilter = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseFilter = (option) => {
        if (option) setFilter(option);
        setAnchorEl(null);
    };

    const dataUser = {
        length: 8,
        data: [
            {
                _id: 1,
                clinic_name: 'Hà Nội',
                address: 'Hà Đông, Hà Nội',
                status: 'Đang hoạt động',
            },
            {
                _id: 2,
                clinic_name: 'Hà Nội',
                address: 'Hà Đông, Hà Nội',
                status: 'Đang hoạt động',
            },
            {
                _id: 3,
                clinic_name: 'Hà Nội',
                address: 'Hà Đông, Hà Nội',
                status: 'Đang hoạt động',
            },
            {
                _id: 4,
                clinic_name: 'Hà Nội',
                address: 'Hà Đông, Hà Nội',
                status: 'Đang hoạt động',
            },
            {
                _id: 5,
                clinic_name: 'Hà Nội',
                address: 'Hà Đông, Hà Nội',
                status: 'Đang hoạt động',
            },
            {
                _id: 6,
                clinic_name: 'Hà Nội',
                address: 'Hà Đông, Hà Nội',
                status: 'Đang hoạt động',
            },
            {
                _id: 7,
                clinic_name: 'Hà Nội',
                address: 'Hà Đông, Hà Nội',
                status: 'Đang hoạt động',
            },
            {
                _id: 8,
                clinic_name: 'Hà Nội',
                address: 'Hà Đông, Hà Nội',
                status: 'Đang hoạt động',
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
            title: 'Tên phòng khám',
            dataIndex: 'clinic_name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
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
                <DetailClinic onBack={() => setIsDetailVisible(false)} />
            ) : isCreateClinic ? (
                <CreateClinic onBack={() => setIsCreateClinic(false)} />
            ) : (
                <>
                    <div className={cx('title')}>Quản lý phòng khám</div>
                    <div className={cx('search')}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Tìm kiếm..."
                                InputProps={{
                                    style: { height: '40px', fontSize: '16px', backgroundColor: 'white' },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleOpenFilter}
                                                style={{ height: '40px', fontSize: '16px' }}
                                            >
                                                <FilterListIcon /> Lọc
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleCloseFilter(null)}>
                                <MenuItem onClick={() => handleCloseFilter('Họ tên')}>Họ tên</MenuItem>
                                <MenuItem onClick={() => handleCloseFilter('Chuyên khoa')}>Chuyên khoa</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className={cx('wrapper-btn')}>
                        <Button className={cx('btn')} type="primary" onClick={() => setIsCreateClinic(true)}>
                            <FormOutlined />
                            &nbsp;Thêm mới
                        </Button>
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
                            defaultPageSize={7}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default ClinicManagement;
