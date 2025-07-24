import React from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

interface Props {
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsError: React.Dispatch<React.SetStateAction<string | null>>;
  hideErrorMessage: () => void;
}

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  todos,
  setTodos,
  setIsError,
  hideErrorMessage,
}) => {
  const deleteAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const idsToDelete = completedTodos.map(todo => todo.id);

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(todo => !idsToDelete.includes(todo.id)),
        );
      })
      .catch(() => {
        setIsError('Unable to delete todos');
        hideErrorMessage();
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
