import { useState } from "react";
import { createAppointment } from "../api";
import { Card, Steps, message } from "antd";
import ServiceSelector from "../components/ServiceSelector";
import CalendarScheduler from "../components/CalendarScheduler";
import DetailsForm from "../components/DetailsForm";
import { useNavigate } from "react-router-dom";

export default function BookingPage() {
  const [serviceId, setServiceId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const step = serviceId ? (startTime ? 2 : 1) : 0;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createAppointment({
        service_id: serviceId,
        customer_id: "placeholder", // we'll auto‑create customer later
        start_time: startTime,
        ...values,
      });
      navigate("/success");
    } catch (err) {
      message.error(err.response?.data?.detail || "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 800, margin: "40px auto" }}>
      <Steps current={step} items={[
        { title: "اختَر الخدمة" },
        { title: "اختَر الموعد" },
        { title: "أدخِل التفاصيل" },
      ]}/>
      {step === 0 && <ServiceSelector value={serviceId} onChange={(v)=>setServiceId(v)}/>}
      {step === 1 && <CalendarScheduler serviceId={serviceId} onPick={setStartTime}/>}
      {step === 2 && <DetailsForm onFinish={handleSubmit} loading={loading}/>}
    </Card>
  );
}
