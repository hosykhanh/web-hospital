import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChevronDown, Users, UserRound, Calendar } from "lucide-react"
import classNames from "classnames/bind"
import styles from "./Statistical.module.scss"

const cx = classNames.bind(styles)

const Statistical = () => {
  const [selectedYear, setSelectedYear] = useState(2025)
  const [showYearDropdown, setShowYearDropdown] = useState(false)

  const years = [2023, 2024, 2025, 2026]

  const data = [
    { name: "Apr", value: 50 },
    { name: "May", value: 100 },
    { name: "Jun", value: 300 },
    { name: "Jul", value: 350 },
    { name: "Aug", value: 450 },
    { name: "Sep", value: 200 },
    { name: "Oct", value: 250 },
    { name: "Nov", value: 300 },
    { name: "Dec", value: 500 },
  ]

  const statsCards = [
    {
      title: "Bệnh nhân",
      value: 0,
      total: 99,
      icon: <Users size={24} />,
      percentage: 45,
      trend: "tăng tuần trước",
    },
    {
      title: "Bác sĩ",
      value: 0,
      total: 99,
      icon: <UserRound size={24} />,
      percentage: 25,
      trend: "tăng tuần trước",
    },
    {
      title: "Lịch khám",
      value: 0,
      total: 99,
      icon: <Calendar size={24} />,
      percentage: 40,
      trend: "tăng tuần trước",
    },
  ]

  const handleYearChange = (year) => {
    setSelectedYear(year)
    setShowYearDropdown(false)
  }

  return (
    <div className={cx("statistical-container")}>
      <div className={cx("stats-cards")}>
        {statsCards.map((card, index) => (
          <div key={index} className={cx("stat-card")}>
            <div className={cx("icon-container")}>{card.icon}</div>
            <div className={cx("stat-content")}>
              <div className={cx("stat-title")}>{card.title}</div>
              <div className={cx("stat-value")}>
                {card.value} / {card.total}
              </div>
              <div className={cx("stat-percentage")}>
                {card.percentage}% {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={cx("chart-container")}>
        <div className={cx("chart-header")}>
          <h2 className={cx("chart-title")}>Bệnh nhân</h2>
          <div className={cx("year-selector")}>
            <button className={cx("year-button")} onClick={() => setShowYearDropdown(!showYearDropdown)}>
              Năm {selectedYear} <ChevronDown size={16} />
            </button>
            {showYearDropdown && (
              <div className={cx("year-dropdown")}>
                {years.map((year) => (
                  <div key={year} className={cx("year-option")} onClick={() => handleYearChange(year)}>
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={cx("chart")}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4CAF50"
                strokeWidth={2}
                dot={{ r: 4, fill: "#4CAF50", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#4CAF50", strokeWidth: 2, stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Statistical

