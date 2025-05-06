import React from 'react';
import { ToDoForm } from './ToDoForm';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  addToDo: (todo: Todo) => Promise<void>;
  setErrorMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  addToDo,
  setErrorMessage,
  inputRef,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <ToDoForm
        onSubmit={addToDo}
        onError={setErrorMessage}
        inputRef={inputRef}
      />
    </header>
  );
};
