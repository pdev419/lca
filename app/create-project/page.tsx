"use client";

import { NextPage } from "next";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";

import Heading from "../ui/heading";
import TabView from "../ui/tabview";
import Button from "../ui/button";

import MaterialsInput from "./materials_input";
import TransportInput from "./transport_input";
import EnergyInput from "./energy_input";
import WasteInput from "./waste_input";
import Input from "../ui/input";

interface Props {}

// Create a client component that uses useSearchParams
function CreateProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const isEditMode = !!projectId;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentTab, setCurrentTab] = useState("Materials");

  const [title, setTitle] = useState<string | undefined>(undefined);

  // Material Input
  const [material, setMaterial] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState("0");
  const [amountUnit, setAmountUnit] = useState("kg");

  // Transport Input
  const [distance, setDistance] = useState<string | undefined>(undefined);
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [transportMethod, setTransportMethod] = useState<string | undefined>(
    undefined
  );
  const [transportWeight, setTransportWeight] = useState<string | undefined>(
    undefined
  );
  const [transportWeightUnit, setTransportWeightUnit] = useState("kg");

  // Energy Input
  const [energySource, setEnergySource] = useState<string | undefined>(
    undefined
  );
  const [consumption, setConsumption] = useState<string | undefined>(undefined);

  // Waste Input
  const [wasteType, setWasteType] = useState<string | undefined>(undefined);
  const [wasteQuantity, setWasteQuantity] = useState<string | undefined>(
    undefined
  );
  const [wasteQuantityUnit, setWasteQuantityUnit] = useState("kg");

  // Fetch project data if in edit mode
  useEffect(() => {
    if (isEditMode && projectId) {
      const fetchProject = async () => {
        try {
          const { data, error } = await supabase
            .from("project")
            .select("*")
            .eq("id", projectId)
            .single();

          if (error) throw error;

          if (data) {
            setTitle(data.title);
            setMaterial(data.material);
            setAmount(data.amount);
            setAmountUnit(data.amount_unit);
            setDistance(data.distance);
            setDistanceUnit(data.distance_unit);
            setTransportMethod(data.transport_method);
            setTransportWeight(data.transport_weight);
            setTransportWeightUnit(data.transport_weight_unit);
            setEnergySource(data.energy_source);
            setConsumption(data.consumption);
            setWasteType(data.waste_type);
            setWasteQuantity(data.waste_quantity);
            setWasteQuantityUnit(data.waste_quantity_unit);
          }
        } catch (error: any) {
          console.error("Error fetching project:", error);
          setErrorMessage("Failed to load project data");
        }
      };

      fetchProject();
    }
  }, [isEditMode, projectId]);

  // Save project to Supabase
  const saveProject = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      if (
        !(
          title &&
          material &&
          amount &&
          amountUnit &&
          distance &&
          distanceUnit &&
          transportMethod &&
          transportWeight &&
          transportWeightUnit &&
          energySource &&
          consumption &&
          wasteType &&
          wasteQuantity &&
          wasteQuantityUnit
        )
      ) {
        throw { message: "Please make sure you have entered all the fields." };
      }

      // Collect all data into a project object
      const projectData = {
        title: title,
        edited_at: new Date().toISOString(),
        material: material,
        amount: amount,
        amount_unit: amountUnit,
        distance: distance,
        distance_unit: distanceUnit,
        transport_method: transportMethod,
        transport_weight: transportWeight,
        transport_weight_unit: transportWeightUnit,
        energy_source: energySource,
        consumption: consumption,
        waste_type: wasteType,
        waste_quantity: wasteQuantity,
        waste_quantity_unit: wasteQuantityUnit,
      };

      let data;
      let error;

      if (isEditMode && projectId) {
        // Update existing project
        const result = await supabase
          .from("project")
          .update({ ...projectData, result: null, result_unit: null })
          .eq("id", projectId)
          .select();
        data = result.data;
        error = result.error;
      } else {
        // Create new project
        const result = await supabase
          .from("project")
          .insert({ ...projectData, result: null, result_unit: null })
          .select();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      if (!data || (data && data.length === 0)) {
        throw { message: "Save failed" };
      } else {
        console.log("Project saved successfully:", data);

        // Redirect to result page
        router.push(`/result/${data[0].id}`);
      }
    } catch (error: any) {
      console.error("Error saving project:", error);
      setErrorMessage(error.message || "Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl items-center mx-auto px-4 sm:px-6 md:px-8 flex flex-col min-h-full">
      <Heading title={isEditMode ? "Edit Project" : "Create Project"} />
      {errorMessage && (
        <div className="w-full p-4 mb-4 bg-red-50 text-red-600 rounded-md">
          {errorMessage}
        </div>
      )}
      <div className="w-full my-4 items-center flex flex-row gap-4">
        <div className="text-xl">Title</div>
        <div className="flex-1">
          <Input
            value={title}
            placeholder="Enter the Project Title"
            fullWidth={true}
            onChange={(value: string) => setTitle(value as any)}
          />
        </div>
      </div>
      <div className="w-full py-6">
        <TabView
          onChangeTab={(tab) => {
            setCurrentTab(tab);
          }}
        />
      </div>

      {currentTab === "Materials" && (
        <MaterialsInput
          material={material}
          amountUnit={amountUnit}
          amount={amount}
          setMaterial={(value) => setMaterial(value as any)}
          setAmountUnit={setAmountUnit}
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
          wasteQuantityUnit={wasteQuantityUnit}
          setWasteType={(value: string) => setWasteType(value as any)}
          setWasteQuantity={(value: string) => setWasteQuantity(value as any)}
          setWasteQuantityUnit={setWasteQuantityUnit}
        />
      )}

      <div className="w-full mt-6 mb-6 sm:w-sm">
        <Button
          fullWidth={true}
          color="blue"
          disabled={isLoading}
          onClick={saveProject}
        >
          <div>{isEditMode ? "Update" : "Create"}</div>
        </Button>
      </div>
    </div>
  );
}

// This is the main page component with suspense boundary
const Page: NextPage<Props> = ({}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateProjectContent />
    </Suspense>
  );
};

export default Page;
