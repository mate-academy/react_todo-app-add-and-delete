import React from 'react';
import { FilterTodos } from './FilterTodos';
import { deleteTodo } from '../api/todos';
import { useTodosContext } from '../context/TodoContext';
import { ErrorList } from '../types/ErrorList';

interface Props {
  completedTodosCount: number;
  focusInput: () => void;
}

export const Footer: React.FC<Props> = ({
  completedTodosCount,
  focusInput,
}) => {
  const { setTodos, preparedTodos, handleError } = useTodosContext();

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
          handleError(ErrorList.DeleteTodo);
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
        <FilterTodos />
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
