import React, { useRef } from 'react';

type Props = {
  onAddTodo: (title: string) => Promise<void>;
};

export const TodoHeader: React.FC<Props> = ({ onAddTodo }) => {
  const inputField = useRef<HTMLInputElement | null>(null);

  const resetInput = () => {
    if (inputField.current) {
      inputField.current.disabled = false;
      inputField.current.value = '';
      inputField.current.focus();
    }
  };

  const submitNewTodo = () => {
    if (inputField.current) {
      inputField.current.disabled = true;
      onAddTodo(inputField.current.value)
        .then(resetInput)
        .finally(() => {
          if (inputField.current) {
            inputField.current.disabled = false;
            inputField.current.focus();
          }
        });
    }
  };

  const handlerPressedKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitNewTodo();
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Close"
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          ref={inputField}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handlerPressedKey}
        />
      </form>
    </header>
  );
};
