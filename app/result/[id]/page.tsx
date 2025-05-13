"use client";

import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useEffect, useState, useRef } from "react";

import Heading from "@/app/ui/heading";
import Button from "@/app/ui/button";
import ResultChartClient, { ChartMethods } from "./result-chart-client";
import { calculateResult } from "@/app/utils/calculate_result";

interface ResultPageProps {
  params: {
    id: string;
  };
}

async function getCalculationResult(id: string) {
  try {
    const { data, error } = await supabase
      .from("project")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      return null;
    }

    const [
      materialWeight,
      transportWeight,
      energyWeight,
      wasteQuantity,
      result,
      resultUnit,
      calc_log,
    ] = await calculateResult(data);

    await saveResult(data.id, result.toString(), resultUnit as string);

    return {
      ...data,
      materialWeight,
      transportWeight,
      energyWeight,
      wasteQuantity,
      result,
      resultUnit,
      calc_log,
    };
  } catch (error) {
    console.error("Failed to fetch result:", error);
    return null;
  }
}

async function saveResult(id: string, result: string, resultUnit: string) {
  const { data, error } = await supabase
    .from("project")
    .update({ result, result_unit: resultUnit })
    .eq("id", id);

  if (error) {
    console.error("Error setting result:", error);
  }
}

const onDownloadResult = (calculationResult: any) => {
  return async () => {
    try {
      // Get access to chart method
      const chartRef = calculationResult.chartRef;
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
};

export default function ResultPage({ params }: ResultPageProps) {
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const chartRef = useRef<ChartMethods>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCalculationResult(params.id);
      if (!result) {
        notFound();
      }
      setCalculationResult({
        ...result,
        chartRef,
      });
    };
    fetchData();
  }, [params.id]);

  if (!calculationResult) {
    return <div>Calculating...</div>;
  }

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
          onClick={onDownloadResult(calculationResult)}
        >
          <div>Download Result</div>
        </Button>
      </div>
    </div>
  );
}

// Generate static params if needed
// export async function generateStaticParams() {
//   return [{ id: '1' }, { id: '2' }];
// }
