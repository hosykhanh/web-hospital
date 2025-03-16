import { useState, useEffect } from 'react';
import {
    format,
    addDays,
    isToday,
    isSameDay,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
} from 'date-fns';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './custom-date-picke.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

// Tên các ngày trong tuần bằng tiếng Việt
const DAYS_OF_WEEK = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * Custom date picker component
 */
const CustomDatePicker = ({ isOpen, onClose, onSelect, selectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Calculate min and max dates (1-30 days from today)
    const minDate = new Date();
    const maxDate = addDays(new Date(), 30);

    useEffect(() => {
        // Nếu có ngày được chọn, hiển thị tháng chứa ngày đó
        if (selectedDate) {
            setCurrentMonth(new Date(selectedDate));
        }
    }, [selectedDate]);

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    // Tạo mảng các ngày để hiển thị trên lịch
    const getDaysInMonth = () => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));

        const days = [];
        let day = start;

        while (day <= end) {
            days.push(day);
            day = addDays(day, 1);
        }

        return days;
    };

    // Kiểm tra xem ngày có nằm trong khoảng cho phép không
    const isDateInRange = (date) => {
        return date >= minDate && date <= maxDate;
    };

    // Xử lý khi chọn ngày
    const handleDateClick = (date) => {
        if (isDateInRange(date)) {
            onSelect(date);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={cx('modalOverlay')}>
            <div className={cx('modalContent')}>
                <div className={cx('modalHeader')}>
                    <h2>Chọn ngày khám</h2>
                    <button onClick={onClose} className={cx('closeButton')}>
                        <X size={20} />
                    </button>
                </div>

                <div className={cx('infoMessage')}>
                    <span>ℹ️</span>
                    Hỗ trợ đặt lịch khám trước hẹn từ 1 đến 30 ngày.
                </div>

                <div className={cx('calendarContainer')}>
                    <div className={cx('calendarHeader')}>
                        <button
                            onClick={prevMonth}
                            className={cx('navButton')}
                            disabled={isSameMonth(currentMonth, minDate)}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className={cx('currentMonth')}>Tháng {format(currentMonth, 'M - yyyy')}</div>
                        <button
                            onClick={nextMonth}
                            className={cx('navButton')}
                            disabled={isSameMonth(currentMonth, addMonths(maxDate, 1))}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className={cx('weekDays')}>
                        {DAYS_OF_WEEK.map((day) => (
                            <div key={day} className={cx('weekDay')}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className={cx('daysGrid')}>
                        {getDaysInMonth().map((date, index) => {
                            const dayNumber = date.getDate();
                            const isCurrentMonth = isSameMonth(date, currentMonth);
                            const isSelectable = isDateInRange(date) && isCurrentMonth;

                            const dayClasses = cx('day', {
                                otherMonth: !isCurrentMonth,
                                today: isToday(date),
                                selected: selectedDate && isSameDay(date, new Date(selectedDate)),
                                disabled: !isSelectable,
                            });

                            return (
                                <div
                                    key={index}
                                    className={dayClasses}
                                    onClick={() => isSelectable && handleDateClick(date)}
                                >
                                    {dayNumber}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={cx('legend')}>
                    <div className={cx('legendItem')}>
                        <div className={cx('legendBox', 'today')}></div>
                        <span>Hôm nay</span>
                    </div>
                    <div className={cx('legendItem')}>
                        <div className={cx('legendBox', 'available')}></div>
                        <span>Còn trống</span>
                    </div>
                    <div className={cx('legendItem')}>
                        <div className={cx('legendBox', 'full')}></div>
                        <span>Kín lịch</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomDatePicker;
