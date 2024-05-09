import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Args = {
  onErrorMessage: (errMessage: string) => void;
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  deletedId: number;
  onLoadingItemsIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const removeTodo = ({
  deletedId,
  onTodos,
  onErrorMessage,
  onLoadingItemsIds,
}: Args) => {
  onLoadingItemsIds(prevIds => [...prevIds, deletedId]);

  deleteTodo(deletedId)
    .then(() => {
      onTodos(todos => todos.filter(todoItem => todoItem.id !== deletedId));
    })
    .catch(() => {
      onErrorMessage('Unable to delete a todo');
    })
    .finally(() => {
      onLoadingItemsIds(prevIds => prevIds.filter(id => id !== deletedId));
    });
};
