import { useEffect, useState } from 'react';
import { Drawer, Form, Input, DatePicker, Select, Button } from 'antd';
import { SaveOutlined, CalendarOutlined, UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './UpdateExaminationDrawer.module.scss';
import * as patientService from '../../services/patientService';
import dayjs from 'dayjs';
import { Option } from 'antd/es/mentions';
import TextArea from 'antd/es/input/TextArea';

const cx = classNames.bind(styles);

const UpdateExaminationDrawer = ({ visible, setIsOpenDrawer, rowSelected, refetch }) => {
    const [form] = Form.useForm();
    const [dataHistory, setDataHistory] = useState();

    useEffect(() => {
        const getMedicalConsultationHistory = async () => {
            const data = await patientService.getMedicalConsultationHistory(rowSelected);
            setDataHistory(data?.data);
        };
        if (rowSelected) {
            getMedicalConsultationHistory();
        }
    }, [rowSelected]);

    useEffect(() => {
        if (dataHistory) {
            form.setFieldsValue({
                examinationDate: dataHistory.examinationDate ? dayjs(dataHistory.examinationDate) : null,
                reExaminateDate: dataHistory.reExaminateDate ? dayjs(dataHistory.reExaminateDate) : null,
                medicalServiceName: dataHistory.medicalServiceName,
                responsibilityDoctorId: dataHistory?.responsibilityDoctorId,
                patientStatus: dataHistory.patientStatus,
                diagnosis: dataHistory.diagnosis,
                noteFromDoctor: dataHistory.noteFromDoctor,
            });
        }
    }, [dataHistory, form]);

    const updateMedicalConsultationHistory = async (id, data) => {
        const res = await patientService.updateMedicalConsultationHistory(id, data);
        return res.data;
    };

    const handleSubmit = () => {
        console.log('Form values:', form.getFieldsValue());
        form.validateFields().then((values) => {
            console.log('Form values:', values);
            updateMedicalConsultationHistory(rowSelected, values);
            setIsOpenDrawer(false);
            refetch();
        });
    };

    return (
        <Drawer
            title="Lịch sử khám bệnh"
            placement="right"
            onClose={() => setIsOpenDrawer(false)}
            open={visible}
            width={520}
            footer={
                <div className={cx('drawer-footer')}>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit} className={cx('save-button')}>
                        Lưu
                    </Button>
                </div>
            }
        >
            <Form form={form} layout="vertical" className={cx('examination-form')}>
                <div className={cx('form-title')}>
                    <h3>Lịch sử khám bệnh</h3>
                </div>

                <Form.Item
                    name="examinationDate"
                    label="Ngày khám"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày khám!' }]}
                    className={cx('form-item')}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày khám"
                        className={cx('date-picker')}
                        suffixIcon={<CalendarOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="medicalServiceName"
                    label="Dịch vụ khám"
                    rules={[{ required: true, message: 'Vui lòng chọn dịch vụ khám!' }]}
                    className={cx('form-item')}
                >
                    <Select placeholder="Chọn dịch vụ khám" suffixIcon={<MedicineBoxOutlined />}>
                        <Option value="general">Khám tổng quát</Option>
                        <Option value="specialist">Khám chuyên khoa</Option>
                        <Option value="emergency">Khám cấp cứu</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="reponsibilityDoctorId"
                    label="Bác sĩ phụ trách"
                    // rules={[{ required: true, message: 'Vui lòng chọn bác sĩ phụ trách!' }]}
                    className={cx('form-item')}
                >
                    <Select placeholder="Chọn bác sĩ phụ trách" suffixIcon={<UserOutlined />}>
                        <Option value="dr1">Bác sĩ Nguyễn Văn A</Option>
                        <Option value="dr2">Bác sĩ Trần Thị B</Option>
                        <Option value="dr3">Bác sĩ Lê Văn C</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="patientStatus"
                    label="Tình trạng"
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
                    className={cx('form-item')}
                >
                    <Select placeholder="Chọn tình trạng">
                        <Option value="normal">Bình thường</Option>
                        <Option value="monitoring">Cần theo dõi</Option>
                        <Option value="serious">Nghiêm trọng</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="diagnosis"
                    label="Chẩn đoán"
                    rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán!' }]}
                    className={cx('form-item')}
                >
                    <Input placeholder="Nhập chẩn đoán" />
                </Form.Item>
                <Form.Item name="reExaminateDate" label="Ngày tái khám" className={cx('form-item')}>
                    <DatePicker
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày tái khám"
                        className={cx('date-picker')}
                        suffixIcon={<CalendarOutlined />}
                    />
                </Form.Item>

                <Form.Item name="noteFromDoctor" label="Ghi chú từ bác sĩ" className={cx('form-item')}>
                    <TextArea rows={4} placeholder="Nhập ghi chú từ bác sĩ" className={cx('text-area')} />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default UpdateExaminationDrawer;
