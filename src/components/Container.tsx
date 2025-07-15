import { useDataContext } from "@/context/useDataContext";
import { ErrorKind } from "../types";
import HeaderSection from "./HeaderSection";
import PieChart from "./PieChart";
import Controls from "./Controls";
import { match } from "ts-pattern";
import type { ChartData } from "../types";
const Loader = () => {
  // TODO: Replace with <Skeleton /> from shadcn/ui
  return (
    <div
      role="status"
      className="flex items-center justify-center py-8 text-muted-foreground"
    >
      Loading...
    </div>
  );
};

const ErrorHandler = ({ error }: { error: ErrorKind }) => {
  const errorMessage =
    error === ErrorKind.FETCH_ERROR
      ? "Failed to fetch data from the API"
      : "Failed to parse the API response";
  // TODO: Replace with <Alert variant=\"destructive\" /> from shadcn/ui
  return (
    <div
      role="alert"
      className="flex items-center justify-center py-8 text-destructive border border-destructive bg-destructive/10 rounded-md"
    >
      Error: {errorMessage}
    </div>
  );
};

const Container = () => {
  const dataContext = useDataContext();

  return match(dataContext)
    .with({ status: "loading" }, () => <Loader />)
    .with(
      { status: "error" },
      (dataContext: { status: "error"; error: ErrorKind }) => (
        <ErrorHandler error={dataContext.error} />
      )
    )
    .with(
      { status: "success" },
      (dataContext: {
        status: "success";
        chartData: ChartData;
        totalBalance: bigint;
        timestamp: string;
        excludeSmallEOA: boolean;
        treatGnosisSafeAsEOA: boolean;
        setExcludeSmallEOA: (v: boolean) => void;
        setTreatGnosisSafeAsEOA: (v: boolean) => void;
      }) => (
        <div className="flex flex-col items-center justify-center">
          <HeaderSection
            totalBalance={dataContext.totalBalance}
            timestamp={dataContext.timestamp}
          />
          <PieChart chartData={dataContext.chartData} />
          <Controls
            excludeSmallEOA={dataContext.excludeSmallEOA}
            setExcludeSmallEOA={dataContext.setExcludeSmallEOA}
            treatGnosisSafeAsEOA={dataContext.treatGnosisSafeAsEOA}
            setTreatGnosisSafeAsEOA={dataContext.setTreatGnosisSafeAsEOA}
          />
        </div>
      )
    )
    .otherwise(() => <Loader />);
};

export default Container;
