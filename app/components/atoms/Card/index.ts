import { Card as CardRoot } from "./Card";
import { CardBody } from "./CardBody";
import { CardDescription } from "./CardDescription";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";
import { CardTitle } from "./CardTitle";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Title: CardTitle,
  Description: CardDescription,
});

export type { CardProps } from "./Card";
export type { CardBodyProps } from "./CardBody";
export type { CardDescriptionProps } from "./CardDescription";
export type { CardFooterProps } from "./CardFooter";
export type { CardHeaderProps } from "./CardHeader";
export type { CardTitleProps } from "./CardTitle";
