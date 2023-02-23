import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';

type Props = {
  count: number,
  isActiveCount: number,
  addNewTodo: (todoTitle: string) => Promise<void>
};

export const Header: React.FC<Props> = ({
  count,
  isActiveCount,
  addNewTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    addNewTodo(todoTitle);
    setTodoTitle('');
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTodoTitle(value);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {count > 0 && (
        <button
          aria-label="complited todo"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !isActiveCount,
          })}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInput}
        />
      </form>
    </header>
  );
};
