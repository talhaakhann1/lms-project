"use client"

import { OrderStats } from "../../../components/admin/orders/OrderStats";
import { OrdersTable } from "../../../components/admin/orders/OrdersTable";
import { Order } from "@/src/types/interfaces/order.interface";
import { useCallback, useEffect, useState } from "react";
import { orderService } from "@/src/services/order.service";
import { showError } from "@/src/components/ui/toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";

export default function AdminOrdersPage() {
	
	const [orders, setOrders] = useState<Order[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const fetchOrders =useCallback( async () => {
		setIsLoading(true)
		try {
			const res = await orderService.getAll();
			setOrders(res);

		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse<unknown>>;

			const errorMessage =
				axiosError.response?.data.message ?? "aSomething went wrong";

			console.error(errorMessage);

			showError("Something went wrong", errorMessage);
		} finally {
			setIsLoading(false)
		}
	},[])
	useEffect(() => {
		fetchOrders()
	}, [fetchOrders])
	return (
		<main className="w-full max-w-5xl min-w-0 space-y-8 overflow-hidden px-4 pb-16 sm:px-4 lg:px-2">
  <div className="flex min-w-0 flex-col gap-8">
    <div className="space-y-1">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Orders
      </h1>

      <p className="max-w-xl text-muted-foreground">
        Manage and monitor all customer orders.
      </p>
    </div>

    <div className="min-w-0 space-y-4 ">
      <OrderStats
        isLoading={isLoading}
        orders={orders}
      />

      <OrdersTable
        isLoading={isLoading}
        data={orders}
      />
    </div>
  </div>
</main>
	);
}
