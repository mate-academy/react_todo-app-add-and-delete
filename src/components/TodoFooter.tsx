import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../types/Status';

type FooterProps = {
  todoStatus: TodoStatus,
  setTodoStatus: (status: TodoStatus) => void,
  isTodoCompleted: boolean,
  activeTodosCount: number,
  clearCompleted: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  todoStatus,
  setTodoStatus,
  isTodoCompleted,
  activeTodosCount,
  clearCompleted,
}) => {
  const links = Object.values(TodoStatus);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        {links.map(link => (
          <a
            key={link}
            href={link === TodoStatus.ALL ? '#/' : `#/${link}`}
            className={classNames(
              'filter__link',
              { selected: todoStatus === link },
            )}
            onClick={() => setTodoStatus(link)}
          >
            {link}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          visibility: isTodoCompleted
            ? 'visible'
            : 'hidden',
        }}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
