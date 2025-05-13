import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { calculateResult } from "@/app/utils/calculate_result";
import ResultClient from "./result-client";

export default async function ResultPage({
  params,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const result = await getCalculationResult(params.id);

  if (!result) {
    notFound();
  }

  return <ResultClient calculationResult={result} />;
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

// Generate static params if needed
// export async function generateStaticParams() {
//   return [{ id: '1' }, { id: '2' }];
// }
