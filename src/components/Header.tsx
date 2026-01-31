import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onAddTodo: (title: string) => Promise<void>;
  isSubmitting: boolean;
  todoFieldRef?: React.RefObject<HTMLInputElement> | undefined;
}

export const Header: React.FC<Props> = ({ 
  todos, 
  onAddTodo, 
  isSubmitting,
  todoFieldRef,
 }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isSubmitting) {
      todoFieldRef?.current?.focus();
    }
  }, [isSubmitting, todoFieldRef]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onAddTodo('').catch(() => {});

      return;
    }

    try {
      await onAddTodo(trimmedTitle);
      setTitle('');
    } catch (error) {}
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={todoFieldRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          aria-label="New todo title"
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
