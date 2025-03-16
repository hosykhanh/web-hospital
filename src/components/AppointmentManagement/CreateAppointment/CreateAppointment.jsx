import { useState, useEffect } from 'react';
import styles from './CreateAppointment.module.scss';
import { districts, wards, getProvinces } from 'vietnam-provinces';
import { format } from 'date-fns';
import classNames from 'classnames/bind';
import CustomDatePicker from './custom-date-picke';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import TimeSlotPicker from './time-slot-picker';
import TableComp from '../../TableComp/TableComp';

const cx = classNames.bind(styles);

const CreateAppointment = ({ onBack }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        fullName: '',
        email: '',
        phone: '',
        provinceCode: '',
        districtCode: '',
        wardCode: '',
        address: '',
        service: '',
        specialtyPackage: '',
        date: '',
        session: '',
    });

    const [rowSelected, setRowSelected] = useState('');
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [provincesList, setProvincesList] = useState([]);
    const [districtsList, setDistrictsList] = useState([]);
    const [wardsList, setWardsList] = useState([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    // Load provinces on component mount
    useEffect(() => {
        const allProvinces = getProvinces();
        setProvincesList(allProvinces);
    }, []);

    // Load districts when province changes
    useEffect(() => {
        if (formData.provinceCode) {
            const filteredDistricts = districts.filter((district) => district.province_code === formData.provinceCode);
            setDistrictsList(filteredDistricts);
            // Reset district and ward when province changes
            setFormData((prev) => ({
                ...prev,
                districtCode: '',
                wardCode: '',
            }));
            setWardsList([]);
        }
    }, [formData.provinceCode]);

    // Load wards when district changes
    useEffect(() => {
        if (formData.districtCode) {
            const filteredWards = wards.filter((ward) => ward.district_code === formData.districtCode);
            setWardsList(filteredWards);
            // Reset ward when district changes
            setFormData((prev) => ({
                ...prev,
                wardCode: '',
            }));
        }
    }, [formData.districtCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Here you would typically send the data to your backend
    };

    const handlePatientSelect = () => {
        setIsPatientModalOpen(true)
        console.log('Select patient clicked');
    };

    const handleDateSelect = (date) => {
        setFormData((prev) => ({
            ...prev,
            date: format(date, 'yyyy-MM-dd'),
        }));
        setIsDatePickerOpen(false);
    };

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot);
        setFormData((prev) => ({
            ...prev,
            session: slot.id,
        }));
        setIsTimePickerOpen(false);
    };

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('add')}>Thêm</button>
            </div>
        );
    };

    const columns = [
        {
            title: 'Mã bệnh nhân',
            dataIndex: 'patient_id',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'patient_name',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'patient_dob',
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    const dataUser = {
        length: 7, // Độ dài của danh sách
        data: [
            {
                _id: 1,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 2,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 3,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 4,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 5,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 6,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 7,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
            {
                _id: 8,
                patient_id: '123456',
                patient_name: 'John Doe',
                patient_dob: '01/01/1970',
            },
        ],
    };

    return (
        <div className={cx('wrapper')}>
            <div>
                <button onClick={onBack} className={cx('back')}>
                    <ArrowLeftOutlined style={{ fontSize: '25px' }} />
                </button>
            </div>
            <div className={cx('formContainer')}>
                <div className={cx('formHeader')}>
                    <h2>Thêm lịch khám bệnh</h2>
                    <p>Vui lòng điền đầy đủ thông tin để thêm lịch khám</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <button type="button" className={cx('selectPatientBtn')} onClick={handlePatientSelect}>
                        Chọn bệnh nhân
                    </button>
                    <Modal
                    title={<div className={cx('title-patient')}>Chọn bệnh nhân </div>}
                        forceRender
                        open={isPatientModalOpen}
                        onCancel={() => setIsPatientModalOpen(false)}
                        footer={null}
                        width="50%"
                    >
                        <TableComp
                            columns={columns}
                            data={dataUser}
                            // isLoading={isLoadingUser}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setRowSelected(record._id);
                                    },
                                };
                            }}
                            // mutation={mutationDelMany}
                            // refetch={refetch}
                            defaultPageSize={8}
                        />
                    </Modal>
                    <div className={cx('formSection')}>
                        <h3>Thông tin bệnh nhân</h3>
                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Mã bệnh nhân</label>
                                <Input
                                    type="text"
                                    name="patientId"
                                    placeholder="Nhập mã bệnh nhân"
                                    value={formData.patientId}
                                    onChange={handleChange}
                                    className={cx('formInput')}
                                />
                            </div>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Họ tên</label>
                                <Input
                                    type="text"
                                    name="fullName"
                                    placeholder="Nhập họ tên"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={cx('formInput')}
                                />
                            </div>
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label>Email</label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Nhập email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={cx('formInput')}
                                />
                            </div>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Số điện thoại</label>
                                <Input
                                    type="tel"
                                    name="phone"
                                    placeholder="Nhập số điện thoại"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={cx('formInput')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={cx('formSection')}>
                        <h3>Địa chỉ</h3>
                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Tỉnh/Thành phố</label>
                                <select
                                    name="provinceCode"
                                    value={formData.provinceCode}
                                    onChange={handleChange}
                                    className={cx('formInput', 'formSelect')}
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provincesList.map((province) => (
                                        <option key={province.code} value={province.code}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Quận/Huyện</label>
                                <select
                                    name="districtCode"
                                    value={formData.districtCode}
                                    onChange={handleChange}
                                    className={cx('formInput', 'formSelect')}
                                    disabled={!formData.provinceCode}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districtsList.map((district) => (
                                        <option key={district.code} value={district.code}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label>Địa chỉ chi tiết</label>
                                <Input
                                    type="text"
                                    name="address"
                                    placeholder="Số nhà, tên đường"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={cx('formInput')}
                                />
                            </div>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Phường/Xã</label>
                                <select
                                    name="wardCode"
                                    value={formData.wardCode}
                                    onChange={handleChange}
                                    className={cx('formInput', 'formSelect')}
                                    disabled={!formData.districtCode}
                                >
                                    <option value="">Chọn phường/xã</option>
                                    {wardsList.map((ward) => (
                                        <option key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={cx('formSection')}>
                        <h3>Thông tin khám bệnh</h3>
                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Dịch vụ khám</label>
                                <select
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    className={cx('formInput', 'formSelect')}
                                >
                                    <option value="">Chọn dịch vụ khám</option>
                                    <option value="service1">Khám tổng quát</option>
                                    <option value="service2">Khám chuyên khoa</option>
                                    <option value="service3">Khám theo yêu cầu</option>
                                    <option value="service4">Tư vấn sức khỏe</option>
                                </select>
                            </div>
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Gói khám/ Chuyên khoa</label>
                                <select
                                    name="specialtyPackage"
                                    value={formData.specialtyPackage}
                                    onChange={handleChange}
                                    className={cx('formInput', 'formSelect')}
                                >
                                    <option value="">Chọn gói khám/ chuyên khoa</option>
                                    <option value="package1">Gói khám sức khỏe cơ bản</option>
                                    <option value="package2">Gói khám sức khỏe nâng cao</option>
                                    <option value="specialty1">Chuyên khoa Tim mạch</option>
                                    <option value="specialty2">Chuyên khoa Nội tiết</option>
                                    <option value="specialty3">Chuyên khoa Da liễu</option>
                                    <option value="specialty4">Chuyên khoa Nhi</option>
                                </select>
                            </div>
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Ngày khám</label>
                                <Input
                                    type="text"
                                    name="date"
                                    placeholder="Chọn ngày khám"
                                    value={formData.date ? format(new Date(formData.date), 'dd/MM/yyyy') : ''}
                                    onClick={() => setIsDatePickerOpen(true)}
                                    readOnly
                                    className={cx('formInput', 'dateInput')}
                                />
                                <CustomDatePicker
                                    isOpen={isDatePickerOpen}
                                    onClose={() => setIsDatePickerOpen(false)}
                                    onSelect={handleDateSelect}
                                    selectedDate={formData.date ? new Date(formData.date) : null}
                                />
                            </div>
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Ca khám</label>
                                <Input
                                    type="text"
                                    readOnly
                                    placeholder="Chọn ca khám"
                                    value={
                                        selectedTimeSlot ? `${selectedTimeSlot.start} - ${selectedTimeSlot.end}` : ''
                                    }
                                    onClick={() => setIsTimePickerOpen(true)}
                                    className={cx('formInput')}
                                />
                                <TimeSlotPicker
                                    isOpen={isTimePickerOpen}
                                    onClose={() => setIsTimePickerOpen(false)}
                                    onSelect={handleTimeSlotSelect}
                                    selectedSlot={selectedTimeSlot}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className={cx('submitBtn')}>
                        Xác nhận thêm lịch khám
                    </button>
                    <span className={cx('infoText')}>Lưu ý: Các trường đánh dấu (*) là bắt buộc</span>
                </form>
            </div>
        </div>
    );
};

export default CreateAppointment;
