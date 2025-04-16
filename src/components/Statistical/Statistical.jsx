import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, Users, UserRound, Calendar } from 'lucide-react';
import classNames from 'classnames/bind';
import styles from './Statistical.module.scss';
import * as dashboardService from '../../services/dashboardService';
const cx = classNames.bind(styles);

const Statistical = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [dataChart, setDataChart] = useState([]);
    const [chartTitle, setChartTitle] = useState('Thống kê bệnh nhân');
    const [years, setYears] = useState([]);
    const [currentCard, setCurrentCard] = useState('patient');

    const [patientStats, setPatientStats] = useState({ value: 0, percentage: 0, trend: '' });
    const [doctorStats, setDoctorStats] = useState({ value: 0, percentage: 0, trend: '' });
    const [medicalStats, setMedicalStats] = useState({ value: 0, percentage: 0, trend: '' });

    const [dataDashboard, setDataDashboard] = useState({
        doctor: [],
        patient: [],
        medical: [],
    });

    const loadAllDashboardData = async () => {
        const [doctorRes, patientRes, medicalRes] = await Promise.all([
            dashboardService.getDashboardDoctor(),
            dashboardService.getDashboardPatient(),
            dashboardService.getDashboardMedicalConsultationHistory(),
        ]);

        setDataDashboard({
            doctor: doctorRes.data,
            patient: patientRes.data,
            medical: medicalRes.data,
        });

        const defaultYear = selectedYear;
        const res = await dashboardService.getDashboardPatient({ year: defaultYear });
        setDataChart(res.data);
        setChartTitle('Thống kê bệnh nhân');
        setYears(patientRes.data.map((item) => item.year));
    };

    useEffect(() => {
        loadAllDashboardData();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchDataForYear = async () => {
            let res;
            switch (currentCard) {
                case 'doctor':
                    setChartTitle('Thống kê bác sĩ');
                    res = await dashboardService.getDashboardDoctor({ year: selectedYear });
                    break;
                case 'medical':
                    setChartTitle('Thống kê lịch khám');
                    res = await dashboardService.getDashboardMedicalConsultationHistory({ year: selectedYear });
                    break;
                default:
                    setChartTitle('Thống kê bệnh nhân');
                    res = await dashboardService.getDashboardPatient({ year: selectedYear });
            }
            setDataChart(res.data);
        };

        fetchDataForYear();
    }, [selectedYear, currentCard]);

    useEffect(() => {
        const fetchStats = async () => {
            const currentMonth = new Date().getMonth() + 1;
            // Hàm tính toán thống kê
            const getStatsInfo = (data) => {
                const current = data.find((item) => Number(item.month) === currentMonth)?.total || 0;
                let previous = 0;
                if (currentMonth === 1) {
                    previous = 0;
                } else {
                    previous = data.find((item) => Number(item.month) === currentMonth - 1)?.total || 0;
                }
                const diff = current - previous;
                const percentage =
                    previous === 0 ? (current === 0 ? 0 : 100) : Math.abs(Math.round((diff / previous) * 100));
                let trend = 'không đổi';
                if (diff > 0) trend = 'tăng so với tháng trước';
                else if (diff < 0) trend = 'giảm so với tháng trước';

                return { value: current, percentage, trend };
            };

            const [patientRes, doctorRes, medicalRes] = await Promise.all([
                dashboardService.getDashboardPatient({ year: selectedYear }),
                dashboardService.getDashboardDoctor({ year: selectedYear }),
                dashboardService.getDashboardMedicalConsultationHistory({ year: selectedYear }),
            ]);
            setPatientStats(getStatsInfo(patientRes.data));
            setDoctorStats(getStatsInfo(doctorRes.data));
            setMedicalStats(getStatsInfo(medicalRes.data));
        };

        fetchStats();
    }, [selectedYear]);

    const statsCards = [
        {
            title: 'Bệnh nhân',
            type: 'patient',
            total: dataDashboard.patient.reduce((acc, item) => acc + item.total, 0),
            icon: <Users size={24} />,
            value: patientStats.value,
            percentage: patientStats.percentage,
            trend: patientStats.trend,
        },
        {
            title: 'Bác sĩ',
            type: 'doctor',
            total: dataDashboard.doctor.reduce((acc, item) => acc + item.total, 0),
            icon: <UserRound size={24} />,
            value: doctorStats.value,
            percentage: doctorStats.percentage,
            trend: doctorStats.trend,
        },
        {
            title: 'Lịch khám',
            type: 'medical',
            total: dataDashboard.medical.reduce((acc, item) => acc + item.total, 0),
            icon: <Calendar size={24} />,
            value: medicalStats.value,
            percentage: medicalStats.percentage,
            trend: medicalStats.trend,
        },
    ];

    const handleCardClick = (type) => {
        setCurrentCard(type);
        setSelectedYear(selectedYear);
        const selectedData = dataDashboard[type];
        setYears(selectedData.map((item) => item.year));
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
        setShowYearDropdown(false);
    };

    return (
        <div className={cx('statistical-container')}>
            <div className={cx('stats-cards')}>
                {statsCards.map((card, index) => (
                    <div
                        key={index}
                        className={cx('stat-card', { active: currentCard === card.type })}
                        onClick={() => handleCardClick(card.type)}
                    >
                        <div className={cx('icon-container')}>{card.icon}</div>
                        <div className={cx('stat-content')}>
                            <div className={cx('stat-title')}>{card.title}</div>
                            <div className={cx('stat-value')}>
                                {card.value} / {card.total}
                            </div>
                            <div className={cx('stat-percentage')}>
                                {card.percentage}% {card.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={cx('chart-container')}>
                <div className={cx('chart-header')}>
                    <h2 className={cx('chart-title')}>{chartTitle}</h2>
                    <div className={cx('year-selector')}>
                        <button className={cx('year-button')} onClick={() => setShowYearDropdown(!showYearDropdown)}>
                            Năm {selectedYear} <ChevronDown size={16} />
                        </button>
                        {showYearDropdown && (
                            <div className={cx('year-dropdown')}>
                                {years.map((year) => (
                                    <div
                                        key={year}
                                        className={cx('year-option')}
                                        onClick={() => handleYearChange(year)}
                                    >
                                        {year}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={cx('chart')}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dataChart} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(month) => `Tháng ${month}`}
                            />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#4CAF50"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#4CAF50', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, fill: '#4CAF50', strokeWidth: 2, stroke: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Statistical;
