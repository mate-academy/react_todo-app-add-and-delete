import React, { useState, useEffect } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import * as todoService from '../../api/todos';

type Props = {
  todos: Todo[];
  titleText: string;
  titleFunction: (el: string) => void;
  errorFunction: (el: string) => void;
  todosFunction: (el: Todo[] | ((currentTodos: Todo[]) => Todo[])) => void;
  loadingTodoFunction: (el: Todo | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isDeleting: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  titleText,
  titleFunction,
  errorFunction,
  todosFunction,
  loadingTodoFunction,
  inputRef,
  isDeleting,
}) => {
  const [loading, setLoading] = useState(false);

  //#region Setvice Functions
  function addTodos(title: string, completed: boolean, userId: number) {
    const newTempTodo: Todo = {
      id: 0,
      title: titleText.trim(),
      completed: false,
      userId: USER_ID,
    };

    setLoading(true);
    loadingTodoFunction(newTempTodo);

    return todoService
      .createTodo({ title, completed, userId })
      .then(newTodo => {
        todosFunction((currentTodos: Todo[]) => [...currentTodos, newTodo]);
        loadingTodoFunction(null);
      })
      .catch(er => {
        errorFunction('Unable to add a todo');
        throw er;
      })
      .finally(() => {
        setLoading(false);
      });
  }
  //#endregion

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const reset = () => {
    errorFunction('');
    titleFunction('');
  };

  const handleForm: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();

    if (!titleText) {
      errorFunction('Title should not be empty');

      return;
    }

    addTodos(titleText, true, USER_ID).then(() => {
      errorFunction('');
      reset();
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all')}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleForm}>
        <input
          ref={inputRef}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleText}
          onChange={el => {
            titleFunction(el.target.value.trim());
          }}
          disabled={loading || isDeleting}
        />
      </form>
    </header>
  );
};
