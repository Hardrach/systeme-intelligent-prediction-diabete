import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  Globe,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CountUp from "react-countup";
import { fetchDashboardData, fetchScrapedData } from "../../services/predictionService";
import "./Dashboard.css";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

/* ─── Custom Tooltip ────────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(17, 24, 39, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(148, 163, 184, 0.15)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "0.8rem",
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
      }}
    >
      {label && (
        <p style={{ color: "#94A3B8", marginBottom: 4, fontWeight: 600 }}>
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color, fontWeight: 500 }}>
          {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(4) : entry.value}
        </p>
      ))}
    </div>
  );
}

/* ─── Heatmap Color ─────────────────────────────────────────────────────────── */
function getHeatmapColor(val) {
  if (val >= 0.7) return { bg: "rgba(239, 68, 68, 0.7)", color: "#fff" };
  if (val >= 0.4) return { bg: "rgba(245, 158, 11, 0.5)", color: "#fff" };
  if (val >= 0.2) return { bg: "rgba(245, 158, 11, 0.25)", color: "#F1F5F9" };
  if (val >= 0) return { bg: "rgba(99, 102, 241, 0.1)", color: "#94A3B8" };
  if (val >= -0.2) return { bg: "rgba(6, 182, 212, 0.1)", color: "#94A3B8" };
  if (val >= -0.4) return { bg: "rgba(6, 182, 212, 0.3)", color: "#F1F5F9" };
  return { bg: "rgba(6, 182, 212, 0.5)", color: "#fff" };
}

/* Short column names for heatmap */
const SHORT_NAMES = {
  Pregnancies: "Preg",
  Glucose: "Gluc",
  BloodPressure: "BP",
  SkinThickness: "Skin",
  Insulin: "Ins",
  BMI: "BMI",
  DiabetesPedigreeFunction: "DPF",
  Age: "Age",
  Outcome: "Out",
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [scraped, setScraped] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, scrapedRes] = await Promise.all([
        fetchDashboardData(),
        fetchScrapedData(),
      ]);
      setData(dashRes);
      setScraped(scrapedRes);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* Prepare training history line chart data */
  const trainingData = data?.training_history?.accuracy
    ? data.training_history.accuracy.map((acc, i) => ({
        epoch: i + 1,
        accuracy: parseFloat(acc.toFixed(4)),
        val_accuracy: parseFloat(data.training_history.val_accuracy[i].toFixed(4)),
      }))
    : [];

  const lossData = data?.training_history?.loss
    ? data.training_history.loss.map((l, i) => ({
        epoch: i + 1,
        loss: parseFloat(l.toFixed(4)),
        val_loss: parseFloat(data.training_history.val_loss[i].toFixed(4)),
      }))
    : [];

  return (
    <div className="dashboard-page page">
      <div className="container">
        {/* Header */}
        <motion.div
          className="dashboard-header"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="section-tag">
            <BarChart3 size={14} />
            Tableau de Bord
          </div>
          <h1>
            Dashboard{" "}
            <span className="gradient-text">Analytique</span>
          </h1>
          <p>
            Vue d'ensemble des données du dataset, résultats de l'analyse
            exploratoire, et performances du modèle ANN.
          </p>
        </motion.div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner" />
            <p>Chargement des données analytiques...</p>
          </div>
        ) : error ? (
          <motion.div
            className="dashboard-error glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle size={40} style={{ color: "var(--color-risk-high)" }} />
            <h3>Erreur de connexion</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadData}>
              <RotateCcw size={16} />
              Réessayer
            </button>
          </motion.div>
        ) : (
          <>
            {/* ═══ Stat Cards ═══ */}
            <motion.div
              className="dashboard-stats"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
            >
              {[
                {
                  icon: Users,
                  label: "Total Patients",
                  value: data.stats.total_patients,
                  color: "#6366F1",
                  suffix: "",
                },
                {
                  icon: UserCheck,
                  label: "Diabétiques",
                  value: data.stats.diabetic,
                  color: "#EF4444",
                  suffix: "",
                },
                {
                  icon: UserX,
                  label: "Non-Diabétiques",
                  value: data.stats.non_diabetic,
                  color: "#10B981",
                  suffix: "",
                },
                {
                  icon: Activity,
                  label: "Précision ANN",
                  value: data.stats.ann_accuracy,
                  color: "#06B6D4",
                  suffix: "%",
                  decimals: 2,
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="stat-card glass-card"
                  variants={fadeUp}
                  custom={i}
                  style={{ "--stat-color": stat.color }}
                >
                  <div
                    className="stat-card-icon"
                    style={{
                      background: `${stat.color}15`,
                      color: stat.color,
                    }}
                  >
                    <stat.icon size={22} />
                  </div>
                  <span
                    className="stat-card-value"
                    style={{ color: stat.color }}
                  >
                    <CountUp
                      end={stat.value || 0}
                      duration={1.8}
                      separator=","
                      decimals={stat.decimals || 0}
                      suffix={stat.suffix}
                    />
                  </span>
                  <span className="stat-card-label">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* ═══ Charts Grid ═══ */}
            <div className="dashboard-charts">
              {/* Outcome Distribution (Pie) */}
              <motion.div
                className="chart-card glass-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
              >
                <h3>
                  <BarChart3 size={18} />
                  Distribution Outcome
                </h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.outcome_distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {data.outcome_distribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        formatter={(value) => (
                          <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Glucose Histogram (Bar) */}
              <motion.div
                className="chart-card glass-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={1}
              >
                <h3>
                  <BarChart3 size={18} />
                  Histogramme Glucose
                </h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.glucose_histogram}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(148, 163, 184, 0.08)"
                      />
                      <XAxis
                        dataKey="range"
                        tick={{ fill: "#64748B", fontSize: 10 }}
                        axisLine={{ stroke: "rgba(148,163,184,0.1)" }}
                        tickLine={false}
                        angle={-35}
                        textAnchor="end"
                        height={55}
                      />
                      <YAxis
                        tick={{ fill: "#64748B", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="count"
                        name="Patients"
                        fill="#6366F1"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Training Accuracy (Line) */}
              <motion.div
                className="chart-card glass-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={2}
              >
                <h3>
                  <TrendingUp size={18} />
                  Training Accuracy
                </h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trainingData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(148, 163, 184, 0.08)"
                      />
                      <XAxis
                        dataKey="epoch"
                        tick={{ fill: "#64748B", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(148,163,184,0.1)" }}
                        tickLine={false}
                        label={{
                          value: "Epoch",
                          position: "bottom",
                          fill: "#64748B",
                          fontSize: 11,
                          offset: -5,
                        }}
                      />
                      <YAxis
                        tick={{ fill: "#64748B", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0.5, 1]}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="top"
                        iconType="line"
                        formatter={(value) => (
                          <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                            {value}
                          </span>
                        )}
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        name="Train Accuracy"
                        stroke="#6366F1"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "#6366F1" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="val_accuracy"
                        name="Val Accuracy"
                        stroke="#06B6D4"
                        strokeWidth={2}
                        dot={false}
                        strokeDasharray="5 5"
                        activeDot={{ r: 4, fill: "#06B6D4" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Training Loss (Line) */}
              <motion.div
                className="chart-card glass-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={3}
              >
                <h3>
                  <TrendingUp size={18} />
                  Training Loss
                </h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lossData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(148, 163, 184, 0.08)"
                      />
                      <XAxis
                        dataKey="epoch"
                        tick={{ fill: "#64748B", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(148,163,184,0.1)" }}
                        tickLine={false}
                        label={{
                          value: "Epoch",
                          position: "bottom",
                          fill: "#64748B",
                          fontSize: 11,
                          offset: -5,
                        }}
                      />
                      <YAxis
                        tick={{ fill: "#64748B", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="top"
                        iconType="line"
                        formatter={(value) => (
                          <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                            {value}
                          </span>
                        )}
                      />
                      <Line
                        type="monotone"
                        dataKey="loss"
                        name="Train Loss"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "#EF4444" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="val_loss"
                        name="Val Loss"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={false}
                        strokeDasharray="5 5"
                        activeDot={{ r: 4, fill: "#F59E0B" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Correlation Heatmap (Full Width) */}
              {data.correlation && (
                <motion.div
                  className="chart-card chart-card-full glass-card"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={4}
                >
                  <h3>
                    <BarChart3 size={18} />
                    Matrice de Corrélation
                  </h3>
                  <div className="heatmap-container">
                    <table className="heatmap-table">
                      <thead>
                        <tr>
                          <th></th>
                          {data.correlation.columns.map((col) => (
                            <th key={col}>{SHORT_NAMES[col] || col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.correlation.data.map((row, ri) => (
                          <tr key={ri}>
                            <td className="heatmap-row-label">
                              {SHORT_NAMES[data.correlation.columns[ri]] ||
                                data.correlation.columns[ri]}
                            </td>
                            {row.map((val, ci) => {
                              const { bg, color } = getHeatmapColor(val);
                              return (
                                <td
                                  key={ci}
                                  className="heatmap-cell"
                                  style={{ background: bg, color }}
                                  title={`${data.correlation.columns[ri]} × ${data.correlation.columns[ci]}: ${val}`}
                                >
                                  {val.toFixed(2)}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ═══ Scraped Data ═══ */}
            {scraped?.data && (
              <motion.div
                className="scraped-info glass-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <h3>
                  <Globe size={18} />
                  Web Scraping — Informations Santé
                </h3>
                <p className="scraped-source">
                  Source :{" "}
                  <a
                    href={scraped.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {scraped.source}
                  </a>
                </p>
                <div className="scraped-tags">
                  {scraped.data.map((item, i) => (
                    <span key={i} className="scraped-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
