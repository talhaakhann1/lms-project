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
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Order } from "@/src/types/interfaces/order.interface";
import { OrderPoint } from "@/src/types/interfaces/admin.interface";

interface OrderOverviewChartProps {
  data: OrderPoint[];
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

function OrdersOverviewChart({data}:OrderOverviewChartProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="text-base font-semibold text-foreground">
          Orders Overview
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Daily order volume, last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-4 overflow-hidden">
        <div className="h-[220px] w-full  min-w-0">
         <ResponsiveContainer width="99%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={axisTickStyle}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value) => [value ?? 0, "Enrollments"]}
                cursor={{ fill: "var(--muted)" }}
              />
              <Bar dataKey="orders" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrdersOverviewChart