import * as React from 'react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { usePostTodos } from '../../hooks/usePostTodos';
import { useTodos } from '../../utils/TodoContext';

export const TodoContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [input, setInput] = useState<string>('');
  const { postTodo, error, clearError, isSubmitting } = usePostTodos();
  const { inputRef, triggerFocus, setError } = useTodos();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postTodo(input).then(success => {
      if (success) {
        setInput('');
        triggerFocus();
      }
    });
  };

  useEffect(() => {
    if (error) {
      setError(error);
      triggerFocus();
    }

    return () => {
      clearError();
    };
  }, [error, setError, triggerFocus, clearError]);

  return (
    <>
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <form onSubmit={onFormSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={input}
              onChange={handleInputChange}
              disabled={isSubmitting}
              autoFocus
            />
          </form>
        </header>
        {children}
      </div>
    </>
  );
};
