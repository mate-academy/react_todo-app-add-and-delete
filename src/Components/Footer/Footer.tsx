import { FC } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  setTodos: (todos: Todo[]) => void;
  filteredTodos: Todo[];
  todos: Todo[];
  setErrors: (errors: Errors) => void;
  setDeleting: (id: number[]) => void;
};

export const Footer: FC<Props> = ({
  filter,
  setFilter,
  setTodos,
  filteredTodos,
  todos,
  setErrors,
  setDeleting,
}) => {
  const clearCompleted = async () => {
    let completed = filteredTodos.filter((todo) => todo.completed);

    completed = filteredTodos.filter((todo) => todo.completed);

    const completedIds = completed.map((todo) => todo.id!);

    setDeleting(completedIds);

    try {
      await Promise.all(
        completed.map(async (todo) => {
          await deleteTodo(todo.id!);
        }),
      );
      const filtered = todos.filter((todo) => !completed.includes(todo));

      setTodos(filtered);
    } catch (error) {
      setErrors({ deleting: true });
    }
  };

  const isCompleted = filteredTodos.some((todo: Todo) => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">3 items left</span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          onClick={() => setFilter(Filter.All)}
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
        >
          All
        </a>

        <a
          href="#/active"
          onClick={() => setFilter(Filter.Active)}
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
        >
          Active
        </a>

        <a
          href="#/completed"
          onClick={() => setFilter(Filter.Completed)}
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {isCompleted && (
        <button
          type="button"
          onClick={clearCompleted}
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
