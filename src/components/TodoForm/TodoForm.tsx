import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  onAdd: (todo: Todo) => Promise<void>;
  todoTitle: string;
  setTodoTitle: (todoTitle: string) => void;
  onToggleAllTodos: (setAllTodoCompleted: (prev: boolean) => boolean) => void;
  isCompletedTodos: boolean;
};

export const TodoForm: React.FC<Props> = ({
  onAdd,
  todoTitle,
  setTodoTitle,
  onToggleAllTodos,
  isCompletedTodos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.currentTarget.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    onAdd({
      id: 0,
      title: todoTitle,
      userId: 0,
      completed: false,
    }).finally(() => setIsSubmitting(false));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isCompletedTodos,
        })}
        aria-label="Change todos completed state"
        data-cy="ToggleAllButton"
        onClick={() => onToggleAllTodos(prevState => !prevState)}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
