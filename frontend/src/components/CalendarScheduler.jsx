import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { getAppointments } from "../api";

export default function CalendarScheduler({ serviceId, onPick }) {
  const [events, setEvents] = useState([]);

  // fetch existing appointments whenever the selected service changes
  useEffect(() => {
    if (!serviceId) return;

    getAppointments().then((res) => {
      const busy = res.data
        .filter(
          (a) => a.service_id === serviceId && a.status === "scheduled"
        )
        .map((a) => ({
          start: a.start_time,
          end: a.end_time,
          display: "background",
          backgroundColor: "#ffe2e2",
        }));
      setEvents(busy);
    });
  }, [serviceId]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      height="auto"
      selectable
      unselectAuto={false}
      // single‑click selects an entire day
      dateClick={(info) => onPick(dayjs(info.date).startOf("day").toISOString())}
      events={events}
    />
  );
}
