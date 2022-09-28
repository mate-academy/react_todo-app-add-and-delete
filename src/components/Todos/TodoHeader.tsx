/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { addTodo } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';
import { User } from '../../types/User';

interface Props {
  changeError: (value: ErrorTypes | null) => void;
  isAdding: boolean;
  changeIsAdding: (value: boolean) => void;
  user: User;
  add: (todo: any) => void | PromiseLike<void>;
}

const TodoHeader: React.FC<Props> = (
  {
    changeError,
    isAdding,
    changeIsAdding,
    user,
    add,
  },
) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const changeInputValue = (value: string) => {
    setInputValue(value);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={async (event) => {
        event.preventDefault();
        changeIsAdding(true);

        if (!newTodoField.current?.value) {
          changeError(ErrorTypes.Empty);
          changeIsAdding(false);

          // eslint-disable-next-line no-useless-return
          return;
        }

        const newTodo = {
          userId: user.id,
          title: newTodoField.current.value,
          completed: true,
        };

        await addTodo(newTodo)
          .then(add)
          .then(() => changeInputValue(''))
          .catch(() => changeError(ErrorTypes.Add))
          .finally(() => changeIsAdding(false));
      }}
      >
        <input
          id="input"
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={inputValue}
          onChange={event => {
            changeInputValue(event.target.value);
          }}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};

export default TodoHeader;
