import { SummaryCard as SummaryCardRoot } from "./SummaryCard";
import { SummaryCardIcon } from "./SummaryCardIcon";
import { SummaryCardTitle } from "./SummaryCardTitle";
import { SummaryCardValue } from "./SummaryCardValue";

export const SummaryCard = Object.assign(SummaryCardRoot, {
	Icon: SummaryCardIcon,
	Title: SummaryCardTitle,
	Value: SummaryCardValue,
});

export type { SummaryCardProps } from "./SummaryCard";
export type { SummaryCardIconProps } from "./SummaryCardIcon";
export type { SummaryCardTitleProps } from "./SummaryCardTitle";
export type { SummaryCardValueProps } from "./SummaryCardValue";
