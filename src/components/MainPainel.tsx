import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const MainPainel = ({ children }: Props) => {
  return <div className="mainPainel">{children}</div>;
};
