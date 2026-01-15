import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { PoolActionCardProps, Tab } from "./types";
import { ActionTabs } from "./action-tabs";
import { SupplyContent } from "./supply-content";
import { BorrowContent } from "./borrow-content";
import { WithdrawContent } from "./withdraw-content";
import { RepayContent } from "./repay-content";

export const PoolActionCard = ({
  poolAddress,
  collateralTokenAddress,
  borrowTokenAddress,
  collateralSymbol,
  borrowSymbol,
  collateralLogoUrl,
  borrowLogoUrl,
  borrowTokenDecimals = 18,
  collateralTokenDecimals = 18,
  ltv,
}: PoolActionCardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("Supply");

  const contentProps = {
    poolAddress,
    collateralTokenAddress,
    borrowTokenAddress,
    collateralSymbol,
    borrowSymbol,
    collateralLogoUrl,
    borrowLogoUrl,
    borrowTokenDecimals,
    collateralTokenDecimals,
    ltv,
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Supply":
        return <SupplyContent {...contentProps} />;
      case "Borrow":
        return <BorrowContent {...contentProps} />;
      case "Withdraw":
        return <WithdrawContent {...contentProps} />;
      case "Repay":
        return <RepayContent {...contentProps} />;
      default:
        return null;
    }
  };

  return (
    <Card className="flex h-full w-104 flex-col rounded-none border-neutral-800 bg-neutral-950 gap-0 p-4">
      <ActionTabs activeTab={activeTab} onChange={setActiveTab} />
      <CardContent className="flex flex-1 flex-col gap-3 p-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default PoolActionCard;

export type { PoolActionCardProps, Tab, Mode, RepayMode } from "./types";
