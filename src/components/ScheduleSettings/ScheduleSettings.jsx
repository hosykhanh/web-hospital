import { useState } from 'react';
import { ChevronDown, Filter, Plus } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import classNames from 'classnames/bind';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './ScheduleSettings.module.scss';
import CreateSchedule from './CreateSchedule/CreateSchedule';
import convertISODateToLocalDate from '../../utils/convertISODateToLocalDate';

const cx = classNames.bind(styles);

// Đăng ký locale tiếng Việt
registerLocale('vi', vi);

export default function ScheduleSettings({ isLoading, data, refetch }) {
    const [date, setDate] = useState(new Date());
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toISOString().split('T')[0]; // Lấy phần YYYY-MM-DD
    };

    const approvedDates = new Set(data?.filter((item) => item.status === 1).map((item) => formatDate(item.date)));
    const canceledDates = new Set(data?.filter((item) => item.status === 2).map((item) => formatDate(item.date)));

    // Hàm để gán class cho ngày trong lịch
    const dayClassName = (day) => {
        const formattedDate = day.toISOString().split('T')[0]; // Format YYYY-MM-DD

        if (approvedDates.has(formattedDate)) {
            return 'react-datepicker__day--approved';
        }
        if (canceledDates.has(formattedDate)) {
            return 'react-datepicker__day--canceled';
        }
        return ''; // Ngày bình thường
    };

    return (
        <div className={cx('scheduleContainer')}>
            <div className={cx('scheduleCard')}>
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
                                    dayClassName={dayClassName}
                                />
                            </div>
                            <div className={cx('legendContainer')}>
                                <div className={cx('legendItem')}>
                                    <div className={cx('legendColor', 'currentColor')}></div>
                                    <span>Ngày hiện tại</span>
                                </div>
                                <div className={cx('legendItem')}>
                                    <div className={cx('legendColor', 'successColor')}></div>
                                    <span>Nghỉ đã duyệt</span>
                                </div>
                                <div className={cx('legendItem')}>
                                    <div className={cx('legendColor', 'canceledColor')}></div>
                                    <span>Đã hủy</span>
                                </div>
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
                                    <div className={cx('filterContainer')}>
                                        <button className={cx('filterButton')} onClick={toggleFilter}>
                                            <Filter size={16} />
                                            <span>Lọc</span>
                                            <ChevronDown size={16} />
                                        </button>
                                        {isFilterOpen && (
                                            <div className={cx('filterContent')}>
                                                <div className={cx('filterOptions')}>
                                                    <div className={cx('filterOption')}>
                                                        <label>Trạng thái</label>
                                                        <select className={cx('selectInput')}>
                                                            <option value="all">Tất cả</option>
                                                            <option value="success">Thành công</option>
                                                            <option value="canceled">Đã hủy</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className={cx('filterActions')}>
                                                    <button className={cx('resetButton')}>Đặt lại</button>
                                                    <button className={cx('applyButton')}>Áp dụng</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={cx('tableContainer')}>
                                <table className={cx('scheduleTable')}>
                                    <colgroup>
                                        <col style={{ width: '10%' }} />
                                        <col style={{ width: '20%' }} />
                                        <col style={{ width: '20%' }} />
                                        <col style={{ width: '30%' }} />
                                        <col style={{ width: '20%' }} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Ngày</th>
                                            <th>Giờ nghỉ</th>
                                            <th>Lý do</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                </table>
                                <div className={cx('tableBodyWrapper')}>
                                    <table className={cx('scheduleTable')}>
                                        <colgroup>
                                            <col style={{ width: '10%' }} />
                                            <col style={{ width: '20%' }} />
                                            <col style={{ width: '20%' }} />
                                            <col style={{ width: '30%' }} />
                                            <col style={{ width: '20%' }} />
                                        </colgroup>
                                        <tbody className={cx('tableBody')}>
                                            {data?.map((item, index) => (
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
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
