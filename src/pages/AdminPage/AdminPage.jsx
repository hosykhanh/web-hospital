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

const cx = classNames.bind(styles);

function AdminPage() {
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

    const renderPage = (key) => {
        switch (key) {
            case 'statistical':
                return <Statistical />;
            case 'clinic':
                return <ClinicManagement />;
            case 'doctor':
                return <DoctorManagement />;
            case 'patient':
                return <PatientManagement />;
            case 'appointment':
                return <AppointmentManagement />;
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
                <div className={cx('logout')}>Đăng xuất</div>
            </div>
            <div className={cx('wrapper-content')}>{renderPage(keySelected)}</div>
        </div>
    );
}

export default AdminPage;
