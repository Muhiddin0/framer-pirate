import React from "react";

type Props = {
  children: React.ReactNode;
};

export default ({ children }: Props) => {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
};
