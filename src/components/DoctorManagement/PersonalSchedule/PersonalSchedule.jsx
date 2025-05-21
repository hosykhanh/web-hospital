import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { DatePicker, ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/vi_VN';
import styles from './PersonalSchedule.module.scss';
import { Calendar } from 'lucide-react';
import * as doctorService from '../../../services/doctorService';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

export default function PersonalSchedule({ doctorId }) {
    const [dataTime, setDataTime] = useState([]);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const handleDateChange = async (date) => {
        setSelectedDate(date);
        if (!date) {
            setDataTime([]);
            setSelectedSlot(null);
            return;
        }
        const res = await doctorService.getDoctorWorkingSchedules(doctorId, date.format('YYYY-MM-DD'));
        setDataTime(res.data);
    };

    useEffect(() => {
        if (doctorId) {
            handleDateChange(dayjs());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doctorId]);

    const handleSlotSelect = (id) => {
        setSelectedSlot(id);
    };

    const getSlotStatus = (slot) => {
        if (slot.isLeave) return 'off';
        if (slot.isWorking) return 'appointment';
        return 'empty';
    };

    const getSlotClassName = (slot, isSelected) => {
        const status = getSlotStatus(slot);
        return cx('time-slot', {
            'time-slot-empty': status === 'empty',
            'time-slot-appointment': status === 'appointment',
            'time-slot-off': status === 'off',
            selected: isSelected,
        });
    };

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h2 className={cx('title')}>Lịch trình cá nhân</h2>
                <ConfigProvider locale={locale}>
                    <DatePicker
                        className={cx('ant-date-picker')}
                        value={selectedDate}
                        onChange={handleDateChange}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                        suffixIcon={<Calendar className={cx('calendar-icon')} size={16} />}
                        allowClear={true}
                    />
                </ConfigProvider>
            </div>

            <div className={cx('legend')}>
                <div className={cx('legend-item')}>
                    <div className={cx('legend-color', 'legend-empty')}></div>
                    <span>Lịch trống</span>
                </div>
                <div className={cx('legend-item')}>
                    <div className={cx('legend-color', 'legend-appointment')}></div>
                    <span>Lịch khám</span>
                </div>
                <div className={cx('legend-item')}>
                    <div className={cx('legend-color', 'legend-off')}></div>
                    <span>Lịch nghỉ</span>
                </div>
            </div>

            <div className={cx('schedule-container')}>
                <div className={cx('time-slots')}>
                    {dataTime?.map((slot) => (
                        <button
                            key={slot._id}
                            className={getSlotClassName(slot, selectedSlot === slot._id)}
                            onClick={() => handleSlotSelect(slot._id)}
                        >
                            {slot.startTime} ~ {slot.endTime}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
