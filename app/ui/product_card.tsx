import { NextPage } from "next";

interface Props {}

const ProductCard: NextPage<Props> = ({}) => {
  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-3 sm:gap-4 rounded-xl font-bold border-gray-300 border-2 hover:border-blue-400 transition-colors duration-200">
      <div className="text-blue-600 text-[14px] sm:text-[16px]">Product A</div>
      <div className="text-gray-600 text-[13px] sm:text-[15px]">
        1 Product / Process
      </div>
    </div>
  );
};

export default ProductCard;
