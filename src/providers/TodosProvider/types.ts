import { useTodos } from '../../CustomHooks/useTodos';

export type TodosContextType = ReturnType<typeof useTodos> & {
  userId: number,
};

export type TodosProviderProps = {
  children: React.ReactNode;
  userId: number;
};
