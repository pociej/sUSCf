import { createContext } from "react";

import type { AppState, AppActions } from "../types";

export const DataContext = createContext<(AppState & AppActions) | undefined>(
  undefined
);
