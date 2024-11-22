import { auth, db } from "@/lib/firebase/firebase";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export interface IUser {
    _id: string;
    email: string;
    profile: string;
    fullname: string;
}

interface IUserState extends IUser {
    error: string | null;
    session: boolean;
    isPending: boolean;
}

const initialState: IUserState = {
    _id: "",
    email: "",
    error: null,
    profile: "",
    fullname: "",
    session: false,
    isPending: true,
};

export const userAuthState = createAsyncThunk(
    "user/userAuthState",
    async (_, { rejectWithValue }) => {
        try {
            return new Promise<IUser | null>((resolve, reject) => {
                onAuthStateChanged(
                    auth,
                    async (user) => {
                        if (user) {
                            const docRef = doc(db, "users", user.uid);
                            const userRef = (
                                await getDoc(docRef)
                            ).data() as IUser;

                            if (!userRef) return reject(rejectWithValue(null));

                            resolve({
                                _id: userRef._id,
                                email: userRef.email,
                                profile: userRef.profile,
                                fullname: userRef.fullname,
                            });
                        } else {
                            resolve(null); // No user signed in
                        }
                    },
                    (error) => reject(rejectWithValue(error.message)) // Listener error
                );
            });
        } catch (error) {
            return rejectWithValue(
                error || "Failed to fetch user authentication state."
            );
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            if (action.payload) {
                state._id = action.payload._id;
                state.email = action.payload.email;
                state.profile = action.payload.profile;
                state.fullname = action.payload.fullname;
                state.session = true;
            }
        },
        clearUser: (state) => {
            state._id = "";
            state.email = "";
            state.fullname = "";
            state.session = false;
            state.profile = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userAuthState.pending, (state) => {
                state.isPending = true;
                state.error = null;
            })
            .addCase(userAuthState.fulfilled, (state, action) => {
                state.isPending = false;
                if (action.payload) {
                    state._id = action.payload._id;
                    state.email = action.payload.email;
                    state.profile = action.payload.profile;
                    state.fullname = action.payload.fullname;
                    state.session = true;
                } else {
                    state.session = false; // No active user session
                }
            })
            .addCase(userAuthState.rejected, (state, action) => {
                state.isPending = false;
                state.error = action.payload as string;
                state.session = false;
            });
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
