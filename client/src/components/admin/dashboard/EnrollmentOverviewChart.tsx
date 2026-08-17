import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EnrollmentPoint } from "@/src/types/interfaces/admin.interface";

interface EnrollmentOverviewChartProps {
  data: EnrollmentPoint[];
}

 
const chartTooltipStyle: React.CSSProperties = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  boxShadow: "var(--shadow-sm)",
  fontSize: "12px",
  color: "var(--popover-foreground)",
};
 
const axisTickStyle = { fill: "var(--muted-foreground)", fontSize: 12 };

function EnrollmentOverviewChart({
  data,
}: EnrollmentOverviewChartProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="text-base font-semibold text-foreground">
          Enrollment Overview
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          New enrollments, last 7 days.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-4 overflow-hidden">
        <div className="h-[220px] w-full  min-w-0">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="label"
                tick={axisTickStyle}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />

              <YAxis
                tick={axisTickStyle}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={chartTooltipStyle}
               formatter={(value) => [value ?? 0, "Enrollments"]}
              />

              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default EnrollmentOverviewChart;