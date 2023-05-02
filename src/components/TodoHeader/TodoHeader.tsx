import React, { ChangeEvent, FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todos: Todo[],
  isInputDisabled: boolean,
  setHasError: React.Dispatch<React.SetStateAction<ErrorType>>,
  onTodoAdd: (userId: number, title: string) => void
};

const USER_ID = 9955;

export const TodoHeader: React.FC<Props> = React.memo(
  ({
    todos,
    isInputDisabled,
    setHasError,
    onTodoAdd,
  }) => {
    const [todoTitle, setTodoTitle] = useState('');
    const isAllTodosActive = todos.every(todo => todo.completed === true);

    const hanldeSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!todoTitle.trim()) {
        setHasError(ErrorType.Title);

        return;
      }

      onTodoAdd(USER_ID, todoTitle);
      setTodoTitle('');
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => (
      setTodoTitle(event.target.value)
    );

    return (
      <header className="todoapp__header">
        {!!todos.length && (
          <button
            type="button"
            aria-label="toggle-all"
            className={classNames('todoapp__toggle-all', {
              active: isAllTodosActive,
            })}
          />
        )}

        <form onSubmit={hanldeSubmit}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={handleChange}
            disabled={isInputDisabled}
          />
        </form>
      </header>
    );
  },
);
