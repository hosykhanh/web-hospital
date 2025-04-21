import { useState, useEffect } from 'react';
import styles from './CreateAppointment.module.scss';
import { districts, wards, getProvinces } from 'vietnam-provinces';
import { format } from 'date-fns';
import classNames from 'classnames/bind';
import CustomDatePicker from './custom-date-picke';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Input, message, Modal } from 'antd';
import TimeSlotPicker from './time-slot-picker';
import TableComp from '../../TableComp/TableComp';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import * as medicalService from '../../../services/medicalService';
import * as scheduleService from '../../../services/scheduleService';
import * as clinicService from '../../../services/clinicService';
import * as patientService from '../../../services/patientService';
import * as doctorService from '../../../services/doctorService';
import convertISODateToLocalDate from '../../../utils/convertISODateToLocalDate';

const cx = classNames.bind(styles);

const CreateAppointment = ({ onBack, refetch }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        patientEmail: '',
        patientPhoneNumber: '',
        patientProvince: '',
        patientDistrict: '',
        patientCommune: '',
        patientAddress: '',
        medicalServiceName: '',
        examinationDate: '',
        clinicId: '',
        clinicScheduleId: '',
        patientDateOfBirth: '',
        patientGender: '',
        medicalFee: 0,
        paymentMethod: 0,
        examinationReason: '',
        responsibilityDoctorId: '',
    });
    const [patientCode, setPatientCode] = useState('');

    const user = useSelector((state) => state.user);
    const [rowSelected, setRowSelected] = useState('');
    const [rowSelectedDoctor, setRowSelectedDoctor] = useState('');

    const [doctorCode, setDoctorCode] = useState('');
    const [doctorName, setDoctorName] = useState('');

    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [provincesList, setProvincesList] = useState([]);
    const [districtsList, setDistrictsList] = useState([]);
    const [wardsList, setWardsList] = useState([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    const [clinicId, setClinicId] = useState('');

    useEffect(() => {
        if (user?.role === 2) {
            setClinicId(user?.clinicId);
            setFormData((prev) => ({
                ...prev,
                clinicId: user?.clinicId,
                responsibilityDoctorId: user?.id,
            }));
        }
    }, [user]);

    // --- API GET ALL CLINICS ---
    const { data: dataClinics } = useQuery(['clinics'], () => clinicService.getAllClinics(), {
        enabled: !!user?.id,
        select: (data) => data?.data?.items,
    });

    // --- API GET ALL MEDICAL SERVICE BY CLINIC ID ---
    const { data: dataMedicalService } = useQuery(
        ['medicalService', clinicId],
        () => medicalService.getAllMedicalService(clinicId),
        {
            enabled: !!clinicId,
            select: (data) => data?.data?.items,
        },
    );

    // --- API GET CLINIC SCHEDULE ---
    const { data: dataClinicSchedule } = useQuery(
        ['leaveSchedule'],
        () => scheduleService.getClinicSchedule(clinicId),
        {
            enabled: !!clinicId,
            select: (data) => data?.data || [],
        },
    );

    // --- API GET ALL PATIENTS ---
    const getAllPatients = async () => {
        if (user.role === 2) {
            const res = await patientService.getAllPatientsByDoctorId(user?.id, true);
            return res.data.items;
        } else {
            const res = await patientService.getAllPatients();
            return res.data.items;
        }
    };

    const {
        isLoading: isLoadingPatients,
        data: dataPatients,
        refetch: refetchPatients,
    } = useQuery(['patients'], getAllPatients, {
        enabled: !!user?.id,
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
        enabled: !!user?.id,
    });

    // Load provinces on component mount
    useEffect(() => {
        const allProvinces = getProvinces();
        setProvincesList(allProvinces);
    }, []);

    // Load districts when province changes
    useEffect(() => {
        if (formData.patientProvince) {
            const filteredDistricts = districts.filter(
                (district) => district.province_name === formData.patientProvince,
            );
            setDistrictsList(filteredDistricts);
            setWardsList([]);
        }
    }, [formData.patientProvince]);

    // Load wards when district changes
    useEffect(() => {
        if (formData.patientDistrict) {
            const filteredWards = wards.filter((ward) => ward.district_name === formData.patientDistrict);
            setWardsList(filteredWards);
        }
    }, [formData.patientDistrict]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChangeClinic = (e) => {
        setClinicId(e.target.value);
        setFormData((prev) => ({
            ...prev,
            clinicId: e.target.value,
        }));
    };

    const handleChangeMedicalService = (e) => {
        const { name, value } = e.target;
        const selectedItem = dataMedicalService?.find((item) => item._id === value);
        setFormData((prevState) => ({
            ...prevState,
            [name]: selectedItem?.name,
            medicalFee: selectedItem?.currentPrice,
        }));
    };

    const handleDateSelect = (date) => {
        setFormData((prev) => ({
            ...prev,
            examinationDate: format(date, 'yyyy-MM-dd'),
        }));
        setIsDatePickerOpen(false);
    };

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot);
        setFormData((prev) => ({
            ...prev,
            clinicScheduleId: slot._id,
        }));
        setIsTimePickerOpen(false);
    };

    const labelMap = {
        patientId: 'Mã bệnh nhân',
        patientName: 'Tên bệnh nhân',
        patientEmail: 'Email',
        patientPhoneNumber: 'Số điện thoại',
        patientProvince: 'Tỉnh/Thành phố',
        patientDistrict: 'Quận/Huyện',
        patientCommune: 'Phường/Xã',
        patientAddress: 'Địa chỉ',
        medicalServiceName: 'Dịch vụ khám',
        examinationDate: 'Ngày khám',
        clinicId: 'Phòng khám',
        clinicScheduleId: 'Lịch khám',
        patientDateOfBirth: 'Ngày sinh',
        patientGender: 'Giới tính',
        medicalFee: 'Phí khám',
        paymentMethod: 'Phương thức thanh toán',
        examinationReason: 'Lý do khám',
        responsibilityDoctorId: 'Bác sĩ phụ trách',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emptyFields = Object.entries(formData).filter(
            ([key, value]) =>
                value === '' ||
                value === null ||
                value === undefined ||
                (typeof value === 'string' && value.trim() === ''),
        );

        if (emptyFields.length > 0) {
            const missingLabels = emptyFields.map(([key]) => labelMap[key] || key);
            message.error(`Vui lòng điền đầy đủ thông tin: ${missingLabels.join(', ')}`);
            return;
        }

        const res = await patientService.createMedicalConsultationHistory(formData);
        if (res.statusCode === 200) {
            message.success('Thêm lịch khám thành công!');
            onBack();
            refetch();
        } else {
            message.error('Thêm lịch khám thất bại!', res.message);
        }
    };

    useEffect(() => {
        if (rowSelected) {
            const selectedPatient = dataPatients?.find((patient) => patient._id === rowSelected);
            if (selectedPatient) {
                setFormData((prev) => ({
                    ...prev,
                    patientId: selectedPatient._id,
                    patientName: selectedPatient.userName,
                    patientEmail: selectedPatient.email,
                    patientPhoneNumber: selectedPatient.phoneNumber,
                    patientProvince: selectedPatient.province,
                    patientDistrict: selectedPatient.district,
                    patientCommune: selectedPatient.commune,
                    patientAddress: selectedPatient.address,
                    patientDateOfBirth: selectedPatient.dateOfBirth,
                    patientGender: selectedPatient.gender,
                }));
                setPatientCode(selectedPatient.code);
            }
        }
    }, [rowSelected, dataPatients]);

    useEffect(() => {
        if (rowSelectedDoctor) {
            const selectedDoctor = dataDoctors?.find((doctor) => doctor._id === rowSelectedDoctor);
            if (selectedDoctor) {
                setDoctorCode(selectedDoctor.code);
                setDoctorName(selectedDoctor.userName);
                setFormData((prev) => ({
                    ...prev,
                    responsibilityDoctorId: selectedDoctor._id,
                }));
            }
        }
    }, [rowSelectedDoctor, dataDoctors]);

    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('add')} onClick={() => setIsPatientModalOpen(false)}>
                    Thêm
                </button>
            </div>
        );
    };

    const renderActionDoctor = () => {
        return (
            <div className={cx('action')}>
                <button className={cx('add')} onClick={() => setIsDoctorModalOpen(false)}>
                    Thêm
                </button>
            </div>
        );
    };

    const columnsPatients = [
        {
            title: 'Mã bệnh nhân',
            dataIndex: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'userName',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            render: (text, record) => convertISODateToLocalDate(record.dateOfBirth),
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    const columnsDoctors = [
        {
            title: 'Mã bác sĩ',
            dataIndex: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'userName',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            render: (text, record) => convertISODateToLocalDate(record.dateOfBirth),
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderActionDoctor,
        },
    ];

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
                <form>
                    <button
                        type="button"
                        className={cx('selectPatientBtn')}
                        onClick={() => setIsPatientModalOpen(true)}
                    >
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
                            columns={columnsPatients}
                            data={dataPatients}
                            isLoading={isLoadingPatients}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setRowSelected(record._id);
                                    },
                                };
                            }}
                            // mutation={mutationDelMany}
                            refetch={refetchPatients}
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
                                    placeholder="Mã bệnh nhân"
                                    value={patientCode}
                                    disabled={true}
                                    className={cx('formInput')}
                                />
                            </div>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Họ tên</label>
                                <Input
                                    type="text"
                                    name="patientName"
                                    placeholder="Nhập họ tên"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    className={cx('formInput')}
                                />
                            </div>
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Email</label>
                                <Input
                                    type="email"
                                    name="patientEmail"
                                    placeholder="Nhập email"
                                    value={formData.patientEmail}
                                    onChange={handleChange}
                                    className={cx('formInput')}
                                />
                            </div>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Số điện thoại</label>
                                <Input
                                    type="tel"
                                    name="patientPhoneNumber"
                                    placeholder="Nhập số điện thoại"
                                    value={formData.patientPhoneNumber}
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
                                    name="patientProvince"
                                    value={formData.patientProvince}
                                    onChange={handleChange}
                                    className={cx('formInput', 'formSelect')}
                                >
                                    {formData.patientProvince ? (
                                        <option value={formData.patientProvince}>{formData.patientProvince}</option>
                                    ) : (
                                        <option value="">Chọn tỉnh/thành phố</option>
                                    )}
                                    {provincesList.map((province) => (
                                        <option key={province.code} value={province.name}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Quận/Huyện</label>
                                <select
                                    name="patientDistrict"
                                    value={formData.patientDistrict}
                                    onChange={handleChange}
                                    className={cx('formInput', 'formSelect')}
                                    disabled={!formData.patientProvince}
                                >
                                    {formData.patientDistrict ? (
                                        <option value={formData.patientDistrict}>{formData.patientDistrict}</option>
                                    ) : (
                                        <option value="">Chọn quận/huyện</option>
                                    )}
                                    {districtsList.map((district) => (
                                        <option key={district.code} value={district.name}>
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
                                    name="patientAddress"
                                    placeholder="Số nhà, tên đường"
                                    value={formData.patientAddress}
                                    onChange={handleChange}
                                    className={cx('formInput')}
                                />
                            </div>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Phường/Xã</label>
                                <select
                                    name="patientCommune"
                                    value={formData.patientCommune}
                                    onChange={handleChange}
                                    className={cx('formInput', 'formSelect')}
                                    disabled={!formData.patientDistrict}
                                >
                                    {formData.patientCommune ? (
                                        <option value={formData.patientCommune}>{formData.patientCommune}</option>
                                    ) : (
                                        <option value="">Chọn phường/xã</option>
                                    )}
                                    {wardsList.map((ward) => (
                                        <option key={ward.code} value={ward.name}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={cx('formSection')}>
                        <h3>Thông tin khám bệnh</h3>
                        {user?.role === 2 || user?.role === 1 ? (
                            <></>
                        ) : (
                            <div className={cx('formRow')}>
                                <div className={cx('formGroup')}>
                                    <label className={cx('requiredField')}>Phòng khám</label>
                                    <select
                                        name="clinic"
                                        onChange={handleChangeClinic}
                                        className={cx('formInput', 'formSelect')}
                                    >
                                        <option value={''}>Chọn phòng khám</option>
                                        {dataClinics?.map((service) => (
                                            <option key={service._id} value={service._id}>
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Dịch vụ khám</label>
                                <select
                                    name="medicalServiceName"
                                    onChange={handleChangeMedicalService}
                                    className={cx('formInput', 'formSelect')}
                                >
                                    <option value={''}>Chọn dịch vụ khám</option>
                                    {dataMedicalService?.map((service) => (
                                        <option key={service._id} value={service._id}>
                                            {`${service.name} ${
                                                service.originalPrice
                                                    ? '- Giá gốc:' + service.originalPrice + ' VND'
                                                    : ''
                                            } → Giá hiện tại: ${service.currentPrice} VND`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {user?.role === 2 || user?.role === 1 ? (
                            <></>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className={cx('selectPatientBtn')}
                                    onClick={() => setIsDoctorModalOpen(true)}
                                >
                                    Chọn bác sĩ
                                </button>
                                <Modal
                                    title={<div className={cx('title-patient')}>Chọn bác sĩ </div>}
                                    forceRender
                                    open={isDoctorModalOpen}
                                    onCancel={() => setIsDoctorModalOpen(false)}
                                    footer={null}
                                    width="50%"
                                >
                                    <TableComp
                                        columns={columnsDoctors}
                                        data={dataDoctors}
                                        isLoading={isLoadingDoctors}
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onClick: (event) => {
                                                    setRowSelectedDoctor(record._id);
                                                },
                                            };
                                        }}
                                        // mutation={mutationDelMany}
                                        refetch={refetchDoctors}
                                        defaultPageSize={8}
                                    />
                                </Modal>
                                {rowSelectedDoctor ? (
                                    <>
                                        <div className={cx('formRow')}>
                                            <div className={cx('formGroup')}>
                                                <label>Mã bác sĩ</label>
                                                <Input
                                                    type="text"
                                                    name="responsibilityDoctorId"
                                                    placeholder="Mã bác sĩ"
                                                    value={doctorCode}
                                                    disabled={true}
                                                    className={cx('formInput')}
                                                />
                                            </div>
                                            <div className={cx('formGroup')}>
                                                <label>Họ tên bác sĩ</label>
                                                <Input
                                                    type="text"
                                                    placeholder="Họ tên bác sĩ"
                                                    value={doctorName}
                                                    disabled={true}
                                                    className={cx('formInput')}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Thanh toán bằng</label>
                                <select
                                    type="number"
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className={cx('formInput', 'formSelect')}
                                >
                                    <option value={0}>Chọn phương thức thanh toán</option>
                                    <option value={1}>Tiền mặt</option>
                                </select>
                            </div>
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Ngày khám</label>
                                <Input
                                    type="text"
                                    name="examinationDate"
                                    placeholder="Chọn ngày khám"
                                    value={
                                        formData.examinationDate
                                            ? format(new Date(formData.examinationDate), 'dd/MM/yyyy')
                                            : ''
                                    }
                                    onClick={() => setIsDatePickerOpen(true)}
                                    readOnly
                                    className={cx('formInput', 'dateInput')}
                                />
                                <CustomDatePicker
                                    isOpen={isDatePickerOpen}
                                    onClose={() => setIsDatePickerOpen(false)}
                                    onSelect={handleDateSelect}
                                    selectedDate={formData.examinationDate ? new Date(formData.examinationDate) : null}
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
                                        selectedTimeSlot
                                            ? `${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}`
                                            : ''
                                    }
                                    onClick={() => setIsTimePickerOpen(true)}
                                    className={cx('formInput')}
                                />
                                <TimeSlotPicker
                                    isOpen={isTimePickerOpen}
                                    onClose={() => setIsTimePickerOpen(false)}
                                    onSelect={handleTimeSlotSelect}
                                    selectedSlot={selectedTimeSlot}
                                    dataClinicSchedule={dataClinicSchedule}
                                />
                            </div>
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label className={cx('requiredField')}>Lý do khám</label>
                                <Input.TextArea
                                    name="examinationReason"
                                    placeholder="Nhập lý do khám"
                                    value={formData.examinationReason}
                                    onChange={handleChange}
                                    className={cx('formInput')}
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className={cx('submitBtn')} onClick={handleSubmit}>
                        Xác nhận thêm lịch khám
                    </button>
                    <span className={cx('infoText')}>Lưu ý: Các trường đánh dấu (*) là bắt buộc</span>
                </form>
            </div>
        </div>
    );
};

export default CreateAppointment;
