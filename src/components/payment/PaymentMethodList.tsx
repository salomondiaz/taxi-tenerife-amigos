
import React from "react";
import { PaymentMethod } from "@/types/payment";
import { PaymentMethodItem } from "./PaymentMethodItem";

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
  onOpenAddBalance: () => void;
}

export const PaymentMethodList: React.FC<PaymentMethodListProps> = ({
  paymentMethods,
  onSetDefault,
  onRemove,
  onOpenAddBalance,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {paymentMethods.map((method) => (
        <PaymentMethodItem
          key={method.id}
          method={method}
          onSetDefault={onSetDefault}
          onRemove={onRemove}
          onAddBalance={method.type === "cash" ? onOpenAddBalance : undefined}
        />
      ))}
    </div>
  );
};
