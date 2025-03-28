/* eslint-disable no-console */
import React, { FormEvent, useEffect, useMemo, useRef } from 'react';
import { Todo } from '../../../types/Todo';
import classNames from 'classnames';
import { TodoCreateHandler } from '../../../types/TodoMethods';
import { NetworkStatus } from '../../../types/AppNetworkStatus';

type Props = {
  todos: Todo[];
  onAddTodo: TodoCreateHandler;
  creationStatus: NetworkStatus;
};

export const TodoHeader: React.FC<Props> = React.memo(
  ({ todos, onAddTodo, creationStatus }) => {
    const allActive = useMemo(
      () => todos?.every(todo => todo.completed) || false,
      [todos],
    );
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (creationStatus === NetworkStatus.Idle) {
        if (titleInputRef?.current) {
          titleInputRef.current.value = '';
        }
      }

      titleInputRef?.current?.focus();
    }, [creationStatus]);

    const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onAddTodo(titleInputRef?.current?.value || '');

      // event.target.
    };

    return (
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        {todos.length > 0 && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allActive,
            })}
            data-cy="ToggleAllButton"
            onClick={() => {}}
          />
        )}

        <form onSubmit={handleSubmitForm}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={titleInputRef}
            disabled={creationStatus === NetworkStatus.Sending}
          />
        </form>
      </header>
    );
  },
);

TodoHeader.displayName = 'TodoHeader';
