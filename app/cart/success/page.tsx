"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { clearCart } from "@/lib/redux/slices/cartSlice";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SiTicktick } from "react-icons/si";

function CartSuccessPage() {
    const userId = useAppSelector((state) => state.user._id);
    const orderNumber = useSearchParams().get("orderNumber");
    const dispatch = useAppDispatch();

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 10);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    useEffect(() => {
        if (orderNumber && userId) {
            dispatch(clearCart(userId));
        }
    }, [orderNumber, userId]);

    return (
        <section className="flex items-center justify-center flex-col px-4 py-24 space-y-6">
            <SiTicktick className="text-[100px] text-green-400" />
            <h3 className="text-2xl font-medium text-gray-700">
            Your order was placed successfully.
            </h3>

            <div className="text-sm text-gray-500">
                <p>
                    Order ID: <strong>{orderNumber}</strong>
                </p>
            </div>

            <p className="text-sm text-gray-500">
                Estimated Delivery: <strong>{formattedDate}</strong>
            </p>

            <Link
                href="/"
                className="px-4 py-2 hover:underline bg-gray-100 rounded"
            >
                Continue shopping
            </Link>
        </section>
    );
}

export default CartSuccessPage;
