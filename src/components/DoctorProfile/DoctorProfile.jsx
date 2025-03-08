import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './DoctorProfile.module.scss';
import images from '../../assets';
import { UserOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import Button from '../Button/Button';

const cx = classNames.bind(styles);

const DoctorProfile = () => {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

    const showModalEdit = () => {
        setIsModalOpenEdit(true);
    };

    const handleCancelComment = () => {
        setIsModalOpenEdit(false);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Hồ sơ bác sỹ</div>
            <div className={cx('wrapper-content')}>
                <div className={cx('content-left')}>
                    <div className={cx('wrapper-form')}>
                        <div className={cx('form')}>
                            <div className={cx('form-label')}>
                                <label htmlFor="User">Họ và tên</label>
                                <Input
                                    // value={username}
                                    id="username"
                                    required
                                    disabled={true}
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="gender">Giới tính</label>
                                <Input id="gender" required disabled={true} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="dateOfBirth">Ngày sinh</label>
                                <Input id="dateOfBirth" required disabled={true} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="address">Địa chỉ</label>
                                <Input id="address" required disabled={true} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="workplace">Nơi công tác</label>
                                <Input id="workplace" required disabled={true} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="specialty">Chuyên khoa</label>
                                <Input id="specialty" required disabled={true} />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="level">Trình độ</label>
                                <Input id="level" required disabled={true} />
                            </div>
                        </div>
                        <div className={cx('wrapper-btn')}>
                            <Button className={cx('btn')} type="primary" onClick={showModalEdit}>
                                Chỉnh sửa
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={cx('content-right')}>
                    <div className={cx('wrapper-avatar')}>
                        <img className={cx('avatar')} src={images.avatar} alt="avatar" />
                    </div>
                    <div className={cx('content-right-info')}>
                        <div className={cx('form-label')}>
                            <label htmlFor="email">Email:</label>
                            <Input id="email" required disabled={true} />
                        </div>
                        <div className={cx('form-label')}>
                            <label htmlFor="phone">SDT:</label>
                            <Input id="phone" required disabled={true} />
                        </div>
                        <div className={cx('more-info')}>
                            <label htmlFor="introduce">Giới thiệu thêm:</label>
                            <div className={cx('info')}></div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title={<div className={cx('title-model-edit')}>Chỉnh sửa hồ sơ bác sỹ </div>}
                open={isModalOpenEdit}
                onCancel={handleCancelComment}
                width="45%"
                style={{ top: 10 }}
                footer={null}
            >
                <div className={cx('footer-edit')}>
                    <div className={cx('content-send')}>
                        <div className={cx('form')}>
                            <div className={cx('form-label')}>
                                <label htmlFor="User">Họ và tên</label>
                                <Input
                                    // value={username}
                                    id="username"
                                    required
                                />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="gender">Giới tính</label>
                                <Input id="gender" required />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="dateOfBirth">Ngày sinh</label>
                                <Input id="dateOfBirth" required />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="email">Email</label>
                                <Input id="email" required />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="phone">SDT</label>
                                <Input id="phone" required />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="address">Địa chỉ</label>
                                <Input id="address" required />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="workplace">Nơi công tác</label>
                                <Input id="workplace" required />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="specialty">Chuyên khoa</label>
                                <Input id="specialty" required />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="level">Trình độ</label>
                                <Input id="level" required />
                            </div>
                            <div className={cx('form-label')}>
                                <label htmlFor="introduce">Giới thiệu thêm:</label>
                                <textarea id="introduce" rows={10}></textarea>
                            </div>
                        </div>
                        <div className={cx('wrapper-btn')}>
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

export default DoctorProfile;
