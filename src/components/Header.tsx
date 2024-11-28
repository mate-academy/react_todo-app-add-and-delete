import React from 'react';

import cn from 'classnames';
import { Todo } from '../types/Todo';
import Form from './Form';

type Props = {
  todos: Todo[];
  onCreateTodo: (todoTitle: string) => Promise<void>;
  isLoading: boolean;
  setErrorMessage: (message: string) => void;
};

const Header: React.FC<Props> = ({
  todos,
  onCreateTodo,
  isLoading,
  setErrorMessage,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <Form
        onCreateTodo={onCreateTodo}
        isLoading={isLoading}
        setErrorMessage={setErrorMessage}
      />
    </header>
  );
};

export default Header;
