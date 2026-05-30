export type { FilterType } from './FilterType';

export interface Todo {
  id: number | string;
  userId: number;
  title: string;
  completed: boolean;
  isTemp?: boolean;
}
