import { z } from "zod";

export enum HolderType {
  EOA = "eoa",
  SC = "sc",
}

/*
zod validation schema. Never trust the backed. 
MOTE: data are generaly far more complex than this schema but we validate only data 
need to display interface 
*/

const HolderDataSchema = z.object({
  balance: z.string(),
  type: z.enum([HolderType.EOA, HolderType.SC]),
  entity: z.string().optional(),
});

const HoldersDataSchema = z.record(z.string(), HolderDataSchema);

const HolderDataContainerSchema = z.object({
  singleChainTotalSupply: z.string(),
  multichainTotalSupplyEstimate: z.string(),
  holdersData: HoldersDataSchema,
});

const DataEntrySchema = z.object({
  holderData: HolderDataContainerSchema,
  timestamp: z.string(),
});

const ApiResponseSchema = z.object({
  status: z.literal("success"),
  count: z.number(),
  data: z.array(DataEntrySchema),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type DataEntry = z.infer<typeof DataEntrySchema>;
export type HolderDataContainer = z.infer<typeof HolderDataContainerSchema>;
export type HolderData = z.infer<typeof HolderDataSchema>;
export type HoldersData = z.infer<typeof HoldersDataSchema>;

export type HolderWithAddress = {
  address: string;
  data: HolderData;
};

export type ProcessedHolder = {
  balance: bigint;
  type: HolderType;
};

export type ChartData = {
  eoaBalance: bigint;
  scBalance: bigint;
  totalBalance: bigint;
  timestamp: string;
  holders: ProcessedHolder[];
};

export type FilterOptions = {
  excludeSmallEOA: boolean;
  treatGnosisSafeAsEOA: boolean;
  smallBalanceThreshold: bigint;
};

export const parseApiResponse = (data: unknown) => {
  return ApiResponseSchema.safeParse(data);
};

export const parseDataEntry = (data: unknown) => {
  return DataEntrySchema.safeParse(data);
};

export const parseHolderData = (data: unknown) => {
  return HolderDataSchema.safeParse(data);
};

export enum ErrorKind {
  PARSING_ERROR = "PARSING_ERROR",
  FETCH_ERROR = "FETCH_ERROR",
}

export type DataState =
  | { status: "loading" }
  | { status: "error"; error: ErrorKind }
  | {
      status: "success";
      data: ApiResponse;
      chartData: ChartData;
      totalBalance: bigint;
      timestamp: string;
    };

export type FilterState = {
  excludeSmallEOA: boolean;
  treatGnosisSafeAsEOA: boolean;
};

export type AppState = DataState & FilterState;

export type DataAction =
  | { type: "FETCH_INIT" }
  | { type: "FETCH_SUCCESS"; payload: ApiResponse }
  | { type: "FETCH_ERROR"; payload: ErrorKind }
  | { type: "SET_EXCLUDE_SMALL_EOA"; payload: boolean }
  | { type: "SET_TREAT_GNOSIS_SAFE_AS_EOA"; payload: boolean };

export interface AppActions {
  setExcludeSmallEOA: (v: boolean) => void;
  setTreatGnosisSafeAsEOA: (v: boolean) => void;
}
