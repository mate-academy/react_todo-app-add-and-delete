import React from 'react';
import classNames from 'classnames';

import { NewTodo } from '../NewTodo/NewTodo';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

interface Props {
  activeTodos: Todo[];
  user: User | null;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setCurrentError: (value: React.SetStateAction<string>) => void;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (todoData: Omit<Todo, 'id'>) => Promise<void>;
  isAdding: boolean;
}

export const Header: React.FC<Props> = (props) => {
  const {
    activeTodos,
    user,
    title,
    setTitle,
    setCurrentError,
    setHasError,
    onSubmit,
    isAdding,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: activeTodos.length === 0,
          },
        )}
      />

      <NewTodo
        user={user}
        title={title}
        setTitle={setTitle}
        setCurrentError={setCurrentError}
        setHasError={setHasError}
        onSubmit={onSubmit}
        isAdding={isAdding}
      />
    </header>
  );
};
