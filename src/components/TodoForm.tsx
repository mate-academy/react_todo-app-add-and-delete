import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { ErrorType, Todo } from '../types';
import { USER_ID } from '../constants';

type Props = {
  onSubmit: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  onSetError: (error: ErrorType) => void;
  areAllCompleted: boolean;
  isLoading: boolean;
  todos: Todo[];
  errorMessage: ErrorType;
};

export const TodoForm: FC<Props> = ({
  onSubmit,
  onSetError,
  areAllCompleted,
  isLoading,
  todos,
  errorMessage,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const titleField = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (titleField.current) {
      titleField.current.focus();
    }
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSetError(ErrorType.None);

    setTodoTitle(event.target.value.trimStart());
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!todoTitle.length) {
      onSetError(ErrorType.Validation);

      return;
    }

    onSetError(ErrorType.None);

    const newTodo = {
      completed: false,
      title: todoTitle.trim(),
      userId: USER_ID,
    };

    onSubmit(newTodo)
      .then(() => setTodoTitle(''))
      .finally(handleFocus);
  };

  useEffect(handleFocus, [todos, errorMessage]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: areAllCompleted })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={todoTitle}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
