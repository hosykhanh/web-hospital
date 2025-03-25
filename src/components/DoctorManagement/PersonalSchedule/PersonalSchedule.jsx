import { useState } from "react"
import classNames from "classnames/bind"
import { DatePicker, ConfigProvider } from "antd"
import locale from "antd/lib/locale/vi_VN"
import styles from "./PersonalSchedule.module.scss"
import { Calendar } from "lucide-react"

const cx = classNames.bind(styles)

export default function PersonalSchedule() {
  const [selectedDate, setSelectedDate] = useState(null)

  // Sample time slots with status
  const timeSlots = [
    { id: 1, time: "9:30 - 10:30", status: "empty" },
    { id: 2, time: "9:30 - 10:30", status: "appointment" },
    { id: 3, time: "9:30 - 10:30", status: "off" },
  ]

  const [selectedSlot, setSelectedSlot] = useState(null)

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const formatDate = (date) => {
    if (!date) return "Chọn ngày"
    return date.format("DD/MM/YYYY")
  }

  const handleSlotSelect = (id) => {
    setSelectedSlot(id)
  }

  // Get class name based on slot status
  const getSlotClassName = (status, isSelected) => {
    return cx("time-slot", {
      "time-slot-empty": status === "empty",
      "time-slot-appointment": status === "appointment",
      "time-slot-off": status === "off",
      selected: isSelected,
    })
  }

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>Lịch trình cá nhân</h2>
        <ConfigProvider locale={locale}>
          <DatePicker
            className={cx("ant-date-picker")}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
            suffixIcon={<Calendar className={cx("calendar-icon")} size={16} />}
            allowClear={false}
          />
        </ConfigProvider>
      </div>

      {/* Legend for schedule types */}
      <div className={cx("legend")}>
        <div className={cx("legend-item")}>
          <div className={cx("legend-color", "legend-empty")}></div>
          <span>Lịch trống</span>
        </div>
        <div className={cx("legend-item")}>
          <div className={cx("legend-color", "legend-appointment")}></div>
          <span>Lịch khám</span>
        </div>
        <div className={cx("legend-item")}>
          <div className={cx("legend-color", "legend-off")}></div>
          <span>Lịch nghỉ</span>
        </div>
      </div>

      <div className={cx("schedule-container")}>
        <div className={cx("time-slots")}>
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              className={getSlotClassName(slot.status, selectedSlot === slot.id)}
              onClick={() => handleSlotSelect(slot.id)}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

