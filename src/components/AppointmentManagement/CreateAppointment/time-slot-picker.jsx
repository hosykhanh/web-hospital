import { X } from 'lucide-react';
import styles from './time-slot-picker.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const TimeSlotPicker = ({ isOpen, onClose, onSelect, selectedSlot, dataClinicSchedule }) => {
    if (!isOpen) return null;

    return (
        <div className={cx('modalOverlay')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('modalHeader')}>
                    <button type="button" className={cx('closeButton')} onClick={onClose}>
                        <X size={20} />
                    </button>
                    <h2>Chọn giờ khám</h2>
                </div>

                <div className={cx('timeSlots')}>
                    <div className={cx('sessionGroup')}>
                        <div className={cx('slotGrid')}>
                            {dataClinicSchedule?.map((slot) => (
                                <button
                                    key={slot._id}
                                    className={cx('timeSlot', {
                                        selected: selectedSlot?.id === slot._id,
                                    })}
                                    onClick={() => onSelect(slot)}
                                >
                                    {slot.startTime} - {slot.endTime}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeSlotPicker;
