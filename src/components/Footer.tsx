import React from 'react';
import { FilterTodos } from './FilterTodos';
import { Status } from '../types/Status';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  completedTodosCount: number;
  status: Status;
  setStatus: (value: Status) => void;
  preparedTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  focusInput: () => void;
  handleError: (value: string) => void;
}

export const Footer: React.FC<Props> = ({
  status,
  setStatus,
  completedTodosCount,
  preparedTodos,
  setTodos,
  focusInput,
  handleError,
}) => {
  const completedTodos = preparedTodos.filter(todo => todo.completed);

  const hendlerDestroyAll = () => {
    completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prevElement =>
            prevElement.filter(value => value.id !== todo.id),
          );
        })
        .catch(() => {
          handleError('Unable to delete a todo');
        }),
    );
    focusInput();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {completedTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <FilterTodos status={status} setStatus={setStatus} />
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={hendlerDestroyAll}
        disabled={!(completedTodos.length > 0)}
      >
        Clear completed
      </button>
    </footer>
  );
};
