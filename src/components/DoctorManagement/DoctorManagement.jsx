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

const DoctorManagement = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isCreateDoctor, setIsCreateDoctor] = useState(false);

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
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 2,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 3,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 4,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 5,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 6,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
            {
                _id: 7,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },{
                _id: 8,
                patient_id: '123456',
                doctor_name: 'John Doe',
                email: 'nguyenvana@gmai.com',
                specialty: 'Cấp cứu',
            },
        ],
    };

    const columns = [
        {
            title: 'Mã bác sĩ',
            dataIndex: '_id',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'doctor_name',
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
    return (
        <div className={cx('wrapper')}>
            {isDetailVisible ? (
                <DetailDoctor onBack={() => setIsDetailVisible(false)} />
            ) : isCreateDoctor ? (
                <CreateDoctor onBack={() => setIsCreateDoctor(false)} />
            ) : (
                <>
                    <div className={cx('title')}>Quản lý bác sĩ</div>
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
                        <Button className={cx('btn')} type="primary" onClick={() => setIsCreateDoctor(true)}>
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

export default DoctorManagement;
