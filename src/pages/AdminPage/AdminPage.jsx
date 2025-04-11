import { Menu } from 'antd';
import { useState } from 'react';
import { getItem } from '../../utils';
import { AuditOutlined, BankOutlined, BarChartOutlined, ScheduleOutlined, TeamOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './AdminPage.module.scss';
import PatientManagement from '../../components/PatientManagement/PatientManagement';
import images from '../../assets';
import AppointmentManagement from '../../components/AppointmentManagement/AppointmentManagement';
import Statistical from '../../components/Statistical/Statistical';
import DoctorManagement from '../../components/DoctorManagement/DoctorManagement';
import ClinicManagement from '../../components/ClinicManagement/ClinicManagement';
import * as patientService from '../../services/patientService';
import * as doctorService from '../../services/doctorService';
import * as clinicService from '../../services/clinicService';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetUser } from '../../redux/slice/userSlice';
import Loading from '../../components/Loading/Loading';

const cx = classNames.bind(styles);

function AdminPage() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [keySelected, setKeySelected] = useState('statistical');
    const items = [
        getItem('Thống kê', 'statistical', <BarChartOutlined />),
        getItem('Quản lý phòng khám', 'clinic', <BankOutlined />),
        getItem('Quản lý bác sĩ', 'doctor', <TeamOutlined />),
        getItem('Quản lý bệnh nhân', 'patient', <AuditOutlined />),
        getItem('Quản lý lịch khám', 'appointment', <ScheduleOutlined />),
    ];
    const handleOnClick = ({ key }) => {
        setKeySelected(key);
    };

    // --- API GET ALL CLINICS ---
    const {
        data: dataClinic,
        isLoading: isLoadingClinic,
        refetch: refetchClinic,
    } = useQuery(['clinic'], () => clinicService.getAllClinics(), {
        enabled: keySelected === 'clinic',
        select: (data) => data?.data?.items || [],
    });

    // --- API GET ALL DOCTORS ---
    const getAllDoctors = async () => {
        const res = await doctorService.getAllDoctors();
        return res.data.items;
    };

    const {
        isLoading: isLoadingDoctors,
        data: dataDoctors,
        refetch: refetchDoctors,
    } = useQuery(['doctor'], getAllDoctors, {
        enabled: keySelected === 'doctor',
    });

    // --- API GET ALL PATIENTS BY DOCTOR ID ---
    const getAllPatients = async () => {
        const res = await patientService.getAllPatients();
        return res.data.items;
    };

    const {
        isLoading: isLoadingPatients,
        data: dataPatients,
        refetch: refetchPatients,
    } = useQuery(['patient'], getAllPatients, {
        enabled: keySelected === 'patient',
    });

    // --- API GET ALL MEDICAL CONSULTATION HISTORY ---
    const {
        data: dataPatientManagement,
        isLoading: isLoadingPatientManagement,
        refetch: refetchPatientManagement,
    } = useQuery(['appointment'], () => patientService.getAllMedicalConsultationHistory(), {
        enabled: keySelected === 'appointment',
        select: (data) => data?.data?.items || [],
    });

    const handleLogout = async () => {
        setLoading(true);
        dispatch(resetUser());
        localStorage.removeItem('access_token');
        navigate('/');
        setLoading(false);
    };

    const renderPage = (key) => {
        switch (key) {
            case 'statistical':
                return <Statistical />;
            case 'clinic':
                return <ClinicManagement isLoading={isLoadingClinic} data={dataClinic} refetch={refetchClinic} />;
            case 'doctor':
                return <DoctorManagement isLoading={isLoadingDoctors} data={dataDoctors} refetch={refetchDoctors} />;
            case 'patient':
                return (
                    <PatientManagement isLoading={isLoadingPatients} data={dataPatients} refetch={refetchPatients} />
                );
            case 'appointment':
                return (
                    <AppointmentManagement
                        isLoading={isLoadingPatientManagement}
                        data={dataPatientManagement}
                        refetch={refetchPatientManagement}
                    />
                );
            default:
                return <></>;
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-menu')}>
                <div className={cx('name-web-1')}>MedMeet</div>
                <div className={cx('logo')}>
                    <img src={images.logo} alt="" width="100px" />
                </div>
                <div className={cx('welcome')}>Xin chào Admin</div>
                <Menu
                    selectedKeys={[keySelected]}
                    theme="dark"
                    onClick={handleOnClick}
                    className={cx('menu')}
                    items={items}
                />
                <div className={cx('logout')} onClick={handleLogout}>
                    <Loading isLoading={loading}>Đăng xuất</Loading>
                </div>
            </div>
            <div className={cx('wrapper-content')}>{renderPage(keySelected)}</div>
        </div>
    );
}

export default AdminPage;
