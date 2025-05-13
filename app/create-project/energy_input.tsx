import { NextPage } from "next";
import InputRow from "./input_row";
import Input from "../ui/input";
import Dropdown from "../ui/dropdown";

import { handleNumberInput } from "../utils/handle_number_input";

interface Props {
  energySource?: string;
  consumption?: string;
  setEnergySource: (energySource: string) => void;
  setConsumption: (consumption: string) => void;
}

const EnergyInput: NextPage<Props> = ({
  energySource,
  consumption,
  setEnergySource,
  setConsumption,
}) => {
  return (
    <div className="w-full mt-2 flex-1 flex flex-col gap-8 overflow-x-hidden overflow-y-auto">
      <InputRow label="Energy Source">
        <Dropdown
          options={["Electricity (EU Mix)", "Diesel", "Natural Gas"]}
          value={energySource}
          placeholder="Select Source"
          onChange={setEnergySource}
        />
      </InputRow>
      <InputRow label="Consumption">
        <div className="flex flex-row items-center gap-2">
          <div className="flex-1">
            <Input
              value={consumption}
              placeholder="Consumption"
              fullWidth={true}
              onChange={(value) => {
                handleNumberInput(value, setConsumption);
              }}
            />
          </div>
          <div className="text-2xl text-gray-600">kWh</div>
        </div>
      </InputRow>
    </div>
  );
};

export default EnergyInput;
