import React from 'react';
import { Button, DatePicker, Form, Modal, TimePicker } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './CreateSchedule.module.scss';

const cx = classNames.bind(styles);

const CreateSchedule = ({ isModalOpen, setIsModalOpen }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                console.log('Form values:', values);
                setIsModalOpen(false);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <div>
            <Modal
                title={<div className={cx('title-model')}>Chọn lịch nghỉ </div>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                className={cx('vacation-modal')}
                centered
            >
                <Form form={form} layout="vertical" className={cx('vacation-form')}>
                    <Form.Item
                        name="date"
                        label="Ngày khám"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                    >
                        <DatePicker
                            placeholder="Chọn ngày"
                            className={cx('form-input')}
                            format="DD/MM/YYYY"
                            suffixIcon={<CalendarOutlined />}
                        />
                    </Form.Item>

                    <Form.Item name="time" label="Giờ nghỉ" rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}>
                        <TimePicker
                            placeholder="Chọn giờ"
                            className={cx('form-input')}
                            format="HH:mm"
                            suffixIcon={<ClockCircleOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        name="reason"
                        label="Lý do"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
                    >
                        <textarea className={cx('reason')}></textarea>
                    </Form.Item>

                    <Form.Item className={cx('form-button')}>
                        <Button type="primary" onClick={handleOk} className={cx('confirm-button')}>
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CreateSchedule;
