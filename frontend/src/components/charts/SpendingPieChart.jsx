import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const palette = ['#0f766e', '#1d4ed8', '#dc2626', '#f59e0b', '#7c3aed', '#475569'];

export function SpendingPieChart({ data }) {
  return (
    <div className="chart-card">
      <div className="section-heading">
        <h3>Expense categories</h3>
        <span>This month</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={70}
            outerRadius={104}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
