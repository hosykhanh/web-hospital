import { Menu } from 'antd';
import { useState } from 'react';
import { getItem } from '../../utils';
import { AuditOutlined, ScheduleOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './DoctorPage.module.scss';
import DoctorProfile from '../../components/DoctorProfile/DoctorProfile';
import PatientManagement from '../../components/PatientManagement/PatientManagement';
import images from '../../assets';
// import * as postsService from '../../services/postsService';
// import * as chatService from '../../services/chatService';
// import { useQuery } from 'react-query';
// import TablePosts from '../../components/TablePosts/TablePosts';
// import TableGroup from '../../components/TableGroup/TableGroup';

const cx = classNames.bind(styles);

function DoctorPage() {
    const [keySelected, setKeySelected] = useState('docterProflie');
    const items = [
        getItem('Hồ sơ bác sĩ', 'docterProflie', <UserOutlined />),
        getItem('Quản lý bệnh nhân', 'patient', <AuditOutlined />),
        getItem('Quản lý lịch khám', 'appointment', <ScheduleOutlined />),
        getItem('Cài đặt lịch', 'calendarSetting', <SettingOutlined />),
    ];
    const handleOnClick = ({ key }) => {
        setKeySelected(key);
    };

    // // --- API GET ALL POSTS ---
    // const getAllPosts = async () => {
    //     const res = await postsService.getAllPosts();
    //     return res;
    // };

    // const {
    //     isLoading: isLoadingPosts,
    //     data: dataPosts,
    //     refetch: refetchPosts,
    // } = useQuery(['posts'], getAllPosts, {
    //     enabled: keySelected === 'posts',
    // });

    // // --- API GET ALL GROUP CHAT ---
    // const getAllGroupChat = async () => {
    //     const res = await chatService.getAllGroupChat();
    //     return res;
    // };

    // const {
    //     isLoading: isLoadingChatRoom,
    //     data: dataChatRoom,
    //     refetch: refetchChatRoom,
    // } = useQuery(['groupChat'], getAllGroupChat, {
    //     enabled: keySelected === 'groupChat',
    // });

    const renderPage = (key) => {
        switch (key) {
            case 'docterProflie':
                return <DoctorProfile />;
            case 'patient':
                return <PatientManagement />;
            // case 'posts':
            //     return <TablePosts isLoading={isLoadingPosts} data={dataPosts} refetch={refetchPosts} />;
            // case 'groupChat':
            //     return <TableGroup isLoading={isLoadingChatRoom} data={dataChatRoom} refetch={refetchChatRoom} />;
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

export default DoctorPage;
