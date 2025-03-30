import { Menu } from 'antd';
import { useState } from 'react';
import { getItem } from '../../utils';
import { AuditOutlined, ScheduleOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './DoctorPage.module.scss';
import DoctorProfile from '../../components/DoctorProfile/DoctorProfile';
import PatientManagement from '../../components/PatientManagement/PatientManagement';
import images from '../../assets';
import AppointmentManagement from '../../components/AppointmentManagement/AppointmentManagement';
import ScheduleSettings from '../../components/ScheduleSettings/ScheduleSettings';

import * as patientService from '../../services/patientService';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetUser } from '../../redux/slice/userSlice';
import Loading from '../../components/Loading/Loading';

const cx = classNames.bind(styles);

function DoctorPage() {
    const users = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [keySelected, setKeySelected] = useState('docterProflie');
    const items = [
        getItem('Hồ sơ bác sĩ', 'docterProflie', <UserOutlined />),
        getItem('Quản lý bệnh nhân', 'patient', <AuditOutlined />),
        getItem('Quản lý lịch khám', 'appointment', <ScheduleOutlined />),
        getItem('Cài đặt lịch', 'ScheduleSettings', <SettingOutlined />),
    ];
    const handleOnClick = ({ key }) => {
        setKeySelected(key);
    };

    // --- API GET ALL PATIENTS ---
    const getAllPatients = async () => {
        const res = await patientService.getAllPatients(users?.id);
        return res.data;
    };

    const {
        isLoading: isLoadingPatients,
        data: dataPatients,
        refetch: refetchPatients,
    } = useQuery(['patient'], getAllPatients, {
        enabled: keySelected === 'patient',
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
            case 'docterProflie':
                return <DoctorProfile />;
            case 'patient':
                return (
                    <PatientManagement isLoading={isLoadingPatients} data={dataPatients} refetch={refetchPatients} />
                );
            case 'appointment':
                return <AppointmentManagement />;
            case 'ScheduleSettings':
                return <ScheduleSettings />;
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

export default DoctorPage;
