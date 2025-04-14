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
import convertISODateToLocalDate from '../../utils/convertISODateToLocalDate';
import { Tag } from 'antd';
import * as patientService from '../../services/patientService';
import { useMutation } from 'react-query';

const cx = classNames.bind(styles);

const AppointmentManagement = ({ isLoading, data, refetch }) => {
    const [rowSelected, setRowSelected] = useState('');
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isCreateAppointment, setIsCreateAppointment] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    // Lọc dữ liệu theo searchValue và filterOption
    const filteredData = data?.filter((item) => {
        const searchVal = searchValue.toLowerCase().trim();
        const statusMap = {
            1: { text: 'Chưa khám', color: 'orange' },
            2: { text: 'Đã hủy', color: 'red' },
            3: { text: 'Hoàn thành', color: 'green' },
        };
        if (filterOption === 'Họ tên') {
            return item.patientName?.toLowerCase().includes(searchVal);
        } else if (filterOption === 'Ngày khám') {
            return (
                item.examinationDate &&
                convertISODateToLocalDate(item.examinationDate).toLowerCase().includes(searchVal)
            );
        } else if (filterOption === 'Giờ khám') {
            if (item.clinicSchedule) {
                const startTime = item.clinicSchedule.startTime ? item.clinicSchedule.startTime.toLowerCase() : '';
                const endTime = item.clinicSchedule.endTime ? item.clinicSchedule.endTime.toLowerCase() : '';
                return startTime.includes(searchVal) || endTime.includes(searchVal);
            }
            return false;
        } else if (filterOption === 'Trạng thái') {
            const statusText = statusMap[item.status]?.text.toLowerCase() || '';
            return statusText.includes(searchVal);
        } else {
            return (
                item.patientName?.toLowerCase().includes(searchVal) ||
                (item.examinationDate &&
                    convertISODateToLocalDate(item.examinationDate).toLowerCase().includes(searchVal)) ||
                (item.clinicSchedule &&
                    (item.clinicSchedule.startTime?.toLowerCase().includes(searchVal) ||
                        item.clinicSchedule.endTime?.toLowerCase().includes(searchVal))) ||
                statusMap[item.status]?.text.toLowerCase().includes(searchVal)
            );
        }
    });

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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'code',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'patientName',
        },
        {
            title: 'Ngày khám',
            dataIndex: 'examinationDate',
            render: (text, record) => convertISODateToLocalDate(record.examinationDate),
        },
        {
            title: 'Giờ khám',
            dataIndex: 'clinicSchedule',
            render: (clinicSchedule) =>
                clinicSchedule ? `${clinicSchedule.startTime} - ${clinicSchedule.endTime}` : 'Chưa có lịch',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                const statusMap = {
                    1: { text: 'Chưa khám', color: 'orange' },
                    2: { text: 'Đã hủy', color: 'red' },
                    3: { text: 'Hoàn thành', color: 'green' },
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

    const mutationMedicalConsultationHistory = useMutation({
        mutationFn: (data) => patientService.deleteMedicalConsultationHistory(data),
    });

    return (
        <div className={cx('wrapper')}>
            {isDetailVisible ? (
                <AppointmentInformation
                    onBack={() => setIsDetailVisible(false)}
                    rowSelectedInfo={rowSelected}
                    refetch={refetch}
                />
            ) : isCreateAppointment ? (
                <CreateAppointment onBack={() => setIsCreateAppointment(false)} refetch={refetch} />
            ) : (
                <>
                    <div className={cx('title')}>Quản lý lịch khám</div>
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
                            defaultPageSize={7}
                        />
                    </div>
                    <ModalConfirm
                        isOpen={isDeleteModalOpen}
                        setIsOpen={setIsDeleteModalOpen}
                        rowSelected={rowSelected}
                        title="Bạn có chắc chắn xóa lịch khám này?"
                        refetch={refetch}
                        mutation={mutationMedicalConsultationHistory}
                    />
                </>
            )}
        </div>
    );
};

export default AppointmentManagement;
