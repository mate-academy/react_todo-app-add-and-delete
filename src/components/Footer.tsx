import React from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filterValue: Filter;
  onClickFilter: (filterValue: Filter) => void;
  setErrorMessage: (message: string) => void;
};

const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  filterValue,
  onClickFilter,
  setErrorMessage,
}) => {
  const isCompleted = todos.some(todo => todo.completed);

  const allNotCompleted = todos.filter(todo => !todo.completed).length;

  const showFilterNavigation = Object.values(Filter).map(value => (
    <a
      key={value}
      href="#/"
      className={cn('filter__link', { selected: filterValue === value })}
      data-cy={`FilterLink${value}`}
      onClick={() => onClickFilter(value)}
    >
      {value}
    </a>
  ));

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deleteCompliteTodos = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      await Promise.all(deleteCompliteTodos);
      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      setErrorMessage('Unable to delete some todos');
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${allNotCompleted} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {showFilterNavigation}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
