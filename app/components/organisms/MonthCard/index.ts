export { MonthCardCalendar } from "./MonthCardCalendar";
export * from "./MonthCardContext";
export { MonthCardDayDetail } from "./MonthCardDayDetail";
export { MonthCardHeader } from "./MonthCardHeader";
export { MonthCardRoot } from "./MonthCardRoot";

import { MonthCardCalendar } from "./MonthCardCalendar";
import { MonthCardDayDetail } from "./MonthCardDayDetail";
import { MonthCardHeader } from "./MonthCardHeader";
import { MonthCardRoot } from "./MonthCardRoot";

export const MonthCard = Object.assign(MonthCardRoot, {
	Header: MonthCardHeader,
	Calendar: MonthCardCalendar,
	DayDetail: MonthCardDayDetail,
});
