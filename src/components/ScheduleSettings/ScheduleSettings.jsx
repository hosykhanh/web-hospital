import { useState } from 'react';
import { Plus, SearchIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import classNames from 'classnames/bind';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './ScheduleSettings.module.scss';
import CreateSchedule from './CreateSchedule/CreateSchedule';
import convertISODateToLocalDate from '../../utils/convertISODateToLocalDate';
import { Button, message, Modal } from 'antd';
import * as scheduleService from '../../services/scheduleService';
import Loading from '../Loading/Loading';
import { IconButton, InputAdornment, Menu, MenuItem, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const cx = classNames.bind(styles);

// Đăng ký locale tiếng Việt
registerLocale('vi', vi);

export default function ScheduleSettings({ isLoading, data, refetch }) {
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenCancel, setIsModalOpenCancel] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);

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

        if (filterOption === 'Ngày') {
            return item.date && convertISODateToLocalDate(item.date).toLowerCase().includes(searchVal);
        } else if (filterOption === 'Giờ nghỉ') {
            return (
                item.clinicSchedule?.startTime?.toLowerCase().includes(searchVal) ||
                item.clinicSchedule?.endTime?.toLowerCase().includes(searchVal)
            );
        } else {
            return (
                (item.date && convertISODateToLocalDate(item.date).toLowerCase().includes(searchVal)) ||
                item.specialty?.toLowerCase().includes(searchVal)
            );
        }
    });

    const showModalCancelSchedule = () => {
        setIsModalOpenCancel(true);
    };

    const handleBackCancelSchedule = () => {
        setIsModalOpenCancel(false);
    };

    const onOkModalCancelSchedule = async () => {
        try {
            await scheduleService.inActiveLeaveSchedule(rowSelected);
            setIsModalOpenCancel(false);
            message.success('Hủy lịch nghỉ thành công!');
            refetch();
        } catch (error) {
            message.error(`Hủy lịch nghỉ thất bại! ${error.response.data.message}`);
        }
    };

    return (
        <div className={cx('scheduleContainer')}>
            <div className={cx('cardHeader')}>
                <h2 className={cx('cardTitle')}>Cài đặt lịch</h2>
            </div>
            <div className={cx('cardContent')}>
                <h3 className={cx('sectionTitle')}>Danh sách lịch nghỉ</h3>

                <div className={cx('mainContent')}>
                    {/* Calendar Section */}
                    <div className={cx('calendarSection')}>
                        <div className={cx('calendarWrapper')}>
                            <DatePicker
                                selected={date}
                                onChange={(date) => setDate(date)}
                                inline
                                locale="vi"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                className={cx('fullCalendar')}
                            />
                        </div>
                    </div>

                    {/* List Section */}
                    <div className={cx('listSection')}>
                        <div className={cx('toolbarContainer')}>
                            <div className={cx('leftActions')}>
                                <button className={cx('createButton')} onClick={() => setIsModalOpen(true)}>
                                    <Plus size={16} />
                                    <span>Tạo lịch nghỉ</span>
                                </button>
                            </div>
                            <CreateSchedule
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                                refetch={refetch}
                            />
                            <div className={cx('rightActions')}>
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
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={() => handleCloseFilter(null)}
                                        >
                                            <MenuItem onClick={() => handleCloseFilter('Ngày')}>Ngày</MenuItem>
                                            <MenuItem onClick={() => handleCloseFilter('Giờ nghỉ')}>Giờ nghỉ</MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Loading isLoading={isLoading}>
                            <div className={cx('tableContainer')}>
                                <table className={cx('scheduleTable')}>
                                    <colgroup>
                                        <col style={{ width: '5%' }} />
                                        <col style={{ width: '15%' }} />
                                        <col style={{ width: '20%' }} />
                                        <col style={{ width: '30%' }} />
                                        <col style={{ width: '15%' }} />
                                        <col style={{ width: '15%' }} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Ngày</th>
                                            <th>Giờ nghỉ</th>
                                            <th>Lý do</th>
                                            <th>Trạng thái</th>
                                            <th>Hoạt động</th>
                                        </tr>
                                    </thead>
                                </table>
                                <div className={cx('tableBodyWrapper')}>
                                    <table className={cx('scheduleTable')}>
                                        <colgroup>
                                            <col style={{ width: '5%' }} />
                                            <col style={{ width: '15%' }} />
                                            <col style={{ width: '20%' }} />
                                            <col style={{ width: '30%' }} />
                                            <col style={{ width: '15%' }} />
                                            <col style={{ width: '15%' }} />
                                        </colgroup>
                                        <tbody className={cx('tableBody')}>
                                            {filteredData?.map((item, index) => (
                                                <tr key={item?._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{convertISODateToLocalDate(item?.date)}</td>
                                                    <td>
                                                        {item?.clinicSchedule?.startTime} -{' '}
                                                        {item?.clinicSchedule?.endTime}
                                                    </td>
                                                    <td>{item?.reason}</td>
                                                    <td>
                                                        <span
                                                            className={cx('statusBadge', {
                                                                successBadge: item?.status === 1,
                                                                canceledBadge: item?.status === 2,
                                                            })}
                                                        >
                                                            {item?.status === 1 ? 'Thành công' : 'Đã hủy'}
                                                        </span>
                                                    </td>
                                                    <td onClick={() => setRowSelected(item?._id)}>
                                                        {item?.status === 1 ? (
                                                            <Button
                                                                className={cx('cancelButton')}
                                                                onClick={showModalCancelSchedule}
                                                            >
                                                                Hủy lịch nghỉ
                                                            </Button>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Loading>
                        <Modal
                            title="Bạn có chắc muốn hủy lịch nghỉ này?"
                            open={isModalOpenCancel}
                            onOk={onOkModalCancelSchedule}
                            onCancel={handleBackCancelSchedule}
                            okButtonProps={{ style: { backgroundColor: '#ff4d4f' } }}
                            footer={[
                                <Button key="back" onClick={handleBackCancelSchedule}>
                                    Quay lại
                                </Button>,
                                <Button key="submit" type="primary" onClick={onOkModalCancelSchedule}>
                                    Xác nhận hủy
                                </Button>,
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
