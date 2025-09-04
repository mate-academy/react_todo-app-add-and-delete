import { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type NewTodoProps = {
  onSubmit: (todo: Omit<Todo, 'id'>) => void;
  setTempTodo: (todo: Todo | null) => void;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  onInputChange: (value: string) => void;
  onError: (error: string) => void;
};

export const NewTodo: React.FC<NewTodoProps> = ({
  onSubmit,
  setTempTodo,
  disabled = false,
  inputRef,
  inputValue,
  onInputChange,
  onError,
}) => {
  const userId = USER_ID;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = inputValue.trim();
    if (!trimmedTitle) {
      onError('Title should not be empty'); 
      return;
    }
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId,
      completed: false,
    });

    if (trimmedTitle) {
      onSubmit({
        title: trimmedTitle,
        userId,
        completed: false,
      });
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={handleTitleChange}
          disabled={disabled}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
        />
      </form>
    </>
  );
};
