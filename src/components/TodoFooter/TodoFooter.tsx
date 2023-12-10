import React from 'react';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { deleteTodos } from '../../api/todos';

type Props = {
  todos: Todo[];
  todosArray: Todo[];
  setFilter: (value: Filter) => void;
  filter: Filter;
  setTodos: (value: React.SetStateAction<Todo[]>) => void,
  setTodosError: (error: ErrorMessage) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  todosArray,
  setFilter,
  filter,
  setTodos,
  setTodosError,
}) => {
  const completedTodos = todosArray.filter(todo => todo.completed).length;
  const countTodos = todosArray.filter(todo => !todo.completed).length;

  const deleteTodoHandler = () => {
    const completedTodo = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodo.forEach(el => {
      deleteTodos(el)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
        })
        .catch(() => {
          setTimeout(() => {
            setTodosError(ErrorMessage.UnableToDeleteTodo);
          }, 3000);
        });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav
        className="filter"
        data-cy="Filter"
      >
        <a
          href="#/"
          className={`filter__link ${filter === Filter.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === Filter.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === Filter.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {completedTodos > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          // disabled={!completed}
          onClick={deleteTodoHandler}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
