import { X } from "lucide-react"
import styles from "./time-slot-picker.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

const AVAILABLE_SESSIONS = [
  {
    name: "Buổi sáng",
    slots: [
      { id: "morning1", start: "08:00", end: "09:00" },
      { id: "morning2", start: "09:00", end: "10:00" },
      { id: "morning3", start: "10:00", end: "11:00" },
    ],
  },
  {
    name: "Buổi chiều",
    slots: [
      { id: "afternoon1", start: "13:30", end: "14:30" },
      { id: "afternoon2", start: "14:30", end: "15:30" },
      { id: "afternoon3", start: "15:30", end: "16:30" },
    ],
  },
]

const TimeSlotPicker = ({ isOpen, onClose, onSelect, selectedSlot }) => {
  if (!isOpen) return null

  return (
    <div className={cx("modalOverlay")} onClick={onClose}>
      <div className={cx("modalContent")} onClick={(e) => e.stopPropagation()}>
        <div className={cx("modalHeader")}>
          <button className={cx("closeButton")} onClick={onClose}>
            <X size={20} />
          </button>
          <h2>Chọn giờ khám</h2>
        </div>

        <div className={cx("timeSlots")}>
          {AVAILABLE_SESSIONS.map((session) => (
            <div key={session.name} className={cx("sessionGroup")}>
              <h3>{session.name}</h3>
              <div className={cx("slotGrid")}>
                {session.slots.map((slot) => (
                  <button
                    key={slot.id}
                    className={cx("timeSlot", {
                      selected: selectedSlot?.id === slot.id,
                    })}
                    onClick={() => onSelect(slot)}
                  >
                    {slot.start} - {slot.end}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TimeSlotPicker

