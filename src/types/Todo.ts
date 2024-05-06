export interface TodoType {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodosArrayType = TodoType[];
