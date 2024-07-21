import * as React from 'react';
import { IsActiveLink } from '../../types/types';
import classNames from 'classnames';
import {
  TodosContext,
  TempTodoContext,
  ErrorContext,
  isClearingContext,
} from '../../utils/Store';
import { handleDeleteAll } from '../../utils/utilityFunctions';

interface FooterProps {
  link: IsActiveLink;
  setLink: (arg: IsActiveLink) => void;
}

export const Footer: React.FC<FooterProps> = ({ link, setLink }) => {
  const { todos, setTodos } = React.useContext(TodosContext);
  const { tempTodo } = React.useContext(TempTodoContext);
  const { setIsClearing } = React.useContext(isClearingContext);
  const { setIsError } = React.useContext(ErrorContext);

  const activeTodos = React.useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const isAnyCompleted = React.useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const handleDeleteArguments = {
    todos: todos,
    setTodos: setTodos,
    setIsError: setIsError,
    setIsClearing: setIsClearing,
  };

  return (
    (todos.length > 0 || tempTodo) && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${activeTodos.length} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          {Object.values(IsActiveLink).map(item => (
            <a
              key={item}
              href={link === 'All' ? '#/' : `#/${item}`}
              className={classNames('filter__link', {
                selected: link === item,
              })}
              data-cy={`FilterLink${item}`}
              onClick={() => setLink(item)}
            >
              {item}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!isAnyCompleted}
          onClick={event =>
            handleDeleteAll({ ...handleDeleteArguments, event })
          }
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
