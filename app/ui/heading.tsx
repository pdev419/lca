import { NextPage } from "next";

interface Props {
  title: String;
}

const Heading: NextPage<Props> = ({ title }) => {
  return (
    <div className="flex w-full flex-row items-center gap-2 py-4 text-black">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default Heading;
