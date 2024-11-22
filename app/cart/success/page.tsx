"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { clearCart } from "@/lib/redux/slices/cartSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiTicktick } from "react-icons/si";

function CartSuccessPage() {
    const userId = useAppSelector((state) => state.user?._id);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 10);

    const formattedDate = currentDate.toISOString().split("T")[0];

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderNumberFromURL = params.get("orderNumber");
        setOrderNumber(orderNumberFromURL);

        if (orderNumberFromURL && userId) {
            dispatch(clearCart(userId));
        }
    }, [userId, dispatch]);

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
