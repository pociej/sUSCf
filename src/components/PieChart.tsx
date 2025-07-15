import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";
import { calculatePercentages } from "../lib/dataProcessor";
import { adjustColorLightness } from "../lib/colorUtils";
import type { ChartData } from "../types";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = ({ chartData }: { chartData: ChartData }) => {
  const { eoaPercentage, scPercentage } = calculatePercentages(chartData);
  const backgroundColor = ["#FFD700", "#F29B27"];
  const hoverBackgroundColor = backgroundColor.map((col) =>
    adjustColorLightness(col, -30)
  );

  const pieData = {
    labels: ["EOA (Externally Owned Accounts)", "SC (Smart Contracts)"],
    datasets: [
      {
        label: "Holder Type Distribution",
        data: [eoaPercentage, scPercentage],
        backgroundColor,
        hoverBackgroundColor,
      },
    ],
    plugins: {
      datalabels: {
        formatter: (
          value: number,
          ctx: { dataIndex: number; chart: { data: { labels: string[] } } }
        ) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return `${label}: ${value.toFixed(2)}%`;
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <div className="chart-container mt-12">
        <Pie data={pieData} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default PieChart;
