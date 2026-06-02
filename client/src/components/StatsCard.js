const StatsCard = ({ title, value, detail, accent }) => {
  return (
    <div className="card stats-card" style={{ borderLeft: `4px solid ${accent}` }}>
      <h3>{title}</h3>
      <p style={{ fontSize: '2rem', margin: '8px 0' }}>{value}</p>
      <p className="text-muted small-text">{detail}</p>
    </div>
  );
};

export default StatsCard;
