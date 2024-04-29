import { ITags } from "./tags";

export interface ITask {
  id: string;
  title: string;
  description: string;
  dueAt: string;
  durationMinutes: number;
  tags: ITags[];
}
