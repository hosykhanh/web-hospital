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
import { Tag } from 'antd';

const cx = classNames.bind(styles);

const ClinicManagement = ({ isLoading, data, refetch }) => {
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

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên phòng khám',
            dataIndex: 'name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                const statusMap = {
                    1: { text: 'Hoạt động', color: 'green' },
                    2: { text: 'Tạm dừng', color: 'red' },
                };
                const { text, color } = statusMap[status] || { text: 'Không xác định', color: 'gray' };
                return <Tag color={color}>{text}</Tag>;
            },
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
                            data={data}
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
                            defaultPageSize={7}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default ClinicManagement;
