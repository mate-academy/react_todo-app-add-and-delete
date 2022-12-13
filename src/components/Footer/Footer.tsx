import cn from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { getTodos, removeTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[];
  onTodosChange: (value: Todo[]) => void;
};

export const Footer: React.FC<Props> = ({
  onTodosChange,
  todos,
}) => {
  const [clickedValue, setClickedValue] = useState(0);
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);

  const user = useContext(AuthContext);

  // to find active todos (bottom left corner)
  useEffect(() => {
    const findActiveTodos = async () => {
      const todosFromServer = user && await getTodos(user.id);

      const filteredTodos = todosFromServer
        && todosFromServer.filter(todo => todo.completed === false);

      if (filteredTodos) {
        setActiveTodos(filteredTodos);
      }
    };

    findActiveTodos();
  }, [activeTodos]);

  const handleFilter = async (todosStatus: boolean) => {
    const todosFromServer = user && await getTodos(user.id);

    const filterTodoByStatus = (actualTodos: Todo[], status: boolean) => {
      return actualTodos.filter(todo => todo.completed === status);
    };

    if (todosFromServer) {
      onTodosChange(filterTodoByStatus(todosFromServer, todosStatus));
    }
  };

  const handleShowAll = async () => {
    const todosFromServer = user && await getTodos(user.id);

    return todosFromServer && onTodosChange(todosFromServer);
  };

  const questionTags = [
    { status: 'All', value: 0 },
    { status: 'Active', value: 1 },
    { status: 'Completed', value: 2 },
  ];

  const handleClearCompleted = async () => {
    const todosFromServer = user && await getTodos(user.id);
    const onlyActiveTodos = todos.filter(todo => !todo.completed);

    onTodosChange(onlyActiveTodos);

    return todosFromServer && todosFromServer.map(
      todo => todo.completed === true && removeTodo(todo.id),
    );
  };

  const hasCompletedTodos = todos.filter(todo => todo.completed).length > 0;

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
            { selected: clickedValue === 0 },
          )}
          onClick={() => {
            handleShowAll();
            setClickedValue(0);
          }}
        >
          {questionTags[0].status}
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: clickedValue === 1 },
          )}
          onClick={() => {
            handleFilter(false);
            setClickedValue(1);
          }}
        >
          {questionTags[1].status}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: clickedValue === 2 },
          )}
          onClick={() => {
            handleFilter(true);
            setClickedValue(2);
          }}
        >
          {questionTags[2].status}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handleClearCompleted()}
      >
        {hasCompletedTodos
          ? ('Clear completed')
          : ''}
      </button>
    </footer>
  );
};
