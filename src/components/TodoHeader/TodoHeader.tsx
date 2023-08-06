import React, { useRef } from 'react';
import cn from 'classnames';

type Props = {
  onAddTodo: (title: string) => Promise<void>;
  areAllTodosCompleted: boolean;
  areThereTodos: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  onAddTodo,
  areAllTodosCompleted,
  areThereTodos,
}) => {
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
      {areThereTodos && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: areAllTodosCompleted },
          )}
          aria-label="Close"
        />
      )}

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
