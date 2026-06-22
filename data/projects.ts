export type ProjectStatus = "Active" | "In Progress" | "Planned";

export type Project = {
  id: string;
  name: string;
  description: string;
  type: string;
  status: ProjectStatus;
};

export const featuredProjects: Project[] = [
  {
    id: "medifi-base-hub",
    name: "Medifi Base Hub",
    description: "Builder identity hub on Base ecosystem",
    type: "Web3 Dashboard",
    status: "Active",
  },
  {
    id: "coming-soon-1",
    name: "Coming Soon Project 1",
    description: "Placeholder for an upcoming build",
    type: "Coming Soon",
    status: "In Progress",
  },
  {
    id: "coming-soon-2",
    name: "Coming Soon Project 2",
    description: "Placeholder for an upcoming build",
    type: "Coming Soon",
    status: "Planned",
  },
];
