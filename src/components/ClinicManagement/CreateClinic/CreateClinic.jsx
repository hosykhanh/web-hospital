import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './CreateClinic.module.scss';
import { Checkbox, Input, message, Modal, Tag } from 'antd';
import Button from '../../Button/Button';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useMutation } from 'react-query';
import * as clinicService from '../../../services/clinicService';

const cx = classNames.bind(styles);

const CreateClinic = ({ onBack }) => {
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // const [isCreateTimeWork, setIsCreateTimeWork] = useState(false);
    // const [isCreateMedicalService, setIsCreateMedicalService] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [hotline, setHotline] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');

    const mutation = useMutation({
        mutationFn: (data) => clinicService.createClinic(data),
        onSuccess: (data) => {
            message.success('Tạo phòng khám thành công!');
        },
        onError: (error) => {
            message.error('Tạo phòng khám thất bại!');
        },
    });

    const toggleTime = (time) => {
        setSelectedTimes((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]));
    };

    const handleConfirm = () => {
        setModalVisible(false);
    };

    const removeTime = (time) => {
        setSelectedTimes((prev) => prev.filter((t) => t !== time));
    };

    const handleCreateClinic = () => {
        mutation.mutate({
            name,
            email,
            hotline,
            address,
            description,
        });
    };

    const timeSlots = [
        '08:00 - 09:00',
        '09:00 - 10:00',
        '10:00 - 11:00',
        '13:00 - 14:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
    ];

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
                    <div className={cx('form-label')}>
                        <label htmlFor="User">TÊN PHÒNG KHÁM</label>
                        <Input
                            className={cx('input')}
                            required
                            placeholder="Nhập tên phòng khám"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={cx('form-user-email')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="email">EMAIL</label>
                            <Input
                                className={cx('input')}
                                required
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="phone">HOLINE</label>
                            <Input
                                className={cx('input')}
                                required
                                placeholder="Nhập số điện thoại"
                                value={hotline}
                                onChange={(e) => setHotline(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="address">ĐỊA CHỈ</label>
                        <Input
                            className={cx('input')}
                            required
                            placeholder="Nhập địa chỉ"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className={cx('more-info')}>
                        <label htmlFor="introduce">GIỚI THIỆU THÊM</label>
                        <TextArea
                            className={cx('info')}
                            placeholder="Nhập giới thiệu thêm về phòng khám"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></TextArea>
                    </div>
                    {/* <div className={cx('form-label')}>
                        <label htmlFor="timeWork">THỜI GIAN LÀM VIỆC</label>
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
                    {selectedTimes.length > 0 && (
                        <div className="mt-4">
                            {selectedTimes.map((time) => (
                                <Tag
                                    key={time}
                                    color="blue"
                                    closable
                                    onClose={() => removeTime(time)}
                                    style={{ marginRight: 5, fontSize: 14, padding: '10px 5px' }}
                                    closeIcon={<CloseOutlined style={{ fontSize: '15px' }} />}
                                >
                                    {time}
                                </Tag>
                            ))}
                        </div>
                    )} */}
                    <div className={cx('wrapper-btn-save')}>
                        <Button className={cx('btn')} type="primary" onClick={handleCreateClinic}>
                            Lưu
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateClinic;
