import type {
  ApiResponse,
  DataEntry,
  ProcessedHolder,
  ChartData,
  FilterOptions,
} from "../types";
import { HolderType } from "../types";
import { SMALL_BALANCE_THRESHOLD } from "../constants";

export const processApiResponse = (
  apiResponse: ApiResponse,
  filters: FilterOptions = {
    excludeSmallEOA: false,
    treatGnosisSafeAsEOA: false,
    smallBalanceThreshold: SMALL_BALANCE_THRESHOLD,
  }
): ChartData => {
  const mostRecentData = apiResponse.data[0];

  if (!mostRecentData) {
    throw new Error("No data available in API response");
  }

  return processDataEntry(mostRecentData, filters);
};

const processDataEntry = (
  dataEntry: DataEntry,
  filters: FilterOptions
): ChartData => {
  const { holderData, timestamp } = dataEntry;
  const { holdersData } = holderData;

  const holdersArray: ProcessedHolder[] = Object.entries(holdersData).map(
    ([address, data]) => ({
      address,
      balance: BigInt(data.balance),
      type: determineHolderType(
        data.type,
        data.entity,
        filters.treatGnosisSafeAsEOA
      ),
    })
  );

  const filteredHolders = applyFilters(holdersArray, filters);

  const eoaBalance = filteredHolders
    .filter((holder) => holder.type === HolderType.EOA)
    .reduce((sum, holder) => sum + holder.balance, BigInt(0));

  const scBalance = filteredHolders
    .filter((holder) => holder.type === HolderType.SC)
    .reduce((sum, holder) => sum + holder.balance, BigInt(0));

  const totalBalance = eoaBalance + scBalance;

  return {
    eoaBalance,
    scBalance,
    totalBalance,
    timestamp,
    holders: filteredHolders,
  };
};

const determineHolderType = (
  originalType: HolderType,
  entity?: string,
  treatGnosisSafeAsEOA: boolean = false
): HolderType => {
  if (
    treatGnosisSafeAsEOA &&
    originalType === HolderType.SC &&
    entity === "gnosisSafe"
  ) {
    return HolderType.EOA;
  }
  return originalType;
};

const applyFilters = (
  holders: ProcessedHolder[],
  filters: FilterOptions
): ProcessedHolder[] => {
  return holders.filter((holder) => {
    if (filters.excludeSmallEOA && holder.type === HolderType.EOA) {
      return holder.balance >= filters.smallBalanceThreshold;
    }
    return true;
  });
};

export const formatBalance = (balance: bigint): string => {
  return balance.toString();
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

export const calculatePercentages = (
  chartData: ChartData
): { eoaPercentage: number; scPercentage: number } => {
  if (chartData.totalBalance === BigInt(0)) {
    return { eoaPercentage: 0, scPercentage: 0 };
  }

  const eoaPercentage =
    Number((chartData.eoaBalance * BigInt(10000)) / chartData.totalBalance) /
    100;
  const scPercentage =
    Number((chartData.scBalance * BigInt(10000)) / chartData.totalBalance) /
    100;

  return { eoaPercentage, scPercentage };
};
