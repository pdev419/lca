import { weightToKg, weightToT, distanceToKm } from "./convert_unit";
import { emissions } from "../lib/emissions";

// Define the type for calculation log
interface CalcLog {
  [key: string]: string[] | undefined;
}

const calculateResult = async (project: any) => {
  let result: number = 0;
  let resultUnit: string = "kg";
  let calc_log: CalcLog = {};

  // Material
  const materialWeight: number = weightToKg(project.amount, project.amount_unit) * emissions.Material[project.material as keyof typeof emissions.Material];
  calc_log = { 
    ...calc_log,
    "Materials": [
      `- Material: ${project.material}`,
      `- Amount: ${weightToKg(project.amount, project.amount_unit)} kg`,
      `- Emission Factor: ${emissions.Material[project.material as keyof typeof emissions.Material]} kg CO2e / kg`,
      `- Calculated Impact: ${weightToKg(project.amount, project.amount_unit)} × ${emissions.Material[project.material as keyof typeof emissions.Material]} = ${materialWeight} kg CO2e`
    ]
  };

  // Transport
  const transportWeight = weightToT(
    project.transport_weight,
    project.transport_weight_unit
  ) * emissions.Transport[project.transport_method as keyof typeof emissions.Transport] * distanceToKm(project.distance, project.distance_unit);
  calc_log = { 
    ...calc_log,
    "Transport": [
      `- Method: ${project.transport_method}`,
      `- Weight: ${weightToT(
        project.transport_weight,
        project.transport_weight_unit
      )} t`,
      `- Distance: ${distanceToKm(project.distance, project.distance_unit)} km`,
      `- Emission Factor: ${emissions.Transport[project.transport_method as keyof typeof emissions.Transport]} kg CO2e / ton-km`,
      `- Calculated Impact: ${weightToT(
        project.transport_weight,
        project.transport_weight_unit
      )} × ${distanceToKm(project.distance, project.distance_unit)} × ${emissions.Transport[project.transport_method as keyof typeof emissions.Transport]} = ${transportWeight} kg CO2e`
    ]
  };

  // Energy
  const energyWeight = Number(project.consumption) * emissions.Energy[project.energy_source as keyof typeof emissions.Energy];
  calc_log = { 
    ...calc_log,
    "Energy": [
      `- Energy Type: ${project.energy_source}`,
      `- Consumption: ${project.consumption} kWh`,
      `- Emission Factor: ${emissions.Energy[project.energy_source as keyof typeof emissions.Energy]} kg CO2e / kWh`,
      `- Calculated Impact: ${project.consumption} × ${emissions.Energy[project.energy_source as keyof typeof emissions.Energy]} = ${energyWeight} kg CO2e`
    ]
  };

  // Waste
  const wasteQuantity = weightToKg(project.waste_quantity, project.waste_quantity_unit) * emissions.Waste[project.waste_type as keyof typeof emissions.Waste];
  calc_log = { 
    ...calc_log,
    "Waste": [
      `- Waste Type: ${project.waste_type}`,
      `- Quantity: ${weightToKg(project.waste_quantity, project.waste_quantity_unit)} kg`,
      `- Emission Factor: ${emissions.Waste[project.waste_type as keyof typeof emissions.Waste]} kg CO2e / kg`,
      `- Calculated Impact: ${weightToKg(project.waste_quantity, project.waste_quantity_unit)} × ${emissions.Waste[project.waste_type as keyof typeof emissions.Waste]} = ${wasteQuantity} kg CO2e`
    ]
  };
  
  result = (materialWeight || 0) + (transportWeight || 0) + (energyWeight || 0) + (wasteQuantity || 0) ;
  calc_log = {
    ...calc_log,
    "Result": [
      `- Materials: ${materialWeight} kg CO2e`,`- Transport: ${transportWeight} kg CO2e`,`- Energy: ${energyWeight} kg CO2e`,`- Waste: ${wasteQuantity} kg CO2e`,`- Total: ${result} kg CO2e`
    ]

  }

  // Handle unit
  if (result > 1000) {
    resultUnit = "t";
    result /= 1000;
  } else if (result < 1) {
    resultUnit = "g";
    result *= 1000;
  }

  return [
    `${materialWeight}`,
    `${transportWeight}`,
    `${energyWeight}`,
    `${wasteQuantity}`,
    `${result}`,
    resultUnit,
    calc_log
  ];
};

export { calculateResult };

