import { useEffect, useState } from "react";
import { fetchDashboardSummary, fetchRecentActivity } from "../services/dashboard.service";

function StatCard({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        // Fetch in parallel
        const [sum, act] = await Promise.all([
          fetchDashboardSummary(),
          fetchRecentActivity(),
        ]);

        if (!alive) return;
        setSummary(sum);
        setActivity(act);
      } catch (err) {
        if (!alive) return;
        setError(err?.response?.data?.message || err.message || "Failed to load dashboard");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, []);

  if (loading) return <div style={styles.page}>Loading dashboard…</div>;

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.error}>⚠️ {error}</div>
        <button onClick={() => window.location.reload()} style={styles.button}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Dashboard</h1>

      {/* KPI cards */}
      <div style={styles.grid}>
        <StatCard label="Users" value={summary?.usersCount ?? 0} />
        <StatCard label="Courses" value={summary?.coursesCount ?? 0} />
        <StatCard label="Active Users" value={summary?.activeUsers ?? 0} />
        <StatCard label="Completion Rate" value={`${summary?.completionRate ?? 0}%`} />
      </div>

      {/* Recent activity */}
      <div style={{ marginTop: 24 }}>
        <h2 style={styles.h2}>Recent activity</h2>

        {activity.length === 0 ? (
          <div style={styles.muted}>No activity yet.</div>
        ) : (
          <div style={styles.table}>
            <div style={{ ...styles.row, ...styles.headerRow }}>
              <div>Type</div>
              <div>Message</div>
              <div>Date</div>
            </div>

            {activity.map((item) => (
              <div key={item.id} style={styles.row}>
                <div>{item.type}</div>
                <div>{item.message}</div>
                <div>{new Date(item.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24, fontFamily: "system-ui, sans-serif" },
  h1: { margin: 0, marginBottom: 16 },
  h2: { margin: 0, marginBottom: 12 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 16,
    background: "white",
  },
  label: { fontSize: 14, opacity: 0.7 },
  value: { fontSize: 28, fontWeight: 700, marginTop: 6 },
  table: {
    border: "1px solid #ddd",
    borderRadius: 12,
    overflow: "hidden",
    background: "white",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "140px 1fr 220px",
    gap: 12,
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
  },
  headerRow: { fontWeight: 700, background: "#f7f7f7" },
  muted: { opacity: 0.7 },
  error: { color: "#b00020", marginBottom: 12 },
  button: { padding: "10px 14px", borderRadius: 10, border: "1px solid #ccc", cursor: "pointer" },
};
