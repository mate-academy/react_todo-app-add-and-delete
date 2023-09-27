import { useTodosContext } from '../providers/TodosProvider/TodosProvider';
import { TodoType } from '../types/Todo';

export const useNewTodo = () => {
  const { addTodo: addTodoLocally, userId } = useTodosContext();
  const addTodo = (todo: Omit<TodoType, 'id' | 'userId'>) => {
    addTodoLocally({ ...todo, id: Number(new Date()), userId });
  };

  return { addTodo };
};
