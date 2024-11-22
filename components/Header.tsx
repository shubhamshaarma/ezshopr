"use client";

import { auth, db } from "@/lib/firebase/firebase";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { initCart } from "@/lib/redux/slices/cartSlice";
import { clearUser, IUser, setUser } from "@/lib/redux/slices/userSlice";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { LiaOpencart } from "react-icons/lia";
import { VscAccount } from "react-icons/vsc";
import { Oval } from "react-loader-spinner";

function Header() {
    const user = useAppSelector((state) => state.user);
    const cartSize = useAppSelector((state) => state.cart.items.length);
    const dispatch = useAppDispatch();

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);

            if (!user) throw new Error("No user found.");

            const userRef: IUser = {
                _id: user.uid,
                fullname: String(user.displayName),
                email: String(user.email),
                profile: String(user.photoURL),
            };

            await setDoc(doc(db, "users", user.uid), userRef);
            dispatch(setUser(userRef));
        } catch (error) {
            console.error(error);
        }
    };

    const userSignOut = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser());
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user._id) dispatch(initCart(user._id));
    }, [user._id, dispatch]);

    return (
        <header className="px-4 sm:px-6 py-2 border-b sticky top-0 z-50 bg-white">
            <div className="flex items-center justify-between h-10">
                <nav>
                    <Link href="/">
                        <h1 className="text-2xl font-semibold text-gray-700">
                            EzShopr
                        </h1>
                    </Link>
                </nav>

                <div className="flex items-center  space-x-4 md:space-x-6">
                    <Link
                        href="/cart"
                        className="text-base uppercase hover:underline"
                    >
                        <button className="sm:flex sm:items-center sm:space-x-2 sm:px-3 sm:py-1.5 sm:rounded rounded-full relative p-1.5 bg-gray-100 text-gray-700">
                            <LiaOpencart className="text-2xl" />
                            <span className="hidden sm:inline">Cart</span>
                            <span className="absolute -top-1 -right-1 text-white text-xs bg-red-500 w-4 h-4 text-center flex items-center justify-center rounded-full">
                                {cartSize}
                            </span>
                        </button>
                    </Link>

                    {user.session ? (
                        <Link href="/?target=_signOut">
                            <button
                                className="flex items-center md:space-x-3"
                                onClick={userSignOut}
                            >
                                <Image
                                    src={user.profile}
                                    alt="profile"
                                    width={20}
                                    height={20}
                                    className="w-9 h-9 rounded-full bg-slate-100"
                                />
                                <div className="hidden md:flex flex-col items-start">
                                    <p className="text-xs font-medium">
                                        Welcome Back!
                                    </p>
                                    <p className="text-sm font-medium truncate max-w-32">
                                        {user.fullname}
                                    </p>
                                </div>
                            </button>
                        </Link>
                    ) : (
                        <>
                            {user.isPending ? (
                                <Oval
                                    visible={user.isPending}
                                    height="32"
                                    width="32"
                                    color="#0085ff"
                                    ariaLabel="oval-loading"
                                    strokeWidth={4}
                                />
                            ) : (
                                <button
                                    className="text-gray-700"
                                    onClick={signInWithGoogle}
                                >
                                    <VscAccount className="text-3xl" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
