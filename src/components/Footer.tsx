import React from 'react';
import { buttons } from '../service/service';

import { Field } from '../types/Field';

import cn from 'classnames';

type Props = {
  field: Field;
  setField: (field: Field) => void;
  todosCounter: number;
  isCompleted: boolean;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  field,
  setField,
  todosCounter,
  isCompleted,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {buttons.map(link => (
          <a
            key={link}
            onClick={() => setField(link)}
            href="#/"
            className={cn('filter__link', { selected: field === link })}
            data-cy={`FilterLink${link}`}
          >
            {link}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isCompleted}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
