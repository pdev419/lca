"use client";

import { NextPage } from "next";
import { useState } from "react";

import Heading from "../ui/heading";
import TabView from "../ui/tabview";
import Button from "../ui/button";

import MaterialsInput from "./materials_input";
import TransportInput from "./transport_input";
import EnergyInput from "./energy_input";
import WasteInput from "./waste_input";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  // Matherial Input
  const [currentTab, setCurrentTab] = useState("Materials");
  const [material, setMaterial] = useState(undefined);
  const [materialUnit, setMaterialUnit] = useState("kg");
  const [amount, setAmount] = useState("0");

  // Transport Input
  const [distance, setDistance] = useState(undefined);
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [transportMethod, setTransportMethod] = useState(undefined);
  const [transportWeight, setTransportWeight] = useState(undefined);
  const [transportWeightUnit, setTransportWeightUnit] = useState("kg");

  // Energy Input
  const [energySource, setEnergySource] = useState(undefined);
  const [consumption, setConsumption] = useState(undefined);

  // Waste Input
  const [wasteType, setWasteType] = useState(undefined);
  const [wasteQuantity, setWasteQuantity] = useState(undefined);
  const [wastQuantityUnit, setWasteQuantityUnit] = useState("kg");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col min-h-full">
      <Heading title="Create Project" />
      <div className="py-6">
        <TabView
          onChangeTab={(tab) => {
            setCurrentTab(tab);
          }}
        />
      </div>
      {currentTab === "Materials" && (
        <MaterialsInput
          material={material}
          materialUnit={materialUnit}
          amount={amount}
          setMaterial={(value) => setMaterial(value as any)}
          setMaterialUnit={setMaterialUnit}
          setAmount={setAmount}
        />
      )}
      {currentTab === "Transport" && (
        <TransportInput
          distance={distance}
          distanceUnit={distanceUnit}
          transportMethod={transportMethod}
          transportWeight={transportWeight}
          transportWeightUnit={transportWeightUnit}
          setDistance={(value: string) => setDistance(value as any)}
          setDistanceUnit={setDistanceUnit}
          setTransportMethod={(value: string) =>
            setTransportMethod(value as any)
          }
          setTransportWeight={(value: string) =>
            setTransportWeight(value as any)
          }
          setTransportWeightUnit={setTransportWeightUnit}
        />
      )}
      {currentTab === "Energy" && (
        <EnergyInput
          energySource={energySource}
          consumption={consumption}
          setEnergySource={(value: string) => setEnergySource(value as any)}
          setConsumption={(value: string) => setConsumption(value as any)}
        />
      )}
      {currentTab === "Waste" && (
        <WasteInput
          wasteType={wasteType}
          wasteQuantity={wasteQuantity}
          wasteQuantityUnit={wastQuantityUnit}
          setWasteType={(value: string) => setWasteType(value as any)}
          setWasteQuantity={(value: string) => setWasteQuantity(value as any)}
          setWasteQuantityUnit={setWasteQuantityUnit}
        />
      )}
      <div className="w-full mb-6">
        <Button
          onClick={() => {
            console.log("asdf");
          }}
          fullWidth={true}
          color="blue"
        >
          <div>Calculate</div>
        </Button>
      </div>
    </div>
  );
};

export default Page;
