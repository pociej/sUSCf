import { formatBalance, formatTimestamp } from "../lib/dataProcessor";

const HeaderSection = ({
  totalBalance,
  timestamp,
}: {
  totalBalance: bigint;
  timestamp: string;
}) => {
  return (
    <div className="max-w-xl mx-auto mt-8 mb-2 p-6 rounded-lg bg-[#e8e8e8]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          sUSDf Holders Proportion Chart
        </h1>
      </div>
      <div className="space-y-1">
        <p className="font-semibold">
          Total Balance:{" "}
          <span className="font-mono text-primary">
            {formatBalance(totalBalance)}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Data from: {formatTimestamp(timestamp)}
        </p>
      </div>
    </div>
  );
};

export default HeaderSection;
