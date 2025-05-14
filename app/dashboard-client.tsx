"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "./ui/button";
import ProductCard from "./ui/product_card";

interface Project {
  id: string;
  title: string;
  edited_at: string;
  result?: string;
  result_unit?: string;
}

interface Props {
  projects: Project[];
}

export default function DashboardClient({ projects: initialProjects }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleDeleteProject = (projectId: string) => {
    // Update local state to remove the deleted project
    setProjects(projects.filter((project) => project.id !== projectId));

    // Refresh the router to update server data
    router.refresh();
  };

  return (
    <>
      <div className="flex w-full">
        <Button fullWidth={true} onClick={() => router.push("/create-project")}>
          <PlusIcon className="w-5 h-5 sm:w-7 sm:h-7" />
          <div>Create Project</div>
        </Button>
      </div>
      <hr className="w-full mt-3" />
      <p className="mt-4 text-xl text-black">Project Overview</p>
      <div className="w-full h-full flex-1 overflow-x-hidden overflow-y-auto gap-2">
        {projects.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No projects found. Create a new project to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProductCard
                key={project.id}
                id={project.id}
                title={project.title}
                result={project.result}
                resultUnit={project.result_unit}
                editedAt={project.edited_at}
                onDelete={() => handleDeleteProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
