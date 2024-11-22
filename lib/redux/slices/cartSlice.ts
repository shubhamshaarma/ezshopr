import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { AppDispatch } from "../store"; // Ensure your store has these types
import { IProduct } from "./productSlice";

export interface ICart {
    _id: string; // Firebase Doc id.
    quantity: number;
    product: IProduct;
}

interface ICartState {
    total: number;
    isPending: boolean;
    error: string;
    items: ICart[];
}

const initialState: ICartState = {
    total: 0,
    error: "",
    items: [],
    isPending: true,
};

// Firestore listener for real-time cart updates
export const initCart =
    (userId: string): ((dispatch: AppDispatch) => () => void) =>
    (dispatch: AppDispatch) => {
        const cartColRef = collection(db, "users", userId, "cart");

        const unsubscribe = onSnapshot(
            cartColRef,
            async (snapshot) => {
                try {
                    const data = await Promise.all(
                        snapshot.docs.map(async (docs) => {
                            const productRef = doc(
                                db,
                                "products",
                                docs.data().productId
                            );
                            const product = (
                                await getDoc(productRef)
                            ).data() as IProduct;

                            return {
                                _id: docs.id,
                                quantity: docs.data().quantity,
                                product,
                            };
                        })
                    );
                    dispatch(getCart(data));
                } catch (error) {
                    dispatch(setError("An error occurred."));
                    console.error(error);
                }
            },
            (error) => {
                dispatch(
                    setError(
                        error.message ||
                            "An error occurred while listening to cart updates."
                    )
                );
                console.error(error);
            }
        );

        return unsubscribe; // Return unsubscribe function for cleanup
    };

export const clearCart = createAsyncThunk(
    "cart/clear",
    async (userId: string) => {
        try {
            const cartRef = collection(db, "users", userId, "cart");
            const getCart = await getDocs(cartRef);

            getCart.docs.forEach(async (docs) => {
                try {
                    await deleteDoc(doc(cartRef, docs.id));
                } catch (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        getCart: (state, action: PayloadAction<ICart[]>) => {
            state.items = action.payload;
            state.isPending = false;
            state.total = state.items
                .map((item) => item.product.price * item.quantity)
                .reduce((total, currentPrice) => total + currentPrice, 0); // Ensure a default value for reduce
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isPending = false;
        },
    },
});

export const { getCart, setError } = cartSlice.actions;
export default cartSlice.reducer;
