import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './DoctorManagement.module.scss';
import TableComp from '../TableComp/TableComp';
import { FormOutlined } from '@ant-design/icons';
import Button from '../Button/Button';
import { TextField, InputAdornment, IconButton, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CreateDoctor from './CreateDoctor/CreateDoctor';
import DetailDoctor from './DetailDoctor/DetailDoctor';

const cx = classNames.bind(styles);

const DoctorManagement = ({ isLoading, data, refetch }) => {
    const [rowSelected, setRowSelected] = useState('');
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isCreateDoctor, setIsCreateDoctor] = useState(false);

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
            return item.userName?.toLowerCase().includes(searchVal);
        } else if (filterOption === 'Chuyên khoa') {
            return item.specialty?.toLowerCase().includes(searchVal);
        } else {
            return (
                item.userName?.toLowerCase().includes(searchVal) || item.specialty?.toLowerCase().includes(searchVal)
            );
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
            title: 'Mã bác sĩ',
            dataIndex: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'userName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Chuyên khoa',
            dataIndex: 'specialty',
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
                <DetailDoctor onBack={onBack} rowSelected={rowSelected} refetch={refetch} />
            ) : isCreateDoctor ? (
                <CreateDoctor onBack={() => setIsCreateDoctor(false)} refetch={refetch} />
            ) : (
                <>
                    <div className={cx('title')}>Quản lý bác sĩ</div>
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
                                <MenuItem onClick={() => handleCloseFilter('Chuyên khoa')}>Chuyên khoa</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className={cx('wrapper-btn')}>
                        <Button className={cx('btn')} type="primary" onClick={() => setIsCreateDoctor(true)}>
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

export default DoctorManagement;
