import { LucideIcon } from "lucide-react";
import { Card, CardContent} from "../../ui/card";
import { motion } from "framer-motion";

export interface StatWidgetProps {
  label: string;
  value: number;
  supportingText: string;
  icon: LucideIcon;
}


function StatWidget({ label, value, supportingText, icon: Icon }: StatWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card className="min-h-0 border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              {value}
            </span>
          </div>

          <span className="text-xs text-muted-foreground">{supportingText}</span>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default StatWidget