import React from 'react';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {
  todos: Todo[] | null;
  setTodos: (todos: Todo[]) => void;
  setIsLoading: (el: boolean) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  setIsError: (el: boolean) => void;
  ErrorMessages: { None: string; Delete: string };
  setErrorMessage: (msg: string) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  setIsLoading,
  statusFilter,
  setStatusFilter,
  setIsError,
  ErrorMessages,
  setErrorMessage,
}) => {
  const setStatus = (
    val: string,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setStatusFilter(val);
  };

  const removeTodo = async (id: number) => {
    setIsLoading(true);
    try {
      await client.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setIsError(true);
      setErrorMessage(ErrorMessages.Delete);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos?.filter(todo => todo.completed);

    completedTodos?.forEach(todo => {
      removeTodo(todo.id);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos && todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${statusFilter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={event => {
            setStatus('all', event);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${statusFilter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={event => {
            setStatus('active', event);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${statusFilter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={event => {
            setStatus('completed', event);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos?.filter(todo => todo.completed).length === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
