import { db } from "@/lib/firebase/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

interface ICartCardProps {
    image: string;
    description: string;
    title: string;
    price: number;
    quantity: number;
    userId: string;
    _id: string;
}

function CartCard(item: ICartCardProps) {
    const cartDocRef = doc(db, "users", item.userId, "cart", item._id);

    const deleteItem = async () => {
        try {
            await deleteDoc(cartDocRef);
        } catch (error) {
            console.log(error);
        }
    };

    const updateQuantity = async (by: -1 | 1) => {
        try {
            if (item.quantity == 1 && by == -1) {
                await deleteItem();
                return;
            }
            await updateDoc(cartDocRef, { quantity: item.quantity + by });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="border p-2 rounded flex space-x-3 md:space-x-5 bg-white">
            <Image
                src={item.image}
                alt="product_image"
                width={500}
                height={500}
                loading="eager"
                className="w-24 h-24 md:w-36 md:h-36 rounded object-fill"
            />

            <div className="flex-1 space-y-3">
                <div className="md:space-y-1">
                    <h3 className="text-lg line-clamp-1 font-semibold">
                        {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3">
                        {item.description}
                    </p>

                    <div className="flex items-center space-x-2">
                        <p className="text-base mt-2 font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-300">
                            (${item.price}each)
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            className="bg-slate-100 p-1 rounded-full"
                            onClick={() => updateQuantity(-1)}
                        >
                            <FaMinus className="text-base" />
                        </button>
                        <p className="text-sm">{item.quantity}</p>
                        <button
                            className="bg-slate-100 p-1 rounded-full"
                            onClick={() => updateQuantity(1)}
                        >
                            <FaPlus className="text-base" />
                        </button>
                    </div>

                    <div className="md:pr-3">
                        <button
                            className="p-1 bg-slate-100 rounded-full"
                            onClick={deleteItem}
                        >
                            <MdDelete className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartCard;
