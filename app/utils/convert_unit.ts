const weightToKg = (weight: number | string, unit: string) : number => {
  if (unit === "kg") {
    return Number(weight);
  } else if (unit === "g") {
    return Number(weight) / 1000;
  } else if (unit === "t") {
    return Number(weight) * 1000;
  }
  
  // Default return for any other unit to fix the compile error
  return 0;
};

const weightToT = (weight: number | string, unit: string) : number => {
  if (unit === "t") {
    return Number(weight);
  }
  return weightToKg(weight, unit) / 1000;
};

const distanceToKm = (distance: number | string, unit: string) : number => {
  if (unit === "km") {
    return Number(distance);
  } else if (unit === "m") {
    return Number(distance) / 1000;
  } 

  // Default return for any other unit to fix the compile error
  return 0;
};

export { weightToKg, weightToT, distanceToKm };
