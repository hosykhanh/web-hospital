import { useState } from 'react';
import { TimePicker, Button, Tag, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Loading from '../../Loading/Loading';
import * as scheduleService from '../../../services/scheduleService';
import classNames from 'classnames/bind';
import styles from './ClinicScheduleManager.module.scss';

const cx = classNames.bind(styles);

const ClinicScheduleManager = ({
    dataClinicSchedule,
    isLoadingClinicSchedule,
    rowSelectedClinic,
    refetchClinicSchedule,
}) => {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const handleChangeTimeClinicSchedule = (value) => {
        if (value) {
            setStartTime(value[0]);
            setEndTime(value[1]);
        } else {
            setStartTime(null);
            setEndTime(null);
        }
    };

    const handleOkCreateTimeClinicSchedule = async () => {
        if (!startTime || !endTime) {
            message.warning('Vui lòng chọn thời gian làm việc!');
            return;
        }

        const data = {
            startTime: startTime.format('HH:mm:ss'),
            endTime: endTime.format('HH:mm:ss'),
            clinicId: rowSelectedClinic,
        };

        try {
            await scheduleService.createClinicSchedule(data);
            message.success('Thêm thời gian làm việc thành công!');
            refetchClinicSchedule();
            setStartTime(null);
            setEndTime(null);
        } catch (error) {
            message.error('Thêm thời gian làm việc thất bại!');
        }
    };

    const handleDeleteTimeClinicSchedule = async (id) => {
        try {
            await scheduleService.deleteClinicSchedule(id);
            message.success('Xoá thời gian làm việc thành công!');
            refetchClinicSchedule();
        } catch (error) {
            message.error('Xoá thời gian làm việc thất bại!');
        }
    };

    return (
        <div className={cx('content-modal-time')}>
            <div className={cx('title-time')}>Danh sách các khoảng thời gian làm việc</div>
            <div className={cx('list-time')}>
                <Loading isLoading={isLoadingClinicSchedule}>
                    {dataClinicSchedule?.map((time) => (
                        <Tag
                            key={time?._id}
                            color="blue"
                            style={{
                                marginRight: 5,
                                marginTop: 5,
                                fontSize: 14,
                            }}
                        >
                            {time?.startTime} - {time?.endTime}{' '}
                            <DeleteOutlined
                                style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => handleDeleteTimeClinicSchedule(time?._id)}
                            />
                        </Tag>
                    ))}
                </Loading>
            </div>

            <div className={cx('title-time')}>Thêm thời gian làm việc</div>
            <div className={cx('form-label')}>
                <label htmlFor="time">Thời gian làm việc</label>
                <TimePicker.RangePicker
                    className={cx('input')}
                    required
                    value={startTime && endTime ? [startTime, endTime] : []}
                    format="HH:mm:ss"
                    onChange={handleChangeTimeClinicSchedule}
                />
            </div>
            <div>
                <Button className={cx('btn-add-time')} onClick={handleOkCreateTimeClinicSchedule}>
                    Thêm
                </Button>
            </div>
        </div>
    );
};

export default ClinicScheduleManager;
