import { NextPage } from "next";
import InputRow from "./input_row";
import Input from "../ui/input";
import Dropdown from "../ui/dropdown";

import { handleNumberInput } from "../utils/handle_number_input";

interface Props {
  distance?: string;
  distanceUnit?: string;
  transportMethod?: string;
  transportWeight?: string;
  transportWeightUnit?: string;
  setDistance: (distance: string) => void;
  setDistanceUnit: (distanceUnit: string) => void;
  setTransportMethod: (transportMethod: string) => void;
  setTransportWeight: (transportWeight: string) => void;
  setTransportWeightUnit: (transportWeightUnit: string) => void;
}

const TransportInput: NextPage<Props> = ({
  distance,
  distanceUnit,
  transportMethod,
  transportWeight,
  transportWeightUnit,
  setDistance,
  setDistanceUnit,
  setTransportMethod,
  setTransportWeight,
  setTransportWeightUnit,
}) => {
  return (
    <div className="w-full mt-2 flex-1 flex flex-col gap-8 overflow-x-hidden overflow-y-auto">
      <InputRow label="Distance">
        <div className="flex flex-row gap-2">
          <div className="flex-1">
            <Input
              value={distance}
              placeholder="Distance"
              fullWidth={true}
              onChange={(value) => {
                handleNumberInput(value, setDistance);
              }}
            />
          </div>
          <div className="w-20">
            <Dropdown
              options={["km", "m"]}
              value={distanceUnit}
              onChange={setDistanceUnit}
            />
          </div>
        </div>
      </InputRow>
      <InputRow label="Method">
        <Dropdown
          options={["Truck (EURO 6)", "Air Freight", "Sea Freight"]}
          value={transportMethod}
          placeholder="Select Method"
          onChange={setTransportMethod}
        />
      </InputRow>
      <InputRow label="Weight">
        <div className="flex flex-row gap-2">
          <div className="flex-1">
            <Input
              value={transportWeight}
              placeholder="Weight"
              fullWidth={true}
              onChange={(value) => {
                handleNumberInput(value, setTransportWeight);
              }}
            />
          </div>
          <div className="w-20">
            <Dropdown
              options={["kg", "g", "t"]}
              value={transportWeightUnit}
              onChange={setTransportWeightUnit}
            />
          </div>
        </div>
      </InputRow>
    </div>
  );
};

export default TransportInput;
