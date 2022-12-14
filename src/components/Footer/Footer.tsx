import cn from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { getTodos, removeTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[];
  onTodosChange: (value: Todo[]) => void;
};

enum SortBy {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const Footer: React.FC<Props> = ({
  onTodosChange,
  todos,
}) => {
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<SortBy>();
  const [hasCompletedTodos, setHasCompletedTodos] = useState<boolean>();

  const user = useContext(AuthContext);

  // to check if there are some completed todos
  useEffect(() => {
    const completedTodos = async () => {
      const todosFromServer = user && await getTodos(user.id);

      return todosFromServer
        && todosFromServer.filter(todo => todo.completed).length > 0
        ? setHasCompletedTodos(true)
        : setHasCompletedTodos(false);
    };

    completedTodos();
  }, []);

  // to find active todos (bottom left corner)
  useEffect(() => {
    const findActiveTodos = async () => {
      const todosFromServer = user && await getTodos(user.id);

      if (todosFromServer) {
        const filteredTodos = todosFromServer
          && todosFromServer.filter(todo => todo.completed === false);

        setActiveTodos(filteredTodos);
      }
    };

    findActiveTodos();
  }, [activeTodos]);

  const handleFilter = async (sortBy: SortBy) => {
    const todosFromServer = user && await getTodos(user.id);

    if (todosFromServer) {
      switch (sortBy) {
        case SortBy.All:
          return onTodosChange(todosFromServer);

        case SortBy.Active:
          return onTodosChange(todosFromServer.filter(todo => !todo.completed));

        case SortBy.Completed:
          return onTodosChange(todosFromServer.filter(todo => todo.completed));

        default:
          return onTodosChange(todosFromServer);
      }
    }

    return todosFromServer;
  };

  const handleClearCompleted = async () => {
    const todosFromServer = user && await getTodos(user.id);
    const onlyActiveTodos = todos.filter(todo => !todo.completed);

    onTodosChange(onlyActiveTodos);
    setHasCompletedTodos(false);

    return todosFromServer && todosFromServer.map(
      todo => todo.completed === true && removeTodo(todo.id),
    );
  };

  const { All, Active, Completed } = SortBy;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            {
              selected: filterBy === All,
            },
          )}
          onClick={() => {
            handleFilter(All);
            setFilterBy(All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            {
              selected: filterBy === Active,
            },
          )}
          onClick={() => {
            handleFilter(Active);
            setFilterBy(Active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            {
              selected: filterBy === Completed,
            },
          )}
          onClick={() => {
            handleFilter(Completed);
            setFilterBy(Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handleClearCompleted()}
      >
        {hasCompletedTodos && 'Clear complited'}

        {!hasCompletedTodos && ''}
      </button>
    </footer>
  );
};
