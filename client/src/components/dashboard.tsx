"use client";

import { motion, type Variants } from "framer-motion";
import { DashboardInvoices } from "../components/ui/dashboard-invoices";
import { SalesChart } from "../components/ui/sales-chart";
import { DashboardStats } from "../components/ui/stats";

const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.04,
        },
    },
};

const headerVariants: Variants = {
    hidden: { opacity: 0, y: -8 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
};

const panelVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
};

const cellVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
};

export function Dashboard() {
    return (
        <motion.div
            className="flex flex-1 flex-col gap-6 py-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <motion.div className="flex flex-col gap-1" variants={headerVariants}>
                <h1 className="font-semibold text-xl leading-tight">
                    Welcome back, Shaban!
                </h1>
                <p className="text-base text-muted-foreground">
                    let's get things done.
                </p>
            </motion.div>
            <motion.div
                className="rounded-3xl overflow-hidden border"
                variants={panelVariants}
            >
                <motion.div
                    className="grid grid-cols-1 gap-px bg-border lg:grid-cols-3"
                    variants={containerVariants}
                >
                    <motion.div
                        variants={cellVariants}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-background"
                    >
                        <DashboardStats />
                    </motion.div>
                    <motion.div
                        variants={cellVariants}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-background"
                    >
                        <SalesChart />
                    </motion.div>
                    <motion.div
                        variants={cellVariants}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-background"
                    >
                        <DashboardInvoices />
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}