import { db } from "@/lib/firebase/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";

export interface IProduct {
    _id: string; // Firebase doc id
    title: string;
    description: string;
    price: number;
    images: string[];
    thumbnail: string;
    category: string;
    rating: number;
}

interface IProductState {
    isPending: boolean;
    error: boolean;
    products: IProduct[];
}

const initialState: IProductState = {
    isPending: true,
    error: false,
    products: [],
};

// Async thunk to fetch products
export const initProducts = createAsyncThunk<IProduct[]>(
    "products/fetch",
    async (_, thunkAPI) => {
        try {
            const { docs } = await getDocs(collection(db, "products"));
            const products = docs.map(
                (doc) =>
                    ({
                        _id: doc.id,
                        ...doc.data(),
                    } as IProduct)
            );
            return products;
        } catch (error) {
            console.error(error);
            return thunkAPI.rejectWithValue("Failed to fetch products");
        }
    }
);

// Redux slice
const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initProducts.pending, (state) => {
                state.isPending = true;
                state.error = false;
            })
            .addCase(initProducts.fulfilled, (state, action) => {
                state.isPending = false;
                state.products = action.payload;
            })
            .addCase(initProducts.rejected, (state) => {
                state.isPending = false;
                state.error = true;
            });
    },
});

export default productSlice.reducer;
