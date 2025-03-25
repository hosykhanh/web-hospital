import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './DetailDoctor.module.scss';
import images from '../../../assets';
import { DatePicker, Input, Modal, Radio } from 'antd';
import Button from '../../Button/Button';
import dayjs from 'dayjs';
import convertISODateToLocalDate from '../../../utils/convertISODateToLocalDate';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PersonalSchedule from '../PersonalSchedule/PersonalSchedule';

const cx = classNames.bind(styles);

const DetailDoctor = ({ onBack }) => {
    const [dateOfBirth, setDateOfBirth] = useState(new Date('2000-02-01'));
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

    const showModalEdit = () => {
        setIsModalOpenEdit(true);
    };

    const handleCancelComment = () => {
        setIsModalOpenEdit(false);
    };
    return (
        <div className={cx('wrapper')}>
            <div>
                <button onClick={onBack} className={cx('back')}>
                    <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                </button>
            </div>
            <div className={cx('title')}>Thông tin bác sỹ</div>
            <div className={cx('wrapper-content')}>
                <div className={cx('content-left')}>
                    <div className={cx('wrapper-form')}>
                        <div className={cx('form')}>
                            <div className={cx('title-form-top')}>Thông tin tài khoản</div>
                            <div className={cx('form-user-email')}>
                                <div className={cx('form-label')}>
                                    <label htmlFor="User">HỌ VÀ TÊN</label>
                                    <Input value="Nguyễn Văn A" className={cx('input')} required disabled={true} />
                                </div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="email">EMAIL</label>
                                    <Input
                                        className={cx('input')}
                                        required
                                        disabled={true}
                                        value="nguyenvana@gmail.com"
                                    />
                                </div>
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">SỐ ĐIỆN THOẠI</label>
                                <Input className={cx('input')} required disabled={true} value="123456789" />
                            </div>
                            <div className={cx('form-label')} style={{marginBottom: '40px'}}>
                                <label htmlFor="address">ĐỊA CHỈ</label>
                                <Input className={cx('input')} required disabled={true} value="Hà Nội" />
                            </div>
                            <div className={cx('title-form-top')}>Thông tin chi tiết</div>
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
                                <Input
                                    className={cx('input')}
                                    required
                                    disabled={true}
                                    value={convertISODateToLocalDate(dateOfBirth || '2000-01-01')}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="specialty">CHUYÊN KHOA</label>
                                <Input className={cx('input')} required disabled={true} value="Tiêu hóa" />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="workplace">NƠI CÔNG TÁC</label>
                                <Input className={cx('input')} required disabled={true} value="Hà Nội" />
                            </div>
                            <div className={cx('more-info')}>
                                <label htmlFor="introduce">GIỚI THIỆU THÊM</label>
                                <div className={cx('info')}></div>
                            </div>
                            <div className={cx('wrapper-btn')}>
                                <Button className={cx('btn-edit')} type="primary" onClick={showModalEdit}>
                                    Chỉnh sửa
                                </Button>
                                <Button className={cx('btn-delete')} type="primary" onClick={showModalEdit}>
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-right')}>
                    <div className={cx('wrapper-avatar')}>
                        <img className={cx('avatar')} src={images.avatar} alt="avatar" />
                    </div>
                    <div className={cx('content-right-info')}>
                        <div className={cx('content-right-name')}>Bác sĩ Nguyễn Văn A</div>
                        <div className={cx('content-right-specialty')}>Thạc sĩ</div>
                    </div>
                    <div className={cx('schedule')}>
                        <PersonalSchedule/>
                    </div>
                </div>
            </div>
            <Modal
                title={<div className={cx('title-model-edit')}>Chỉnh sửa hồ sơ bác sỹ </div>}
                open={isModalOpenEdit}
                onCancel={handleCancelComment}
                width="50%"
                style={{ top: '5px' }}
                footer={null}
            >
                <div className={cx('footer-edit')}>
                    <div className={cx('content-send')}>
                        <div className={cx('form')}>
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
                        </div>
                        <div className={cx('wrapper-btn-save')}>
                            <Button className={cx('btn')} type="primary">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DetailDoctor;
