import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, message, Modal, Select } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './CreateSchedule.module.scss';
import { useSelector } from 'react-redux';
import * as scheduleService from '../../../services/scheduleService';

const cx = classNames.bind(styles);

const CreateSchedule = ({ isModalOpen, setIsModalOpen, refetch }) => {
    const user = useSelector((state) => state.user);
    const [dataClinicSchedule, setClinicSchedule] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const getClinicSchedule = async () => {
            try {
                const res = await scheduleService.getClinicSchedule(user?.clinicId);
                setClinicSchedule(res?.data);
            } catch (error) {
                console.error('Error fetching clinic schedule:', error);
            }
        };
        getClinicSchedule();
    }, [user?.clinicId]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const newValues = { ...values, doctorId: user?.id };

            await scheduleService.createLeaveSchedule(newValues);
            message.success('Thêm lịch nghỉ thành công!');

            setIsModalOpen(false);
            refetch();
            form.resetFields();
        } catch (error) {
            console.log('Validate Failed:', error);
        }
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
                        label="Chọn ngày"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                    >
                        <DatePicker
                            placeholder="Chọn ngày"
                            className={cx('form-input')}
                            format="DD/MM/YYYY"
                            suffixIcon={<CalendarOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        name="clinicScheduleId"
                        label="Giờ nghỉ"
                        rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
                    >
                        <Select
                            placeholder="Chọn giờ"
                            suffixIcon={<ClockCircleOutlined />}
                            options={dataClinicSchedule?.map((item) => ({
                                label: `${item.startTime} - ${item.endTime}`,
                                value: item._id,
                            }))}
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
