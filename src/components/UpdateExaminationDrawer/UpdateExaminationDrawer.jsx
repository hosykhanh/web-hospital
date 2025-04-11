import { useEffect, useState } from 'react';
import { Drawer, Form, Input } from 'antd';
import classNames from 'classnames/bind';
import styles from './UpdateExaminationDrawer.module.scss';
import * as patientService from '../../services/patientService';
import * as userService from '../../services/userServices';
import TextArea from 'antd/es/input/TextArea';
import convertISODateToLocalDate from '../../utils/convertISODateToLocalDate';

const cx = classNames.bind(styles);

const UpdateExaminationDrawer = ({ visible, setIsOpenDrawer, rowSelected, refetch }) => {
    const [form] = Form.useForm();
    const [dataHistory, setDataHistory] = useState();
    const [doctor, setDoctor] = useState([]);

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
        if (dataHistory?.responsibilityDoctorId) {
            const getDoctor = async () => {
                const res = await userService.getUser(dataHistory?.responsibilityDoctorId);
                setDoctor(res.data);
            };
            getDoctor();
        }
    }, [dataHistory]);

    useEffect(() => {
        if (dataHistory) {
            form.setFieldsValue({
                examinationDate: convertISODateToLocalDate(dataHistory.examinationDate),
                reExaminateDate: convertISODateToLocalDate(dataHistory.reExaminateDate),
                medicalServiceName: dataHistory.medicalServiceName,
                responsibilityDoctor: doctor?.userName,
                patientStatus: dataHistory.patientStatus,
                diagnosis: dataHistory.diagnosis,
                noteFromDoctor: dataHistory.noteFromDoctor,
            });
        }
    }, [dataHistory, form, doctor]);

    return (
        <Drawer
            title="Lịch sử khám bệnh"
            placement="right"
            onClose={() => setIsOpenDrawer(false)}
            open={visible}
            width={520}
        >
            <Form form={form} layout="vertical" className={cx('examination-form')}>
                <div className={cx('form-title')}>
                    <h3>Lịch sử khám bệnh</h3>
                </div>

                <Form.Item name="responsibilityDoctor" label="Bác sĩ phụ trách" className={cx('form-item')}>
                    <Input />
                </Form.Item>

                <Form.Item name="medicalServiceName" label="Dịch vụ khám" className={cx('form-item')}>
                    <Input disabled style={{ color: 'black', backgroundColor: 'white' }} />
                </Form.Item>

                <Form.Item name="examinationDate" label="Ngày khám" className={cx('form-item')}>
                    <Input disabled style={{ color: 'black', backgroundColor: 'white' }} />
                </Form.Item>

                <Form.Item name="reExaminateDate" label="Ngày tái khám" className={cx('form-item')}>
                    <Input disabled style={{ color: 'black', backgroundColor: 'white' }} />
                </Form.Item>

                <Form.Item name="patientStatus" label="Tình trạng" className={cx('form-item')}>
                    <Input />
                </Form.Item>

                <Form.Item name="diagnosis" label="Chẩn đoán" className={cx('form-item')}>
                    <Input placeholder="Nhập chẩn đoán" />
                </Form.Item>

                <Form.Item name="noteFromDoctor" label="Ghi chú từ bác sĩ" className={cx('form-item')}>
                    <TextArea rows={4} className={cx('text-area')} />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default UpdateExaminationDrawer;
