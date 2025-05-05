import { NextPage } from "next";

interface Props {
  label: string;
  children: React.ReactNode;
}

const InputRow: NextPage<Props> = ({ label, children }) => {
  return (
    <div className="w-full flex flex-col gap-2 sm:gap-4">
      <div className="text-lg sm:text-xl md:text-2xl text-black">{label}</div>
      {children}
    </div>
  );
};

export default InputRow;
