import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  showFilteredTodos: (array: Todo[]) => void;
  onTodoDelete: (todoIds: number[]) => void;
};

enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const Footer: React.FC<Props> = ({
  todos,
  showFilteredTodos,
  onTodoDelete,
}) => {
  const [todosLeftCount, setTodosLeftCount] = useState(todos.length);
  const [finishedTodos, setFinishedTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.ALL);

  const showTodosLeftCount = () => {
    const completedTodos = todos.filter(todo => !todo.completed);

    setTodosLeftCount(completedTodos.length);
  };

  const showClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setFinishedTodos(completedTodos);
  };

  const onClearCompleted = async () => {
    const todosToRemove = finishedTodos.map(todo => todo.id);

    onTodoDelete(todosToRemove);
  };

  const allTodos = () => {
    setCurrentFilter(Filter.ALL);
    showFilteredTodos(todos);
  };

  const activeTodos = () => {
    const filteredArray = todos.filter(todo => !todo.completed);

    setCurrentFilter(Filter.ACTIVE);
    showFilteredTodos(filteredArray);
  };

  const completedTodos = () => {
    const filteredArray = todos.filter(todo => todo.completed);

    setCurrentFilter(Filter.COMPLETED);
    showFilteredTodos(filteredArray);
  };

  useEffect(() => {
    showFilteredTodos(todos);
    showTodosLeftCount();
    showClearCompleted();
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeftCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: currentFilter === Filter.ALL },
          )}
          onClick={allTodos}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link', { selected: currentFilter === Filter.ACTIVE },
          )}
          onClick={activeTodos}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: currentFilter === Filter.COMPLETED },
          )}
          onClick={completedTodos}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={finishedTodos.length === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
