import { useState } from 'react';
import { ChevronDown, Filter, Plus } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import classNames from 'classnames/bind';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './ScheduleSettings.module.scss';

// Bind styles với classNames
const cx = classNames.bind(styles);

// Đăng ký locale tiếng Việt
registerLocale('vi', vi);

export default function ScheduleSettings() {
    const [date, setDate] = useState(new Date());
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Dữ liệu mẫu cho danh sách lịch nghỉ
    const scheduleData = [
        { id: 1, date: '15/03/2025', time: '08:00 - 17:00', reason: 'Nghỉ phép năm', status: 'Thành công' },
        { id: 2, date: '20/03/2025', time: '08:00 - 12:00', reason: 'Khám sức khỏe', status: 'Thành công' },
        { id: 3, date: '25/03/2025', time: '13:00 - 17:00', reason: 'Việc gia đình', status: 'Đã hủy' },
        { id: 1, date: '15/03/2025', time: '08:00 - 17:00', reason: 'Nghỉ phép năm', status: 'Thành công' },
        { id: 2, date: '20/03/2025', time: '08:00 - 12:00', reason: 'Khám sức khỏe', status: 'Thành công' },
        { id: 3, date: '25/03/2025', time: '13:00 - 17:00', reason: 'Việc gia đình', status: 'Đã hủy' },
        { id: 1, date: '15/03/2025', time: '08:00 - 17:00', reason: 'Nghỉ phép năm', status: 'Thành công' },
        { id: 2, date: '20/03/2025', time: '08:00 - 12:00', reason: 'Khám sức khỏe', status: 'Thành công' },
        { id: 3, date: '25/03/2025', time: '13:00 - 17:00', reason: 'Việc gia đình', status: 'Đã hủy' },
        { id: 1, date: '15/03/2025', time: '08:00 - 17:00', reason: 'Nghỉ phép năm', status: 'Thành công' },
        { id: 2, date: '20/03/2025', time: '08:00 - 12:00', reason: 'Khám sức khỏe', status: 'Thành công' },
        { id: 3, date: '25/03/2025', time: '13:00 - 17:00', reason: 'Việc gia đình', status: 'Đã hủy' },
        { id: 1, date: '15/03/2025', time: '08:00 - 17:00', reason: 'Nghỉ phép năm', status: 'Thành công' },
        { id: 2, date: '20/03/2025', time: '08:00 - 12:00', reason: 'Khám sức khỏe', status: 'Thành công' },
        { id: 3, date: '25/03/2025', time: '13:00 - 17:00', reason: 'Việc gia đình', status: 'Đã hủy' },
    ];

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
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
                                />
                            </div>
                            <div className={cx('legendContainer')}>
                                <div className={cx('legendItem')}>
                                    <div className={cx('legendColor', 'successColor')}></div>
                                    <span>Nghỉ đã duyệt</span>
                                </div>
                                <div className={cx('legendItem')}>
                                    <div className={cx('legendColor', 'pendingColor')}></div>
                                    <span>Đang chờ duyệt</span>
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
                                    <button className={cx('createButton')}>
                                        <Plus size={16} />
                                        <span>Tạo lịch nghỉ</span>
                                    </button>
                                </div>
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
                                        <tbody className={cx('tableBody')}>
                                            {scheduleData.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.date}</td>
                                                    <td>{item.time}</td>
                                                    <td>{item.reason}</td>
                                                    <td>
                                                        <span
                                                            className={cx('statusBadge', {
                                                                successBadge: item.status === 'Thành công',
                                                                canceledBadge: item.status === 'Đã hủy',
                                                            })}
                                                        >
                                                            {item.status}
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
