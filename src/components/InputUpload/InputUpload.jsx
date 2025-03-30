import { CloseOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './InputUpload.module.scss';

const cx = classNames.bind(styles);

function InputUpload({ avatar, onChange, name }) {
    const [imageUrl, setImageUrl] = useState('');
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Hình ảnh phải nhỏ hơn 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const [loading, setLoading] = useState(false);

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            const url = URL.createObjectURL(info.file.originFileObj);
            setImageUrl(url);
            onChange(info.file.originFileObj);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Tải lên
            </div>
        </div>
    );

    const customRequest = async ({ file, onSuccess, onError }) => {
        try {
            await onChange(file); // Call the function that handles API call
            onSuccess();
        } catch (error) {
            onError(error);
            message.error('Tải lên thất bại!');
        }
    };

    const handleRemove = () => {
        // Thêm logic để xử lý việc xóa ảnh
        setImageUrl('');
    };

    return (
        <div className={cx('frame-uploader')}>
            <CloseOutlined onClick={handleRemove} className={cx('remove-uploader')} />
            <div className={cx('container-uploader')}>
                <Upload
                    name="image"
                    showUploadList={false}
                    maxCount={1}
                    customRequest={customRequest}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    className={cx('content-uploader')}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="avatar"
                            style={{ width: 'auto', maxHeight: '300px', maxWidth: '100%' }}
                            name={name || ''}
                        />
                    ) : (
                        uploadButton
                    )}
                </Upload>
            </div>
        </div>
    );
}

export default InputUpload;
