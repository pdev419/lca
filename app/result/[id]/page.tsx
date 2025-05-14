import ResultPageClient from "./page-client";

type ResultPageProps = Promise<{ id: string }>;

const ResultPage = async ({ params }: { params: ResultPageProps }) => {
  const { id } = await params;

  return <ResultPageClient id={id} />;
};

export default ResultPage;
