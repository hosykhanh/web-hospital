import { useState } from 'react';
import { message } from 'antd';
import * as medicalService from '../../../services/medicalService';
import MedicalServiceForm from '../MedicalServiceForm/MedicalServiceForm';
import MedicalServiceList from '../MedicalServiceList/MedicalServiceList';
import classNames from 'classnames/bind';
import styles from './MedicalServiceManager.module.scss';

const cx = classNames.bind(styles);

const MedicalServiceManager = ({
    dataMedicalService,
    isLoadingMedicalService,
    rowSelectedClinic,
    refetchMedicalService,
}) => {
    const [isCreateMedicalService, setIsCreateMedicalService] = useState(false);
    const [isEditMedicalService, setIsEditMedicalService] = useState(false);

    const [serviceId, setServiceId] = useState(null);
    const [serviceName, setServiceName] = useState('');
    const [originalPrice, setOriginalPrice] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [type, setType] = useState(0);
    const [logo, setLogo] = useState(null);
    const [isLogo, setIsLogo] = useState(false);

    const [doctorIds, setDoctorIds] = useState([]);
    const [dataDoctorsMedicalService, setDataDoctorsMedicalService] = useState([]);

    const onClickBackMedicalService = () => {
        setIsEditMedicalService(false);
        setIsCreateMedicalService(false);
        setServiceId(null);
        setServiceName('');
        setOriginalPrice(0);
        setCurrentPrice(0);
        setType(0);
        setLogo(null);
        setIsLogo(false);
        setDoctorIds([]);
    };

    const onClickCreateMedicalService = (type) => {
        setIsCreateMedicalService(true);
        setType(type);
    };

    const handleOkCreateMedicalService = async () => {
        const data = {
            name: serviceName,
            originalPrice,
            currentPrice,
            type,
            clinicId: rowSelectedClinic,
            doctorIds,
        };
        try {
            await medicalService.createMedicalService(data);
            message.success('Thêm dịch vụ khám thành công!');
            setIsCreateMedicalService(false);
            refetchMedicalService();
            onClickBackMedicalService();
        } catch (error) {
            message.error('Thêm dịch vụ khám thất bại!');
        }
    };

    const onClickEditMedicalService = (id) => {
        const selectedItem = dataMedicalService?.find((item) => item._id === id);
        if (selectedItem) {
            setServiceId(selectedItem._id);
            setServiceName(selectedItem.name);
            setOriginalPrice(selectedItem.originalPrice);
            setCurrentPrice(selectedItem.currentPrice);
            setType(selectedItem.type);
            setLogo(selectedItem.logo);
            setIsLogo(true);
            setIsEditMedicalService(true);
            setDataDoctorsMedicalService(selectedItem.doctors);
            setDoctorIds(selectedItem.doctors.map((doctor) => doctor._id));
        }
    };

    const handleOkEditMedicalService = async () => {
        const data = {
            name: serviceName,
            originalPrice,
            currentPrice,
            type,
            clinicId: rowSelectedClinic,
            doctorIds,
        };
        try {
            await medicalService.updateMedicalService(serviceId, data);
            message.success('Cập nhật dịch vụ khám thành công!');
            setIsEditMedicalService(false);
            refetchMedicalService();
            onClickBackMedicalService();
        } catch (error) {
            message.error('Cập nhật dịch vụ khám thất bại!');
        }
    };

    const handleDeleteMedicalService = async () => {
        try {
            await medicalService.deleteMedicalService(serviceId);
            message.success('Xoá dịch vụ khám thành công!');
            setIsEditMedicalService(false);
            refetchMedicalService();
            onClickBackMedicalService();
        } catch (error) {
            message.error('Xoá dịch vụ khám thất bại!');
        }
    };

    if (isEditMedicalService) {
        return (
            <MedicalServiceForm
                title="Chỉnh sửa dịch vụ khám"
                onBack={onClickBackMedicalService}
                serviceName={serviceName}
                setServiceName={setServiceName}
                originalPrice={originalPrice}
                setOriginalPrice={setOriginalPrice}
                currentPrice={currentPrice}
                setCurrentPrice={setCurrentPrice}
                onSubmit={handleOkEditMedicalService}
                rowSelectedClinic={rowSelectedClinic}
                doctorIds={doctorIds}
                setDoctorIds={setDoctorIds}
                dataDoctors={dataDoctorsMedicalService}
                setDataDoctors={setDataDoctorsMedicalService}
                logo={logo}
                setLogo={setLogo}
                isLogo={isLogo}
                serviceId={serviceId}
                onDelete={handleDeleteMedicalService}
            />
        );
    }

    if (isCreateMedicalService) {
        return (
            <MedicalServiceForm
                title="Thêm mới dịch vụ khám"
                onBack={onClickBackMedicalService}
                serviceName={serviceName}
                setServiceName={setServiceName}
                originalPrice={originalPrice}
                setOriginalPrice={setOriginalPrice}
                currentPrice={currentPrice}
                setCurrentPrice={setCurrentPrice}
                onSubmit={handleOkCreateMedicalService}
                rowSelectedClinic={rowSelectedClinic}
                doctorIds={doctorIds}
                setDoctorIds={setDoctorIds}
                dataDoctors={dataDoctorsMedicalService}
                setDataDoctors={setDataDoctorsMedicalService}
            />
        );
    }

    return (
        <div className={cx('wrapper-medical-content')}>
            <MedicalServiceList
                title="Dịch vụ gói khám"
                type={1}
                data={dataMedicalService}
                isLoading={isLoadingMedicalService}
                onClickAdd={() => onClickCreateMedicalService(1)}
                onClickEdit={onClickEditMedicalService}
            />
            <MedicalServiceList
                title="Dịch vụ khám chuyên khoa"
                type={2}
                data={dataMedicalService}
                isLoading={isLoadingMedicalService}
                onClickAdd={() => onClickCreateMedicalService(2)}
                onClickEdit={onClickEditMedicalService}
            />
        </div>
    );
};

export default MedicalServiceManager;
