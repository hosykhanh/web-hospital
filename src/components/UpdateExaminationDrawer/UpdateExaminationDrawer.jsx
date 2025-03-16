import { useEffect } from "react"
import { Drawer, Form, Input, DatePicker, Select, Button } from "antd"
import { SaveOutlined, CalendarOutlined, UserOutlined, MedicineBoxOutlined } from "@ant-design/icons"
import classNames from "classnames/bind"
import styles from "./UpdateExaminationDrawer.module.scss"

const { TextArea } = Input
const { Option } = Select
const cx = classNames.bind(styles)

const UpdateExaminationDrawer = ({ visible, setIsOpenDrawer, record, onUpdate }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (record && visible) {
      form.setFieldsValue({
        ...record,
        examinationDate: record.examinationDate ? new Date(record.examinationDate) : null,
        followUpDate: record.followUpDate ? new Date(record.followUpDate) : null,
      })
    }
  }, [record, visible, form])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onUpdate(values)
      setIsOpenDrawer(false)
    })
  }

  return (
    <Drawer
      title="Lịch sử khám bệnh"
      placement="right"
      onClose={() => setIsOpenDrawer(false)}
      open={visible}
      width={520}
      footer={
        <div className={cx("drawer-footer")}>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit} className={cx("save-button")}>
            Lưu
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" className={cx("examination-form")}>
        <div className={cx("form-title")}>
          <h3>Lịch sử khám bệnh</h3>
        </div>

        <Form.Item
          name="examinationDate"
          label="Ngày khám"
          rules={[{ required: true, message: "Vui lòng chọn ngày khám!" }]}
          className={cx("form-item")}
        >
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Chọn ngày khám"
            className={cx("date-picker")}
            suffixIcon={<CalendarOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="service"
          label="Dịch vụ khám"
          rules={[{ required: true, message: "Vui lòng chọn dịch vụ khám!" }]}
          className={cx("form-item")}
        >
          <Select placeholder="Chọn dịch vụ khám" suffixIcon={<MedicineBoxOutlined />}>
            <Option value="general">Khám tổng quát</Option>
            <Option value="specialist">Khám chuyên khoa</Option>
            <Option value="emergency">Khám cấp cứu</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="doctor"
          label="Bác sĩ phụ trách"
          rules={[{ required: true, message: "Vui lòng chọn bác sĩ phụ trách!" }]}
          className={cx("form-item")}
        >
          <Select placeholder="Chọn bác sĩ phụ trách" suffixIcon={<UserOutlined />}>
            <Option value="dr1">Bác sĩ Nguyễn Văn A</Option>
            <Option value="dr2">Bác sĩ Trần Thị B</Option>
            <Option value="dr3">Bác sĩ Lê Văn C</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Tình trạng"
          rules={[{ required: true, message: "Vui lòng chọn tình trạng!" }]}
          className={cx("form-item")}
        >
          <Select placeholder="Chọn tình trạng">
            <Option value="normal">Bình thường</Option>
            <Option value="monitoring">Cần theo dõi</Option>
            <Option value="serious">Nghiêm trọng</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="diagnosis"
          label="Chẩn đoán"
          rules={[{ required: true, message: "Vui lòng nhập chẩn đoán!" }]}
          className={cx("form-item")}
        >
          <Input placeholder="Nhập chẩn đoán" />
        </Form.Item>

        <Form.Item name="followUpDate" label="Ngày tái khám" className={cx("form-item")}>
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Chọn ngày tái khám"
            className={cx("date-picker")}
            suffixIcon={<CalendarOutlined />}
          />
        </Form.Item>

        <Form.Item name="doctorNotes" label="Ghi chú từ bác sĩ" className={cx("form-item")}>
          <TextArea rows={4} placeholder="Nhập ghi chú từ bác sĩ" className={cx("text-area")} />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default UpdateExaminationDrawer

