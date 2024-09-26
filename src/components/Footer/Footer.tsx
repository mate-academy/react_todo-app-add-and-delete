import { Todo } from '../../types/Todo';
import { ErrorTypes, FilterTypes } from '../../types/enums';
import { Filter } from './Filter';
import { deleteTodos } from '../../api/todos';
import { handleError, createItemsLeft } from '../../utils/services';
import { useMemo } from 'react';

type Props = {
  filterBy: FilterTypes;
  setFilterBy: (filterBy: FilterTypes) => void;
  todos: Todo[];
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsFocused: (isFocused: boolean) => void;
  setErrorMessage: (errorMessage: ErrorTypes) => void;
};

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  setIsLoading,
  todos,
  setTodos,
  setIsFocused,
  setErrorMessage,
}) => {
  const isSomeTodoCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const onDelete = (completedTodos: Todo[]) => {
    completedTodos.map(completedTodo => {
      setIsLoading(prev => [...prev, completedTodo.id]);

      deleteTodos(completedTodo.id)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== completedTodo.id),
          );
          setIsFocused(true);
        })
        .catch(() => handleError(ErrorTypes.OnDelErr, setErrorMessage))
        .finally(() => setIsLoading([]));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {createItemsLeft(todos)} items left
      </span>

      <Filter filterBy={filterBy} setFilterBy={setFilterBy} />

      <button
        type="button"
        className={'todoapp__clear-completed'}
        disabled={!isSomeTodoCompleted}
        data-cy="ClearCompletedButton"
        onClick={() => onDelete(todos.filter(todo => todo.completed))}
      >
        Clear completed
      </button>
    </footer>
  );
};
