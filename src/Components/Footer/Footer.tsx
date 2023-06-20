import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Type } from '../../types/TodoTypes';

type Props = {
  todos: Todo[],
  selectType: Type,
  setSelectedType: (selectType: Type) => void,
  removeCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  todos, selectType, setSelectedType, removeCompletedTodos,
}) => {
  const todosCompleted = todos.filter(todo => todo.completed).length;
  const todosActive = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosActive} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectType === 'All' },
          )}
          onClick={() => setSelectedType(Type.All)}
        >
          {Type.All}
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectType === 'Active' },
          )}
          onClick={() => setSelectedType(Type.ACTIVE)}
        >
          {Type.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectType === 'Completed' },
          )}
          onClick={() => setSelectedType(Type.COMPLETED)}
        >
          {Type.COMPLETED}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={removeCompletedTodos}
      >
        {todosCompleted > 0 && ('Clear completed')}
      </button>
    </footer>
  );
};
