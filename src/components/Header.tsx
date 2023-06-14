import classNames from 'classnames';
import React from 'react';

interface Props {
  isThereActiveTodo: boolean,
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  updatetempTodo: (value: string) => void,
  apiResponseReceived: boolean,
  tempTodo: string;
}

export const Header:React.FC<Props> = ({
  isThereActiveTodo,
  handleFormSubmit,
  updatetempTodo,
  apiResponseReceived,
  tempTodo,
}) => {
  return (
    <header className="todoapp__header">
      <label htmlFor="nameInput">
        <button
          id="nameInput"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isThereActiveTodo,
          })}
        >
          {null}
        </button>
      </label>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={tempTodo}
          onChange={(event) => {
            updatetempTodo(event.target.value);
          }}
          disabled={apiResponseReceived}
        />
      </form>
    </header>
  );
};
