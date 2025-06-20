import React, { useEffect, useRef } from 'react';
import { UserWarning } from '../../UserWarning';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';

type HeaderProps = {
  titleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  todoTitle: string;
  titleState: boolean;
  todoList: Todo[];
  add: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmiting: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  titleChange,
  todoTitle,
  titleState,
  todoList,
  add,
  isSubmiting,
}) => {
  const focusItem = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusItem.current) {
      focusItem.current.focus();
    }
  }, [todoList, todoTitle, isSubmiting]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={add}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={titleChange}
          disabled={titleState}
          ref={focusItem}
        />
      </form>
    </header>
  );
};
