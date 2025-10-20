"use client";
import { createContext, useContext } from "react";
import { container, Container } from "./container";

const UseCasesCtx = createContext<Container>(container);

export function UseCasesProvider({ children }: { children: React.ReactNode }) {
    return <UseCasesCtx.Provider value={container}>{children}</UseCasesCtx.Provider>;
}

export function useUseCases() {
    return useContext(UseCasesCtx);
}
