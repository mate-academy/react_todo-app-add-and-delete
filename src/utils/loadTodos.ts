import { getTodos } from '../api/todos';
import { ErrorMessages } from '../enums/ErrorMessages';
import { Todo } from '../types/Todo';

export const loadTodos = (
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessages>>,
) => {
  getTodos()
    .then(loadedTodos => {
      setTodos(loadedTodos);
    })
    .catch(error => {
      setErrorMessage(ErrorMessages.LOADING_ERROR);
      throw new Error(error);
    });
};
