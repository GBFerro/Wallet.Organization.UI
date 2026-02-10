import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type EventListener = () => void;

interface EventContextType {
	emitTransactionChange: () => void;
	onTransactionChange: (listener: EventListener) => () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: Readonly<{ children: ReactNode }>) {
	const [listeners, setListeners] = useState<Set<EventListener>>(new Set());

	const emitTransactionChange = useCallback(() => {
		listeners.forEach((listener) => listener());
	}, [listeners]);

	const onTransactionChange = useCallback((listener: EventListener) => {
		setListeners((prev) => new Set(prev).add(listener));
		return () => {
			setListeners((prev) => {
				const next = new Set(prev);
				next.delete(listener);
				return next;
			});
		};
	}, []);

	const value = useMemo(
		() => ({ emitTransactionChange, onTransactionChange }),
		[emitTransactionChange, onTransactionChange],
	);

	return (
		<EventContext.Provider value={value}>{children}</EventContext.Provider>
	);
}

export function useEvent() {
	const context = useContext(EventContext);
	if (context === undefined) {
		throw new Error("useEvent must be used within an EventProvider");
	}
	return context;
}
