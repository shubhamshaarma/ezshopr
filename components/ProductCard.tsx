"use client";

import Image from "next/image";
import { RotatingLines } from "react-loader-spinner";
import RatingStar from "./RatingStar";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAppSelector } from "@/lib/redux/hooks";

interface IProductCardProps {
    image: string;
    title: string;
    description: string;
    price: number;
    rating: number;
    _id: string;
}

function ProductCard({
    title,
    image,
    description,
    price,
    rating,
    _id,
}: IProductCardProps) {
    const [isPending, setIsPending] = useState(false);
    const user_id = useAppSelector((state) => state.user._id);

    // Handle add to cart session.
    const addToCart = async () => {
        try {
            setIsPending(true);
            await addDoc(collection(db, "users", user_id, "cart"), {
                quantity: 1,
                productId: _id,
            });

            setIsPending(false);
        } catch (error: unknown) {
            console.error(error);
        }
    };

    return (
        <div className="bg-gray-100 rounded flex flex-col">
            <div className="aspect-square rounded relative overflow-hidden">
                <Image
                    src={image}
                    alt="item"
                    width={500}
                    height={500}
                    quality={100}
                    priority
                    className="w-full h-full object-contain object-center"
                    loading="eager"
                />
            </div>

            <div className="py-2 px-3 space-y-4 flex flex-col justify-between flex-1">
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-600 tracking-tight line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-sm line-clamp-3">{description}</p>
                    <p className="text-base font-semibold text-gray-700 flex items-center space-x-3">
                        <span>${price}</span>
                        <span className="flex items-center">
                            <RatingStar rating={rating} />
                        </span>
                    </p>
                </div>

                <button
                    className="bg-red-500 text-white h-10 rounded text-sm font-medium active:bg-red-500/85 flex items-center justify-center"
                    onClick={addToCart}
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
                        <span>Add To Cart</span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
