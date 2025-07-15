import type { AppState, DataAction, ChartData, ApiResponse } from "../types";
import { processApiResponse } from "../lib/dataProcessor";
import { SMALL_BALANCE_THRESHOLD } from "../constants";
import { ErrorKind } from "../types";

// Helper to build the 'success' state
function buildSuccessState({
  data,
  chartData,
  excludeSmallEOA,
  treatGnosisSafeAsEOA,
}: {
  data: ApiResponse;
  chartData: ChartData;
  excludeSmallEOA: boolean;
  treatGnosisSafeAsEOA: boolean;
}): AppState {
  return {
    status: "success",
    data,
    chartData,
    totalBalance: chartData.totalBalance,
    timestamp: chartData.timestamp,
    excludeSmallEOA,
    treatGnosisSafeAsEOA,
  };
}

export function dataReducer(state: AppState, action: DataAction): AppState {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        status: "loading",
        excludeSmallEOA: state.excludeSmallEOA,
        treatGnosisSafeAsEOA: state.treatGnosisSafeAsEOA,
      };
    case "FETCH_SUCCESS": {
      let chartData: ChartData;
      try {
        chartData = processApiResponse(action.payload, {
          excludeSmallEOA: state.excludeSmallEOA,
          treatGnosisSafeAsEOA: state.treatGnosisSafeAsEOA,
          smallBalanceThreshold: SMALL_BALANCE_THRESHOLD,
        });
      } catch {
        return {
          status: "error",
          error: ErrorKind.PARSING_ERROR,
          excludeSmallEOA: state.excludeSmallEOA,
          treatGnosisSafeAsEOA: state.treatGnosisSafeAsEOA,
        };
      }
      return buildSuccessState({
        data: action.payload,
        chartData,
        excludeSmallEOA: state.excludeSmallEOA,
        treatGnosisSafeAsEOA: state.treatGnosisSafeAsEOA,
      });
    }
    case "FETCH_ERROR":
      return {
        status: "error",
        error: action.payload,
        excludeSmallEOA: state.excludeSmallEOA,
        treatGnosisSafeAsEOA: state.treatGnosisSafeAsEOA,
      };
    case "SET_EXCLUDE_SMALL_EOA": {
      if (state.status === "success") {
        let chartData: ChartData;
        try {
          chartData = processApiResponse(state.data, {
            excludeSmallEOA: action.payload,
            treatGnosisSafeAsEOA: state.treatGnosisSafeAsEOA,
            smallBalanceThreshold: SMALL_BALANCE_THRESHOLD,
          });
        } catch {
          return {
            status: "error",
            error: ErrorKind.PARSING_ERROR,
            excludeSmallEOA: action.payload,
            treatGnosisSafeAsEOA: state.treatGnosisSafeAsEOA,
          };
        }
        return buildSuccessState({
          data: state.data,
          chartData,
          excludeSmallEOA: action.payload,
          treatGnosisSafeAsEOA: state.treatGnosisSafeAsEOA,
        });
      }
      // For loading or error, just update excludeSmallEOA
      console.log("reducer", state);
      return { ...state, excludeSmallEOA: action.payload };
    }
    case "SET_TREAT_GNOSIS_SAFE_AS_EOA": {
      if (state.status === "success") {
        let chartData: ChartData;
        try {
          chartData = processApiResponse(state.data, {
            excludeSmallEOA: state.excludeSmallEOA,
            treatGnosisSafeAsEOA: action.payload,
            smallBalanceThreshold: SMALL_BALANCE_THRESHOLD,
          });
        } catch {
          return {
            status: "error",
            error: ErrorKind.PARSING_ERROR,
            excludeSmallEOA: state.excludeSmallEOA,
            treatGnosisSafeAsEOA: action.payload,
          };
        }
        return buildSuccessState({
          data: state.data,
          chartData,
          excludeSmallEOA: state.excludeSmallEOA,
          treatGnosisSafeAsEOA: action.payload,
        });
      }
      // For loading or error, just update treatGnosisSafeAsEOA
      return { ...state, treatGnosisSafeAsEOA: action.payload };
    }
    default:
      return state;
  }
}
