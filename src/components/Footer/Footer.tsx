import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';
import { TodoFilter } from '../../types/TodoFelter';

type Props = {
  todos: Todo[];
  setTodos: (updater: ((todos: Todo[]) => Todo[]) | Todo[]) => void;
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  setError: (value: string) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  filter,
  setFilter,
  setError,
}) => {
  const activeLeft = todos.filter(todo => !todo.completed).length
  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const updatedTodos: Todo[] = [...todos];
    let hasErrors = false;
    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);
        const index = updatedTodos.findIndex(t => t.id === todo.id);

        if (index !== -1) {
          updatedTodos.splice(index, 1);
        }
      } catch {
        hasErrors = true;
        setError(`Unable to delete a todo`);
      }
    }

    setTodos(updatedTodos);

    if (hasErrors) {
      setError('Unable to delete a todo');
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilter).map((filterOption) => (
          <a
            key={filterOption}
            href={`#/${filterOption}`}
            className={classNames('filter__link', {
              selected: filter === filterOption,
            })}
            data-cy={`FilterLink${filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}`}
            onClick={() => setFilter(filterOption as TodoFilter)}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </a>
        ))}
    </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!todos.some(todo => todo.completed)}
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
