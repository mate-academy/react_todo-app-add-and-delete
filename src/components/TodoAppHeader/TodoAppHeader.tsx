import React, { useCallback, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
type Props = {
  loaderClearButton: boolean;
  loaderDeleteButton: boolean;
  errorPostTodo: boolean;
  loadingPostTodo: boolean;
  title: string;
  setTitle: (title: string) => void;
  setNotificationError: (error: boolean) => void;
  setTempTodo: (todo: Todo) => void;
  setErrorTitle: (error: boolean) => void;
};

export const TodoAppHeader = React.memo<Props>(
  ({
    loaderClearButton,
    loaderDeleteButton,
    errorPostTodo,
    loadingPostTodo,
    title,
    setTitle,
    setNotificationError,
    setTempTodo,
    setErrorTitle,
  }) => {
    const titleField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (titleField.current && !loaderDeleteButton) {
        titleField.current.focus();
      }

      if (!loadingPostTodo && !errorPostTodo && !loaderClearButton) {
        setTitle('');
      }
    }, [loadingPostTodo, loaderDeleteButton, loaderClearButton]);

    const inputTitle = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
      },
      [],
    );

    const inputOnKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          if (!title.trim()) {
            setNotificationError(true);
            setErrorTitle(true);
            setTimeout(() => {
              setErrorTitle(false);
            }, 3000);
          } else {
            setTempTodo({
              id: 0,
              userId: USER_ID,
              title: title.trim(),
              completed: false,
            });
          }
        }
      },
      [title],
    );

    return (
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        {/* Add a todo on form submit */}
        <form>
          <input
            value={title}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={inputTitle}
            onKeyDown={inputOnKeyDown}
            ref={titleField}
            disabled={loadingPostTodo}
          />
        </form>
      </header>
    );
  },
);

TodoAppHeader.displayName = 'TodoAppHeader';
