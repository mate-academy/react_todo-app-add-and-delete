import classNames from 'classnames';
import React from 'react';

import { Todo } from '../../types/Todo';
import { ErrorType, Filter } from '../../types/type';
import { deleteTodos } from '../../api/todos';

type Props = {
  posts: Todo[];
  setPosts: React.Dispatch<React.SetStateAction<Todo[]>>;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  resetError: () => void;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
};

export const Footer: React.FC<Props> = ({
  posts, setPosts, filter, setFilter, resetError, setError,
}) => {
  const activeTodos = posts.filter(todo => todo.completed === false);
  const todosCounter = activeTodos.length;
  const completedTodos = posts.filter(todo => todo.completed);

  const clearCompleted = () => {
    setPosts([...activeTodos]);

    const deleteTodo: Todo[] = [...posts]
      .filter((todo: Todo) => !activeTodos
        .map(activeTodo => activeTodo.id).includes(todo.id));

    return deleteTodo.map((todo) => (
      deleteTodos(todo.id))
      .catch((error) => {
        setPosts(posts);
        setError((prevState: ErrorType) => ({
          ...prevState,
          deleteTodo: true,
        }));
        resetError();
        throw error;
      }));

    // return deleteTodos(id)
    //   .catch((error) => {
    //     setPosts(posts);
    //     setError((prevState: ErrorType) => ({
    //       ...prevState,
    //       deleteTodo: true,
    //     }));
    //     resetError();
    //     throw error;
    //   });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
