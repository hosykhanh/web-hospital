import { Input, InputNumber, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './MedicalServiceForm.module.scss';

const cx = classNames.bind(styles);

const MedicalServiceForm = ({
    title,
    onBack,
    serviceName,
    setServiceName,
    originalPrice,
    setOriginalPrice,
    currentPrice,
    setCurrentPrice,
    onSubmit,
}) => {
    return (
        <>
            <div>
                <button onClick={onBack} className={cx('back-medical-service')} style={{ backgroundColor: '#ffffff' }}>
                    <ArrowLeftOutlined style={{ fontSize: '20px' }} />
                </button>
            </div>
            <div className={cx('edit-medical-service-text')}>{title}</div>
            <div className={cx('modal-edit')}>
                <div className={cx('modal-edit-item')}>
                    <label htmlFor="name">Tên dịch vụ khám</label>
                    <Input
                        className={cx('input')}
                        id="name"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="Nhập tên dịch vụ"
                    />
                </div>
                <div className={cx('modal-edit-item')}>
                    <label>Giá gốc</label>
                    <InputNumber
                        addonAfter="VND"
                        parser={(value) => value.replace(/[^\d]/g, '')}
                        value={originalPrice}
                        onChange={(val) => setOriginalPrice(val)}
                        style={{ width: '50%' }}
                    />
                </div>
                <div className={cx('modal-edit-item')}>
                    <label>Giá hiện tại</label>
                    <InputNumber
                        addonAfter="VND"
                        parser={(value) => value.replace(/[^\d]/g, '')}
                        value={currentPrice}
                        onChange={(val) => setCurrentPrice(val)}
                        style={{ width: '50%' }}
                    />
                </div>
            </div>
            <div className={cx('wrapper-btn')}>
                <Button className={cx('btn-save')} type="primary" onClick={onSubmit}>
                    Lưu
                </Button>
            </div>
        </>
    );
};

export default MedicalServiceForm;
