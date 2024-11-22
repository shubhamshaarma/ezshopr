"use client";

import CartCard from "@/components/CartCard";
import { createCheckoutSession } from "@/lib/actions/createCheckoutSession";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { initCart } from "@/lib/redux/slices/cartSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

function CartPage() {
    const dispatch = useAppDispatch();
    const { _id } = useAppSelector((state) => state.user);
    const cart = useAppSelector((state) => state.cart);
    const [isPending, setIsPending] = useState(false);

    const handleCheckout = async () => {
        try {
            setIsPending(true);
            const checkoutUrl = await createCheckoutSession(cart.items, _id);

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        if (_id) dispatch(initCart(_id));
    }, [_id]);

    return (
        <>
            <section className="px-4 sm:px-6 pt-6 pb-16">
                <div className="max-w-3xl m-auto">
                    <h3 className="text-2xl font-medium text-gray-700">
                        Your Cart
                    </h3>
                    <br />

                    {cart.isPending && (
                        <div className="text-center">Loading Cart...</div>
                    )}

                    {cart.items.length > 0 ? (
                        <div className="space-y-4">
                            {cart.items.map((item, index) => {
                                return (
                                    <CartCard
                                        userId={_id}
                                        _id={item._id}
                                        title={item.product.title}
                                        description={item.product.description}
                                        image={item.product.images[0]}
                                        price={item.product.price}
                                        quantity={item.quantity}
                                        key={index}
                                    />
                                );
                            })}

                            <div className="space-y-4 pt-2">
                                <p className="text-end text-lg font-medium">
                                    Total: ${cart.total.toFixed(2)}
                                </p>

                                <button
                                    className="w-full bg-red-500 text-white h-10 flex items-center justify-center rounded"
                                    onClick={handleCheckout}
                                >
                                    {isPending ? (
                                        <RotatingLines
                                            visible={isPending}
                                            width="22"
                                            strokeWidth="3"
                                            strokeColor="#fff"
                                            animationDuration="0.75"
                                            ariaLabel="rotating-lines-loading"
                                        />
                                    ) : (
                                        <span>Checkout</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center pt-10 space-y-3">
                            <p className="text-xl">Your Cart is Empty.</p>
                            <br />
                            <Link
                                href="/"
                                className="px-4 py-2 hover:underline bg-gray-100 rounded"
                            >
                                Continue shopping
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default CartPage;
