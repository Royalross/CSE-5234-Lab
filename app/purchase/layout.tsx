import React from "react";

export default function PurchaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">{children}</div>
  );
}
