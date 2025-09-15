import { useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  setChangeQuantity: React.Dispatch<React.SetStateAction<number>>;
  todos: Todo[];
  creatingId: number | null;
};

export const useTrackAmountChange = ({
  setChangeQuantity,
  todos,
  creatingId,
}: Props) => {
  return useEffect(() => {
    setChangeQuantity(
      todos.filter(d => !d.completed && d.id !== creatingId).length,
    );
  }, [todos, creatingId]);
};
