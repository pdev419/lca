import { NextPage } from "next";
import InputRow from "./input_row";
import Input from "../ui/input";
import Dropdown from "../ui/dropdown";

import { handleNumberInput } from "../utils/handle_number_input";

interface Props {
  wasteType?: string;
  wasteQuantity?: string;
  wasteQuantityUnit?: string;
  setWasteType: (wasteType: string) => void;
  setWasteQuantity: (wasteQuantity: string) => void;
  setWasteQuantityUnit: (wasteQuantityUnit: string) => void;
}

const WasteInput: NextPage<Props> = ({
  wasteType,
  wasteQuantity,
  wasteQuantityUnit,
  setWasteType,
  setWasteQuantity,
  setWasteQuantityUnit,
}) => {
  return (
    <div className="w-full mt-2 flex-1 flex flex-col gap-8 overflow-x-hidden overflow-y-auto">
      <InputRow label="Waste Type">
        <Dropdown
          options={[
            "Plastic (Landfill)",
            "Paper (Recycling)",
            "Organic Waste (Compost)",
          ]}
          value={wasteType}
          placeholder="Select Type"
          onChange={setWasteType}
        />
      </InputRow>
      <InputRow label="Quantity">
        <div className="flex flex-row gap-2">
          <div className="flex-1">
            <Input
              value={wasteQuantity}
              placeholder="Quantity"
              fullWidth={true}
              onChange={(value) => {
                handleNumberInput(value, setWasteQuantity);
              }}
            />
          </div>
          <div className="w-20">
            <Dropdown
              options={["kg", "g", "t"]}
              value={wasteQuantityUnit}
              onChange={setWasteQuantityUnit}
            />
          </div>
        </div>
      </InputRow>
    </div>
  );
};

export default WasteInput;
