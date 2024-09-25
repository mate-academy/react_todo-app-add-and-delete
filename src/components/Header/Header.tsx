import React, { useEffect } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { showErrorMesage } from '../../utils/showErrorMesage';

type TodosState = {
  todos: Todo[];
  setTodos: (el: Todo[]) => void;
};

type TitleState = {
  todoTitle: string;
  setTodoTitle: (el: string) => void;
};

type Props = {
  todosState: TodosState;
  titleState: TitleState;
  reset: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isDeleting: boolean;
  loading: boolean;
  addTodos: (
    title: string,
    completed: boolean,
    userId: number,
  ) => Promise<Todo | void>;
  setErrorMessage: (el: string) => void;
};

export const Header: React.FC<Props> = ({
  todosState,
  titleState,
  reset,
  inputRef,
  isDeleting,
  loading,
  addTodos,
  setErrorMessage,
}) => {
  //#region Setvice Functions

  //#endregion

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleForm: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();

    if (!titleState.todoTitle.trim()) {
      showErrorMesage('Title should not be empty', setErrorMessage);

      return;
    }

    addTodos(titleState.todoTitle.trim(), false, USER_ID).then(() => {
      reset();
    });
  };

  return (
    <header className="todoapp__header">
      {!!todosState.todos.length && (
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
          value={titleState.todoTitle}
          onChange={el => {
            titleState.setTodoTitle(el.target.value);
          }}
          disabled={loading || isDeleting}
        />
      </form>
    </header>
  );
};
