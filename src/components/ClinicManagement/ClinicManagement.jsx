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

    const [searchValue, setSearchValue] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterOption, setFilterOption] = useState('');

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const handleOpenFilter = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseFilter = (option) => {
        setFilterOption(option);
        setAnchorEl(null);
    };

    const filteredData = data?.filter((item) => {
        const searchVal = searchValue.toLowerCase().trim();

        if (filterOption === 'Họ tên') {
            return item.name?.toLowerCase().includes(searchVal);
        } else if (filterOption === 'Địa chỉ') {
            return item.address?.toLowerCase().includes(searchVal);
        } else {
            return item.name?.toLowerCase().includes(searchVal) || item.address?.toLowerCase().includes(searchVal);
        }
    });

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('view')} onClick={() => setIsDetailVisible(true)}>
                    Chi tiết
                </button>
            </div>
        );
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
                    1: { text: 'Đang hoạt động', color: 'green' },
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

    const onBack = () => {
        setIsDetailVisible(false);
        refetch();
        setRowSelected('');
    };

    return (
        <div className={cx('wrapper')}>
            {isDetailVisible ? (
                <DetailClinic onBack={onBack} rowSelectedClinic={rowSelected} refetch={refetch} />
            ) : isCreateClinic ? (
                <CreateClinic onBack={() => setIsCreateClinic(false)} refetch={refetch} />
            ) : (
                <>
                    <div className={cx('title')}>Quản lý phòng khám</div>
                    <div className={cx('search')}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Tìm kiếm..."
                                onChange={handleSearch}
                                value={searchValue}
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
                                <MenuItem onClick={() => handleCloseFilter('Địa chi')}>Địa chỉ</MenuItem>
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
                </>
            )}
        </div>
    );
};

export default ClinicManagement;
