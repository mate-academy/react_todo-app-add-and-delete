import React, { FormEvent } from 'react';
import { Todo } from '../../types/Todo';

type PropsType = {
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  createTodo: (title: string) => void,
  tempTodo: Todo | null;
};

export const TodoHeader: React.FC<PropsType> = React.memo(
  ({
    inputValue,
    setInputValue,
    createTodo,
    tempTodo,
  }) => {
    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();

      createTodo(inputValue);
    };

    const isCreatingNewTodo = !!tempTodo;

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button type="button" className="todoapp__toggle-all active" />

        {/* Add a todo on form submit */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            disabled={isCreatingNewTodo}
          />
        </form>
      </header>
    );
  },
);
