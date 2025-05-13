"use client";

import { NextPage } from "next";

import Dropdown from "../ui/dropdown";
import Input from "../ui/input";
import InputRow from "./input_row";

import { handleNumberInput } from "../utils/handle_number_input";

interface Props {
  material?: string;
  amountUnit?: string;
  amount?: string;
  setMaterial: (material: string | undefined) => void;
  setAmountUnit: (amountUnit: string) => void;
  setAmount: (amount: string) => void;
}

const material_list = ["Aluminum", "Steel", "Recycled Paper"];

const MaterialsInput: NextPage<Props> = ({
  material,
  amountUnit,
  amount,
  setMaterial,
  setAmountUnit,
  setAmount,
}) => {
  return (
    <div className="w-full mt-2 flex-1 flex flex-col gap-4 sm:gap-8 overflow-x-hidden overflow-y-auto">
      <InputRow label="Material">
        <Dropdown
          options={material_list}
          value={material}
          placeholder="Select"
          onChange={setMaterial}
        />
      </InputRow>
      <InputRow label="Amount">
        <div className="flex flex-row gap-2">
          <div className="flex-1">
            <Input
              value={`${amount}`}
              placeholder="0"
              fullWidth={true}
              onChange={(value) => {
                handleNumberInput(value, setAmount);
              }}
            />
          </div>
          <div className="w-16 sm:w-20">
            <Dropdown
              options={["kg", "g", "t"]}
              value={amountUnit}
              onChange={setAmountUnit}
            />
          </div>
        </div>
      </InputRow>
      <div className="flex-1" />
    </div>
  );
};

export default MaterialsInput;
