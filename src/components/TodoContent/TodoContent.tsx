import * as React from 'react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { usePostTodos } from '../../hooks/usePostTodos';

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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postTodo(input).then(success => {
      if (success) {
        setInput('');
      }
    });
  };

  // Handle error changes
  React.useEffect(() => {
    if (error) {
      onErrorChange(error);
    }
  }, [error, onErrorChange]);

  return (
    <>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <form onSubmit={onFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={input}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </form>
        </header>
        {children}
      </div>
    </>
  );
};
