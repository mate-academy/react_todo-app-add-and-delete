import React, { useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  currentTodoList: Todo[];
  handleCreateTodo: ({
    title,
    userId,
    completed,
  }: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (arg: string) => void;
  isInputDisabled: boolean;
  setIsInputDisabled: (arg: boolean) => void;
  inputValue: string;
  setInputValue: (arg: string) => void;
}

export const NewTodo: React.FC<Props> = ({
  currentTodoList,
  handleCreateTodo,
  setErrorMessage,
  isInputDisabled,
  inputValue,
  setInputValue,
}: Props) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valueForTodo = inputValue.trim();

    if (!valueForTodo) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    handleCreateTodo({
      title: valueForTodo,
      userId: 2500,
      completed: false,
    });
  };

  const inputAutoFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputAutoFocus.current) {
      inputAutoFocus.current.focus();
    }
  }, [isInputDisabled]);

  const allTodosAreCompleted = currentTodoList.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          // eslint-disable-next-line prettier/prettier
          'active': allTodosAreCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          ref={inputAutoFocus}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
