"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import {
	ArrowDownIcon,
	ArrowUpDownIcon,
	ArrowUpIcon,
	CircleCheckIcon,
	CircleXIcon,
	ClockIcon,
} from "lucide-react";

import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import {
	formatFullCurrency,
} from "@/src/lib/formatter";

import type { Order } from "@/src/types/interfaces/order.interface";
import { OrderStatus } from "@/src/types/enums/order.enum";
import { PaymentStatus } from "@/src/types/enums/payment.enum";

function formatDate(date?: Date | string): string {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}


export type OrderAction =
	| "view"
	| "invoice"
	| "refund"
	| "cancel";

interface StatusConfig {
	label: string;
	icon: LucideIcon;
	variant:
	| "default"
	| "secondary"
	| "outline"
	| "destructive";
}

const PAYMENT_STATUS: Record<PaymentStatus, StatusConfig> = {
	[PaymentStatus.SUCCESS]: {
		label: "Success",
		icon: CircleCheckIcon,
		variant: "default",
	},

	[PaymentStatus.FAILED]: {
		label: "Failed",
		icon: CircleXIcon,
		variant: "destructive",
	},
};

const ORDER_STATUS: Record<OrderStatus, StatusConfig> = {
	[OrderStatus.PENDING]: {
		label: "Pending",
		icon: ClockIcon,
		variant: "outline",
	},

	[OrderStatus.PAID]: {
		label: "Paid",
		icon: CircleCheckIcon,
		variant: "default",
	},

	[OrderStatus.CANCELED]: {
		label: "Canceled",
		icon: CircleXIcon,
		variant: "destructive",
	},

	[OrderStatus.FAILED]: {
		label: "Failed",
		icon: CircleXIcon,
		variant: "destructive",
	},
};

function StatusBadge({
	config,
}: {
	config: StatusConfig;
}) {
	const {
		label,
		icon: Icon,
		variant,
	} = config;

	return (
		<Badge
			variant={variant}
			className="gap-1.5"
		>
			<Icon
				className="size-3.5"
				strokeWidth={1.75}
			/>
			{label}
		</Badge>
	);
}

function SortableHeader({
	label,
	sorted,
	onToggle,
	className,
}: {
	label: string;
	sorted: false | "asc" | "desc";
	onToggle: () => void;
	className?: string;
}) {
	const Icon =
		sorted === "asc"
			? ArrowUpIcon
			: sorted === "desc"
				? ArrowDownIcon
				: ArrowUpDownIcon;

	return (
		<Button
			aria-label={`Sort by ${label}`}
			className={className}
			onClick={onToggle}
			size="sm"
			variant="ghost"
		>
			{label}
			<Icon
				className="size-3.5"
				strokeWidth={1.75}
			/>
		</Button>
	);
}

export function createOrderColumns(
	onAction: (
		action: OrderAction,
		order: Order
	) => void
): ColumnDef<Order>[] {
	return [
		{
			id: "select",
			enableSorting: false,
			enableHiding: false,

			header: ({ table }) => (
				<Checkbox
					aria-label="Select all orders on this page"
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={(checked) =>
						table.toggleAllPageRowsSelected(
							!!checked
						)
					}
				/>
			),

			cell: ({ row }) => (
				<Checkbox
					aria-label={`Select order ${row.original.id}`}
					checked={row.getIsSelected()}
					onCheckedChange={(checked) =>
						row.toggleSelected(!!checked)
					}
				/>
			),
		},

		{
			accessorKey: "id",
			header: "Order ID",
			cell: ({ row }) => (
				<span className="font-mono text-xs">
					{row.original.id}
				</span>
			),
		},

		{
			id: "customer",
			accessorFn: (row) => row.user?.fullName,

			header: ({ column }) => (
				<SortableHeader
					label="Customer"
					onToggle={() =>
						column.toggleSorting(
							column.getIsSorted() === "asc"
						)
					}
					sorted={column.getIsSorted()}
				/>
			),

			cell: ({ row }) => (
				<div className="flex flex-col">
					<span className="font-medium">
						{row.original.user?.fullName}
					</span>

					<span className="text-xs text-muted-foreground">
						{row.original.user?.email}
					</span>
				</div>
			),
		},

		{
			id: "course",

			accessorFn: (row) => row.course?.title,

			header: "Course",

			cell: ({ row }) => (
				<span className="max-w-56 truncate">
					{row.original.course?.title}
				</span>
			),
		},

		{
			accessorKey: "totalAmount",

			header: ({ column }) => (
				<SortableHeader
					className="-mr-2.5 ml-auto flex"
					label="Amount"
					onToggle={() =>
						column.toggleSorting(
							column.getIsSorted() === "asc"
						)
					}
					sorted={column.getIsSorted()}
				/>
			),

			cell: ({ row }) => (
				<div className="text-right font-medium">
					{formatFullCurrency(
						row.original.totalAmount
					)}
				</div>
			),
		},

		{
			id: "payment",

			header: "Payment",

			cell: ({ row }) => {
				const paymentStatus = row.original.isPaid
					? PaymentStatus.SUCCESS
					: PaymentStatus.FAILED;


				return (
					<StatusBadge
						config={
							PAYMENT_STATUS[paymentStatus]
						}
					/>
				);
			},
		},

		{
			accessorKey: "status",

			header: "Order",

			cell: ({ row }) => (
				<StatusBadge
					config={
						ORDER_STATUS[row.original.status]
					}
				/>
			),
		},

		{
			accessorKey: "createdAt",

			header: ({ column }) => (
				<SortableHeader
					label="Purchase Date"
					onToggle={() =>
						column.toggleSorting(
							column.getIsSorted() === "asc"
						)
					}
					sorted={column.getIsSorted()}
				/>
			),

			cell: ({ row }) => (
				<span className="whitespace-nowrap">
					{formatDate(
						row.original.createdAt,
					)}
				</span>
			),
		},

	];
}