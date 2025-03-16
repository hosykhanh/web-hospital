import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './AppointmentManagement.module.scss';
import TableComp from '../TableComp/TableComp';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import ModalConfirm from '../ModalConfirm/ModalConfirm';
import Button from '../Button/Button';
import { TextField, InputAdornment, IconButton, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AppointmentInformation from './AppointmentInformation/AppointmentInformation';
import CreateAppointment from './CreateAppointment/CreateAppointment';

const cx = classNames.bind(styles);

const AppointmentManagement = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isCreateAppointment, setIsCreateAppointment] = useState(false);
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
            title: 'ID',
            dataIndex: '_id',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'patient_name',
        },
        {
            title: 'Ngày khám',
            dataIndex: 'patient_dob',
        },
        {
            title: 'Giờ khám',
            dataIndex: 'patient_dob',
        },
        {
            title: 'Trạng thái',
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
                <AppointmentInformation onBack={() => setIsDetailVisible(false)} />
            ) : isCreateAppointment ? (
                <CreateAppointment onBack={() => setIsCreateAppointment(false)} />
            ) : (
                <>
                    <div className={cx('title')}>Quản lý lịch khám</div>
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
                                <MenuItem onClick={() => handleCloseFilter('Ngày khám')}>Ngày khám</MenuItem>
                                <MenuItem onClick={() => handleCloseFilter('Giờ khám')}>Giờ khám</MenuItem>
                                <MenuItem onClick={() => handleCloseFilter('Trạng thái')}>Trạng thái</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className={cx('wrapper-btn')}>
                        <Button className={cx('btn')} type="primary" onClick={() => setIsCreateAppointment(true)}>
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
                    <ModalConfirm
                        isOpen={isDeleteModalOpen}
                        setIsOpen={setIsDeleteModalOpen}
                        rowSelected={rowSelected}
                        title="Bạn có chắc chắn xóa lịch khám này?"
                        // refetch={refetch}
                        // mutation={mutation}
                    />
                </>
            )}
        </div>
    );
};

export default AppointmentManagement;
