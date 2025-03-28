import React from 'react';
import { ErrorMessage, Todo } from '../types/Todo';
import cn from 'classnames';
import { SubmitForm } from './SubmitForm';

interface Props {
  todos: Todo[];
  onCheckAll: () => void;
  onAddTodo: (todo: Todo) => void;
  setErrorMessage: (msg: ErrorMessage) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
}

export const HeaderTodoApp: React.FC<Props> = ({
  todos,
  onCheckAll,
  onAddTodo,
  setErrorMessage,
  setTempTodo,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          hidden={!todos}
          onClick={onCheckAll}
        />
      )}
      <SubmitForm
        setTempTodo={setTempTodo}
        setErrorMessage={setErrorMessage}
        todos={todos}
        onAddTodo={onAddTodo}
        inputClassName="todoapp__new-todo"
        inputPlaceHolder="What needs to be done?"
      />
      {/* Add a todo on form submit */}
    </header>
  );
};
