import { useState } from 'react';
import { TimePicker, Button, Tag, message, Modal, DatePicker, Input } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Loading from '../../Loading/Loading';
import * as scheduleService from '../../../services/scheduleService';
import classNames from 'classnames/bind';
import styles from './ClinicScheduleManager.module.scss';
import convertISODateToLocalDate from '../../../utils/convertISODateToLocalDate';
import { useColumnSearch } from '../../../hooks/useColumnSearch';
import TableComp from '../../TableComp/TableComp';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

const ClinicScheduleManager = ({ rowSelectedClinic }) => {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isModalAddTimeOpen, setIsModalAddTimeOpen] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const [name, setName] = useState('');
    const [applyDate, setApplyDate] = useState(null);
    const [newValue, setNewValue] = useState([]);

    const getColumnSearchProps = useColumnSearch();

    const {
        data: dataTimeClinicSchedule,
        isLoading: isLoadingTimeClinicSchedule,
        refetch: refetchTimeClinicSchedule,
    } = useQuery(
        ['timeClinicSchedule', rowSelectedClinic],
        () => scheduleService.getClinicSchedule(rowSelectedClinic, { disableIsActiveFilter: 1 }),
        {
            enabled: !!rowSelectedClinic,
            select: (data) => data?.data,
        },
    );

    const {
        data: dataRequestChangeSchedule,
        isLoading: isLoadingRequestChangeSchedule,
        refetch: refetchRequestChangeSchedule,
    } = useQuery(
        ['requestChangeSchedule', rowSelectedClinic],
        () => scheduleService.getAllRequestChangeScheduleByClinic({ clinicId: rowSelectedClinic }),
        {
            enabled: !!rowSelectedClinic,
            select: (data) => data?.data,
        },
    );

    const handleChangeTimeClinicSchedule = (value) => {
        if (value) {
            setStartTime(value[0]);
            setEndTime(value[1]);
        } else {
            setStartTime(null);
            setEndTime(null);
        }
    };

    const handleOkCreateScheduleWorking = async () => {
        if (!startTime || !endTime) {
            message.warning('Vui lòng chọn thời gian làm việc!');
            return;
        }

        const data = {
            startTime: startTime.format('HH:mm:ss'),
            endTime: endTime.format('HH:mm:ss'),
            clinicId: rowSelectedClinic,
            isActive: false,
        };

        try {
            await scheduleService.createClinicSchedule(data);
            message.success('Thêm thời gian làm việc thành công!');
            refetchTimeClinicSchedule();
            setStartTime(null);
            setEndTime(null);
        } catch (error) {
            message.error('Thêm thời gian làm việc thất bại!');
        }
    };

    const handleToggleTime = (timeItem) => {
        const isSelected = newValue.some((t) => t._id === timeItem._id);

        if (isSelected) {
            setNewValue((prev) => prev.filter((t) => t._id !== timeItem._id));
        } else {
            setNewValue((prev) => [...prev, timeItem]);
        }
    };

    const onClickViewDetail = async (record) => {
        const detail = await scheduleService.getRequestChangeSchedule(record._id);
        setNewValue(detail.data.newValue || []);
        setIsEditMode(true);
        setEditingRecord(record);
        setName(record.name);
        setApplyDate(dayjs(record.applyDate));
        setIsCreateModalOpen(true);
    };

    const handleOkCreateTimeChangeSchedule = async () => {
        if (!name || !applyDate || newValue.length === 0) {
            message.warning('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const data = {
            name,
            applyDate: applyDate.format('YYYY-MM-DD'),
            newValue: newValue.map((t) => t._id),
            clinicId: rowSelectedClinic,
        };

        try {
            await scheduleService.createRequestChangeSchedule(data);
            message.success(
                'Tạo lịch chỉnh sửa thành công! Lịch sẽ được áp dụng từ ngày ' + applyDate.format('DD/MM/YYYY'),
            );
            refetchRequestChangeSchedule();
            setIsCreateModalOpen(false);
            setName('');
            setApplyDate(null);
            setNewValue([]);
        } catch (error) {
            message.error('Tạo lịch chỉnh sửa thất bại!');
        }
    };

    const handleUpdateTimeChangeSchedule = async (id) => {
        if (!name || !applyDate || newValue.length === 0) {
            message.warning('Vui lòng điền đày đủ thông tin!');
            return;
        }

        const data = {
            name,
            applyDate: applyDate.format('YYYY-MM-DD'),
            newValue: newValue.map((t) => t._id),
            clinicId: rowSelectedClinic,
        };

        try {
            await scheduleService.updateRequestChangeSchedule(id, data);
            message.success(
                'Cập nhật lịch chỉnh sửa thành công! Lịch sẽ được áp dụng từ ngày ' + applyDate.format('DD/MM/YYYY'),
            );
            refetchRequestChangeSchedule();
            setIsCreateModalOpen(false);
            setName('');
            setApplyDate(null);
            setNewValue([]);
        } catch (error) {
            message.error('Cập nhật lịch chỉnh sửa thất bại!');
        }
    };

    const handleDeleteRequestChangeSchedule = async () => {
        try {
            await scheduleService.deleteRequestChangeSchedule(editingRecord._id);
            message.success('Xoá lịch chỉnh sửa thời gian làm việc thành công!');
            refetchRequestChangeSchedule();
            setIsCreateModalOpen(false);
            setName('');
            setApplyDate(null);
            setNewValue([]);
        } catch (error) {
            message.error('Xoá lịch chỉnh sửa thời gian làm việc thất bại!');
        }
    };

    const renderAction = (text, record) => {
        return (
            <div className={cx('action')}>
                <button className={cx('view')} onClick={() => onClickViewDetail(record)}>
                    Chi tiết
                </button>

                <DeleteOutlined
                    style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
                    onClick={() => setIsModalDelete(true)}
                />
            </div>
        );
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ngày áp dụng',
            dataIndex: 'applyDate',
            render: (text, record) => convertISODateToLocalDate(record.applyDate),
            ...getColumnSearchProps('applyDate'),
            sorter: (a, b) => new Date(a.applyDate) - new Date(b.applyDate),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            render: (text, record) => convertISODateToLocalDate(record.createdAt),
            ...getColumnSearchProps('createdAt'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    return (
        <div className={cx('content-modal-time')}>
            <div className={cx('wrapper-title-btn-add')}>
                <div className={cx('title-time')}>Quản lý lịch làm việc</div>
                <Button
                    onClick={() => {
                        setIsEditMode(false);
                        setEditingRecord(null);
                        setName('');
                        setApplyDate(null);
                        setNewValue([]);
                        setIsCreateModalOpen(true);
                    }}
                    className={cx('btn-add')}
                >
                    <PlusOutlined />
                    Tạo lịch chỉnh sửa
                </Button>
            </div>
            <Modal
                title={
                    <div className={cx('title-modal')}>
                        {isEditMode ? 'Chỉnh sửa lịch làm việc' : 'Tạo lịch làm việc'}
                    </div>
                }
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
                width="45%"
            >
                <div>
                    <div className={cx('form-label')}>
                        <label htmlFor="name">Tên nội dung yêu cầu chỉnh sửa</label>
                        <Input
                            value={name}
                            className={cx('input')}
                            required
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên nội dung yêu cầu"
                        />
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="applyDate">Ngày áp dụng (Chọn ngày áp dụng sau ít nhất 30 ngày)</label>
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={applyDate}
                            onChange={(date) => setApplyDate(date)}
                            disabledDate={(current) => {
                                return current && current < dayjs().add(30, 'days').startOf('day');
                            }}
                        />
                    </div>
                    <div className={cx('form-label')}>
                        <label htmlFor="">Chọn lịch làm việc</label>
                        <button className={cx('btn-add-schedule')} onClick={() => setIsModalAddTimeOpen(true)}>
                            Chọn lịch làm việc
                        </button>
                        <div className={cx('list-time')}>
                            {newValue?.map((time, index) => (
                                <Tag
                                    key={index}
                                    color="green"
                                    style={{
                                        marginRight: 5,
                                        marginTop: 5,
                                        fontSize: 14,
                                    }}
                                >
                                    {time?.startTime} - {time?.endTime}{' '}
                                </Tag>
                            ))}
                        </div>
                        <Modal
                            title={<div className={cx('title-modal')}>Chọn lịch làm việc</div>}
                            open={isModalAddTimeOpen}
                            onOk={() => setIsModalAddTimeOpen(false)}
                            onCancel={() => setIsModalAddTimeOpen(false)}
                            width="45%"
                        >
                            <div>
                                <div className={cx('modal-node')}>
                                    Vui lòng chọn lịch làm việc có sẵn hoặc thêm lịch làm việc mới!
                                </div>
                                <div style={{ marginBottom: 10 }}>
                                    <Loading isLoading={isLoadingTimeClinicSchedule}>
                                        {dataTimeClinicSchedule?.map((time) => {
                                            const isSelected = newValue.some((t) => t._id === time._id);

                                            return (
                                                <Tag
                                                    key={time?._id}
                                                    color={isSelected ? 'green' : 'blue'}
                                                    style={{
                                                        marginRight: 5,
                                                        marginTop: 5,
                                                        fontSize: 14,
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => handleToggleTime(time)}
                                                >
                                                    {time?.startTime} - {time?.endTime}
                                                </Tag>
                                            );
                                        })}
                                    </Loading>
                                </div>
                                <div className={cx('title-time')}>Thêm lịch làm việc</div>
                                <div className={cx('form-label')}>
                                    <label htmlFor="time">Thời gian làm việc</label>
                                    <TimePicker.RangePicker
                                        className={cx('input')}
                                        required
                                        value={startTime && endTime ? [startTime, endTime] : []}
                                        format="HH:mm:ss"
                                        onChange={handleChangeTimeClinicSchedule}
                                    />
                                </div>
                                <div>
                                    <Button className={cx('btn-add-time')} onClick={handleOkCreateScheduleWorking}>
                                        Thêm
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                    <div>
                        <button
                            className={cx('btn-save-schedule')}
                            onClick={() => {
                                if (isEditMode) {
                                    handleUpdateTimeChangeSchedule(editingRecord._id);
                                } else {
                                    handleOkCreateTimeChangeSchedule();
                                }
                            }}
                        >
                            {isEditMode ? 'Lưu chỉnh sửa' : 'Xác nhận tạo lịch chỉnh sửa'}
                        </button>
                    </div>
                </div>
            </Modal>
            <TableComp
                columns={columns}
                data={dataRequestChangeSchedule}
                isLoading={isLoadingRequestChangeSchedule}
                // mutation={mutationDelMany}
                refetch={refetchRequestChangeSchedule}
                defaultPageSize={10}
            />
            <Modal
                title="Bạn có chắc muốn xóa lịch chỉnh sửa thời gian làm việc này?"
                open={isModalDelete}
                onOk={handleDeleteRequestChangeSchedule}
                onCancel={() => setIsModalDelete(false)}
                okButtonProps={{ style: { backgroundColor: '#ff4d4f' } }}
            />
        </div>
    );
};

export default ClinicScheduleManager;
