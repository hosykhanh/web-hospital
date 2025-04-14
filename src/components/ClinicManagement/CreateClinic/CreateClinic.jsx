import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './CreateClinic.module.scss';
import { Checkbox, DatePicker, Input, Modal, Tag } from 'antd';
import convertISODateToLocalDate from '../../../utils/convertISODateToLocalDate';
import dayjs from 'dayjs';
import Button from '../../Button/Button';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import images from '../../../assets';
import TextArea from 'antd/es/input/TextArea';

const cx = classNames.bind(styles);

const CreateClinic = ({ onBack }) => {
    const timeSlots = [
        '08:00 - 09:00',
        '09:00 - 10:00',
        '10:00 - 11:00',
        '13:00 - 14:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
    ];

    const [selectedTimes, setSelectedTimes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const toggleTime = (time) => {
        setSelectedTimes((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]));
    };

    const handleConfirm = () => {
        setModalVisible(false);
    };

    const removeTime = (time) => {
        setSelectedTimes((prev) => prev.filter((t) => t !== time));
    };

    return (
        <div>
            <div>
                <button onClick={onBack} className={cx('back')}>
                    <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                </button>
            </div>
            <div className={cx('wrapper-content')}>
                <div className={cx('form')}>
                    <div className={cx('formHeader')}>
                        <h2>Thêm mới phòng khám</h2>
                        <p>Vui lòng điền đầy đủ thông tin để thêm phòng khám</p>
                    </div>
                    <div className={cx('wrapper-avatar')}>
                        <img className={cx('avatar')} src={images.clinic} alt="avatar" />
                    </div>
                    <div className={cx('form-user-email')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="User">TÊN PHÒNG KHÁM</label>
                            <Input className={cx('input')} required placeholder="Nhập tên phòng khám" />
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="Status">TRẠNG THÁI</label>
                            <Input className={cx('input')} required value="" />
                        </div>
                    </div>
                    <div className={cx('form-user-email')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="email">EMAIL</label>
                            <Input className={cx('input')} required value="" placeholder="Nhập email" />
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="phone">HOLINE</label>
                            <Input className={cx('input')} required value="" placeholder="Nhập số điện thoại" />
                        </div>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="address">ĐỊA CHỈ</label>
                        <Input className={cx('input')} required value="" placeholder="Nhập địa chỉ" />
                    </div>
                    <div className={cx('more-info')}>
                        <label htmlFor="introduce">GIỚI THIỆU THÊM</label>
                        <TextArea className={cx('info')} placeholder="Nhập giới thiệu thêm về phòng khám"></TextArea>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="address">THỜI GIAN LÀM VIỆC</label>
                        <Button className={cx('btn-time')} type="primary" onClick={() => setModalVisible(true)}>
                            Chọn khung giờ
                        </Button>
                    </div>
                    <Modal
                        title="Chọn khung giờ"
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        onOk={handleConfirm}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {timeSlots.map((time) => (
                                <Checkbox
                                    key={time}
                                    checked={selectedTimes.includes(time)}
                                    onChange={() => toggleTime(time)}
                                >
                                    {time}
                                </Checkbox>
                            ))}
                        </div>
                    </Modal>

                    {/* Hiển thị các khung giờ đã chọn */}
                    {selectedTimes.length > 0 && (
                        <div className="mt-4">
                            {selectedTimes.map((time) => (
                                <Tag
                                    key={time}
                                    color="blue"
                                    closable
                                    onClose={() => removeTime(time)}
                                    style={{ marginRight: 5, fontSize: 14 }}
                                    closeIcon={<CloseOutlined style={{ fontSize: '15px' }} />}
                                >
                                    {time}
                                </Tag>
                            ))}
                        </div>
                    )}
                    <div className={cx('wrapper-btn-save')}>
                        <Button className={cx('btn')} type="primary">
                            Lưu
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateClinic;
