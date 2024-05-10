import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Args = {
  deletedId: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingItemsIds: React.Dispatch<React.SetStateAction<number[]>>;
  handleError: (errMessage: string) => void;
};

export const RemoveTodo = ({
  deletedId,
  setTodos,
  setLoadingItemsIds,
  handleError,
}: Args) => {
  setLoadingItemsIds(prevIds => [...prevIds, deletedId]);

  deleteTodo(deletedId)
    .then(() => {
      setTodos(todos => todos.filter(todoItem => todoItem.id !== deletedId));
    })
    .catch(() => {
      handleError('Unable to delete a todo');
    })
    .finally(() => {
      setLoadingItemsIds(prevIds => prevIds.filter(id => id !== deletedId));
    });
};
