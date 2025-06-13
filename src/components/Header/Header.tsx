import React from 'react';
import cn from 'classnames';

import { NewTodo } from '../NewTodo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleAddTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (ErrorMessage: string | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  handleAddTodo,
  setErrorMessage,
  inputRef,
}) => {
  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <NewTodo
        handleAddTodo={handleAddTodo}
        setErrorMessage={setErrorMessage}
        inputRef={inputRef}
      />
    </header>
  );
};
