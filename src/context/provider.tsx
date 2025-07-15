import { useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { ErrorKind } from "@/types";
import { API_ENDPOINT } from "@/constants";
import { DataContext } from "./index";
import { dataReducer } from "./reducer";
import { parseApiResponse } from "@/types";
import debug from "debug";

const log = debug("stablewatch:DataProvider");

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dataReducer, {
    status: "loading",
    excludeSmallEOA: false,
    treatGnosisSafeAsEOA: false,
  });

  const setExcludeSmallEOA = (v: boolean) => {
    dispatch({ type: "SET_EXCLUDE_SMALL_EOA", payload: v });
  };

  const setTreatGnosisSafeAsEOA = (v: boolean) => {
    dispatch({ type: "SET_TREAT_GNOSIS_SAFE_AS_EOA", payload: v });
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          dispatch({ type: "FETCH_ERROR", payload: ErrorKind.FETCH_ERROR });
          return;
        }
        const result = await response.json();
        const parsed = parseApiResponse(result);
        if (parsed.success) {
          dispatch({ type: "FETCH_SUCCESS", payload: parsed.data });
        } else {
          dispatch({ type: "FETCH_ERROR", payload: ErrorKind.PARSING_ERROR });
          log(ErrorKind.PARSING_ERROR, "Parsing error:", parsed.error);
        }
      } catch (e) {
        dispatch({ type: "FETCH_ERROR", payload: ErrorKind.FETCH_ERROR });
        log(ErrorKind.FETCH_ERROR, "Fetch error:", e);
      }
    };
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{ ...state, setExcludeSmallEOA, setTreatGnosisSafeAsEOA }}
    >
      {children}
    </DataContext.Provider>
  );
};
