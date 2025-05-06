import { Card, CardContent, Typography, Switch } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://127.0.0.1:8000" });

const StatCard = ({ title, value }) => (
  <Card sx={{ flex: 1, m: 1 }}>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4" sx={{ mt: 1 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ today_bookings: 0, no_show_rate: 0 });
  const [accepting, setAccepting] = useState(true);

  useEffect(() => {
    api.get("/stats/overview").then((res) => setStats(res.data));
    api.get("/config/accepting").then((res) => setAccepting(res.data.accepting));
  }, []);

  const toggleAccepting = () => {
    api.put("/config/accepting", { accepting: !accepting }).then((res) =>
      setAccepting(res.data.accepting)
    );
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <StatCard title="Today's bookings" value={stats.today_bookings} />
      <StatCard title="No‑show rate (30 d)" value={`${stats.no_show_rate}%`} />
      <Card sx={{ flex: 1, m: 1 }}>
        <CardContent>
          <Typography variant="h6">Accepting bookings</Typography>
          <Switch
            checked={accepting}
            onChange={toggleAccepting}
            sx={{ mt: 1 }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
