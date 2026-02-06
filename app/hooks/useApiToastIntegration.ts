import { Toast, useToast } from "@contexts/ToastContext";
import { setToastHandler } from "@services/http-client";
import { useEffect } from "react";

export function useApiToastIntegration(): void {
	const { showToast } = useToast();

	useEffect(() => {
		setToastHandler(({ type, title, description }: Omit<Toast, "id">) => {
			showToast({
				type,
				title,
				description,
			});
		});

		return () => {
			setToastHandler(() => {});
		};
	}, [showToast]);
}
