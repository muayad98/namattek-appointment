import { Form, Input, Button } from "antd";

export default function DetailsForm({ onFinish, loading }) {
  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="name" label="الاسم" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="رقم الهاتف" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="البريد (اختياري)">
        <Input />
      </Form.Item>
      <Button htmlType="submit" type="primary" loading={loading}>
        تأكيد الحجز
      </Button>
    </Form>
  );
}
