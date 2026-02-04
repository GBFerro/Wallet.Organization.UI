import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	type: ToastType;
	title: string;
	description?: string;
	duration?: number;
}

interface ToastContextValue {
	toasts: Toast[];
	showToast: (toast: Omit<Toast, "id">) => void;
	hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const hideToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showToast = useCallback((toast: Omit<Toast, "id">) => {
		const id = `toast-${Date.now()}-${Math.random()}`;
		const newToast: Toast = {
			id,
			duration: 3000,
			...toast,
		};

		setToasts((prev) => [...prev, newToast]);
	}, []);

	const value = React.useMemo(
		() => ({
			toasts,
			showToast,
			hideToast,
		}),
		[toasts, showToast, hideToast],
	);

	return (
		<ToastContext.Provider value={value}>{children}</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return context;
}
