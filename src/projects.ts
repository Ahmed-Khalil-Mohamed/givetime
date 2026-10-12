import { givetime } from "../apps/givetime/domain";
export const projects = [givetime];
export const findProject = (id: string) =>
  projects.find((project) => project.id === id);
