import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './CreateDoctor.module.scss';
import { DatePicker, Input, Radio } from 'antd';
import convertISODateToLocalDate from '../../../utils/convertISODateToLocalDate';
import dayjs from 'dayjs';
import Button from '../../Button/Button';
import { ArrowLeftOutlined } from '@ant-design/icons';
import images from '../../../assets';

const cx = classNames.bind(styles);

const CreateDoctor = ({ onBack }) => {
    const [dateOfBirth, setDateOfBirth] = useState(new Date('2000-02-01'));

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
                        <h2>Thêm mới bác sĩ</h2>
                        <p>Vui lòng điền đầy đủ thông tin để thêm bác sĩ</p>
                    </div>
                    <div className={cx('wrapper-avatar')}>
                        <img className={cx('avatar')} src={images.avatar} alt="avatar" />
                    </div>
                    <div className={cx('form-user-email')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="User">HỌ VÀ TÊN</label>
                            <Input value="Nguyễn Văn A" className={cx('input')} required />
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="email">EMAIL</label>
                            <Input className={cx('input')} required value="nguyenvana@gmail.com" />
                        </div>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="phone">SỐ ĐIỆN THOẠI</label>
                        <Input className={cx('input')} required value="123456789" />
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="address">ĐỊA CHỈ</label>
                        <Input className={cx('input')} required value="Hà Nội" />
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="level">TRÌNH ĐỘ</label>
                        <Radio.Group name="gender">
                            <Radio value="Male">THẠC SĨ</Radio>
                            <Radio value="Female">TIẾN SĨ</Radio>
                            <Radio value="Other">CHUYÊN KHOA A</Radio>
                        </Radio.Group>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="gender">GIỚI TÍNH</label>
                        <Radio.Group name="gender">
                            <Radio value="Male">Nam</Radio>
                            <Radio value="Female">Nữ</Radio>
                            <Radio value="Other">Khác</Radio>
                        </Radio.Group>
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="dateOfBirth">NGÀY SINH</label>
                        <DatePicker
                            format={'YYYY-MM-DD'}
                            value={dayjs(convertISODateToLocalDate(dateOfBirth || '2000-01-01'), 'YYYY-MM-DD')}
                            onChange={(date) => setDateOfBirth(date)}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="specialty">CHUYÊN KHOA</label>
                        <Input className={cx('input')} required value="Tiêu hóa" />
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="workplace">NƠI CÔNG TÁC</label>
                        <Input className={cx('input')} required value="Hà Nội" />
                    </div>
                    <div className={cx('more-info')}>
                        <label htmlFor="introduce">GIỚI THIỆU THÊM</label>
                        <textarea className={cx('info')}></textarea>
                    </div>
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

export default CreateDoctor;
