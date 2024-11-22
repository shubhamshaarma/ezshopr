"use client";

import React, { useRef } from "react";
import { AppStore, store } from "./store";
import { Provider } from "react-redux";
import { userAuthState } from "./slices/userSlice";
import { initProducts } from "./slices/productSlice";

function ReduxProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = store();
        storeRef.current.dispatch(userAuthState());
        storeRef.current.dispatch(initProducts());
    }
    return <Provider store={storeRef.current}>{children}</Provider>;
}

export default ReduxProvider;
