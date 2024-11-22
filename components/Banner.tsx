"use client";
import { IoCopyOutline } from "react-icons/io5";

function Banner() {
    return (
        <section className="p-4 sm:p-6 bg-gradient-to-tr from-red-600 to-black">
            <div className="min-h-40 text-white py-3 px-1 sm:px-2 md:px-3">
                <div className="w-full md:w-2/3">
                    <div className="space-y-4 md:space-y-5">
                        <p className="text-white text-sm inline bg-black/40 p-2 rounded-md">
                            Limited Time Only - Dont Miss Out!
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white font-medium">
                            Exclusive Festive Deals Await Shop Now & Save Big!
                        </h2>
                    </div>

                    <p className="text-white pt-7 text-base">
                        Discover unbeatable discounts on top gadgets, fashion,
                        and more! Limited stock, limited time - grab these
                        exclusive deals before they are gone!
                    </p>

                    <div className="pt-6 flex items-center space-x-3">
                        <p className="text-white text-sm">
                            SAVE20 – Use at checkout for an additional 20% off!
                        </p>
                        <button
                            className="text-white bg-gray-200/20 active:bg-gray-200/30 p-1 rounded"
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(
                                        "save20".toUpperCase()
                                    );
                                } catch (error: unknown) {
                                    console.error(error);
                                }
                            }}
                        >
                            <IoCopyOutline className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Banner;
