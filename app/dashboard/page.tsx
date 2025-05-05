"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";

import { PlusIcon } from "@heroicons/react/24/outline";

import Heading from "../ui/heading";
import Button from "../ui/button";
import ProductCard from "../ui/product_card";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const router = useRouter();

  return (
    <>
      <Heading title="Dashboard" />
      <div className="flex w-full">
        <Button fullWidth={true} onClick={() => router.push("/create-project")}>
          <PlusIcon className="w-5 h-5 sm:w-7 sm:h-7" />
          <div>Create Project</div>
        </Button>
      </div>
      <hr className="w-full mt-3" />
      <p className="mt-4 text-xl text-black">Project Overview</p>
      <div className="w-full h-screen flex-1 overflow-x-hidden overflow-y-auto gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </>
  );
};

export default Page;
