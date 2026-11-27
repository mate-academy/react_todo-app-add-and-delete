import classNames from 'classnames';
import React, { FormEvent, RefObject } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  newTodoField: RefObject<HTMLInputElement> | null;
  loading: boolean;
  isCreating: boolean;
  onTitleChange: (title: string) => void;
  onAdd: (event: FormEvent<HTMLFormElement>) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  title,
  newTodoField,
  loading,
  isCreating,
  onTitleChange,
  onAdd,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        disabled
      />

      <form onSubmit={onAdd}>
        <input
          ref={newTodoField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          disabled={isCreating || loading}
        />
      </form>

      {/* {loading && <div className="loader" />} можна додати loader поки дані підгружаються з серверу*/}
    </header>
  );
};
