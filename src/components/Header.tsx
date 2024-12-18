import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  inputLoading: boolean;
  inputValue: string;
  refForInput: React.RefObject<HTMLInputElement>;
  handleChangeValue: (value: string) => void;
  handleAddTodo: (someText: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  inputLoading,
  inputValue,
  refForInput,
  handleAddTodo,
  handleChangeValue,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={e => {
          e.preventDefault();
          handleAddTodo(inputValue);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={inputLoading}
          ref={refForInput}
          value={inputValue}
          onChange={event => handleChangeValue(event.target.value)}
        />
      </form>
    </header>
  );
};
