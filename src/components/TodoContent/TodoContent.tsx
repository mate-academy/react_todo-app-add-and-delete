import * as React from 'react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { usePostTodos } from '../../hooks/usePostTodos';
import { useTodos } from '../../utils/TodoContext';

type TodoContentProps = {
  children: React.ReactNode;
  onErrorChange: (error: ErrorType | null) => void;
};

export const TodoContent: React.FC<TodoContentProps> = ({
  children,
  onErrorChange,
}) => {
  const [input, setInput] = useState<string>('');
  const { postTodo, error, isSubmitting } = usePostTodos();
  const { inputRef, triggerFocus } = useTodos(); // Get triggerFocus from context

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
      onErrorChange(error);
      triggerFocus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, onErrorChange]);

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
