import React from 'react';
import classNames from 'classnames/bind';

import styles from './DetailPatient.module.scss';
import { ArrowLeftOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const DetailPatient = ({ onBack }) => {
    return (
        <div>
            <div>
                <button onClick={onBack} className={cx('back')}><ArrowLeftOutlined style={{fontSize: "25px"}}/></button>
            </div>
            <div className={cx('title')}>Thông tin bệnh nhân</div>
        </div>
    );
};

export default DetailPatient;
