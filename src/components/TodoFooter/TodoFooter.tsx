import classNames from 'classnames';
import React from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  filterTodos: Todo[],
  filterTodo: string,
  setFilterTodo: (parameter: string) => void,
  completedTodos: Todo[],
  todos: Todo[],
  setTodos: (parameter: Todo[]) => void;
  setError: (parameter: string) => void;
};

export const TodoFooter: React.FC<Props> = ({
  filterTodos,
  filterTodo,
  setFilterTodo,
  completedTodos,
  todos,
  setError,
  setTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const deleteCompletedTodos = async (completed: Todo[]) => {
    try {
      completed.forEach(async (todo) => {
        await deleteTodo(todo.id);

        setTodos([...activeTodos]);
      });
    } catch {
      setError('Unable to delete a todo');
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${filterTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterTodo === 'all' },
          )}
          onClick={() => setFilterTodo('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterTodo === 'active' },
          )}
          onClick={() => setFilterTodo('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterTodo === 'completed' },
          )}
          onClick={() => setFilterTodo('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => deleteCompletedTodos(completedTodos)}
      >
        {completedTodos.length > 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
