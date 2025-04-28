import { Button } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import Loading from '../../Loading/Loading';
import classNames from 'classnames/bind';
import styles from './MedicalServiceList.module.scss';

const cx = classNames.bind(styles);

const MedicalServiceList = ({ title, type, data, isLoading, onClickAdd, onClickEdit }) => {
    return (
        <>
            <div className={cx('wrapper-btn-add')}>
                <div className={cx('title-service')}>{title}</div>
                <Button onClick={onClickAdd} className={cx('btn-add')}>
                    <PlusOutlined />
                    Thêm mới
                </Button>
            </div>
            <div className={cx('modal-medical-content')}>
                <Loading isLoading={isLoading}>
                    <div className={cx('modal-list')}>
                        {data
                            ?.filter((s) => s.type === type)
                            .map((service) => (
                                <div key={service._id} className={cx('modal-item')}>
                                    <div className={cx('modal-item-left')}>
                                        <div className={cx('modal-item-name')}>{service.name}</div>
                                        <div className={cx('modal-item-price')}>
                                            Giá gốc: {service.originalPrice} VNĐ
                                        </div>
                                        <div className={cx('modal-item-price')}>
                                            Giá hiện tại: {service.currentPrice} VNĐ
                                        </div>
                                    </div>
                                    <EyeOutlined
                                        className={cx('modal-item-icon')}
                                        onClick={() => onClickEdit(service._id)}
                                    />
                                </div>
                            ))}
                    </div>
                </Loading>
            </div>
        </>
    );
};

export default MedicalServiceList;
