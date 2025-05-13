"use client";

import { useRef } from "react";
import Heading from "@/app/ui/heading";
import Button from "@/app/ui/button";
import ResultChartClient, { ChartMethods } from "./result-chart-client";

interface ResultClientProps {
  calculationResult: any;
}

export default function ResultClient({ calculationResult }: ResultClientProps) {
  const chartRef = useRef<ChartMethods>(null);

  const onDownloadResult = async () => {
    try {
      // Get access to chart method
      let chartImage = null;

      if (chartRef?.current) {
        chartImage = await chartRef.current.getChartImage();
      }

      const payload = {
        id: calculationResult.id,
        chartImage,
        calc_log: calculationResult.calc_log,
      };

      const response = await fetch("/api/download-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Get blob from response
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lca-result-${calculationResult.title}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 items-center sm:px-6 md:px-8 flex flex-col min-h-full">
      <Heading title={`Result / ${calculationResult.title}`} />
      <div className="w-full h-full mt-6 flex flex-col flex-1 items-center overflow-x-hidden overflow-y-auto gap-2">
        <p className="text-6xl font-bold">
          {calculationResult.result} {calculationResult.resultUnit} CO
          <sub>2</sub>e
        </p>
        <div className="w-full mt-6 flex-1">
          <ResultChartClient
            ref={chartRef}
            calculation={{
              materialWeight: calculationResult.materialWeight,
              transportWeight: calculationResult.transportWeight,
              energyWeight: calculationResult.energyWeight,
              wasteQuantity: calculationResult.wasteQuantity,
            }}
          />
        </div>
      </div>
      <div className="w-full mt-6 mb-6 sm:w-sm">
        <Button
          fullWidth={true}
          color="blue"
          disabled={false}
          onClick={onDownloadResult}
        >
          <div>Download Result</div>
        </Button>
      </div>
    </div>
  );
}
