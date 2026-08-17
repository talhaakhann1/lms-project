import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
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
import { Badge } from "../../ui/badge";
import { ArrowUpRight } from "lucide-react";
import { RevenuePoint } from "@/src/types/interfaces/admin.interface";
import { useState } from "react";


const chartTooltipStyle: React.CSSProperties = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  boxShadow: "var(--shadow-sm)",
  fontSize: "12px",
  color: "var(--popover-foreground)",
};

const axisTickStyle = { fill: "var(--muted-foreground)", fontSize: 12 };

interface RevenueOverviewChartProps {
  data: RevenuePoint[];
}


function RevenueOverviewChart({
  data,
}: RevenueOverviewChartProps) {

  // const [range, setRange] = useState("7d");

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-5 pb-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Revenue Overview
            </CardTitle>
            <Badge
              variant="outline"
              className="gap-1 border-primary/20 bg-primary/10 text-xs font-medium text-primary"
            >
              <ArrowUpRight className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              12.4%
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Daily revenue across all courses.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-4 overflow-hidden">
        <div className="h-[280px] w-full  min-w-0">
          <ResponsiveContainer width="99%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
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
                tickFormatter={(value: number) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default RevenueOverviewChart