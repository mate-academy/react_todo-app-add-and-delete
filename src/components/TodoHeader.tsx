import classNames from 'classnames';
import React from 'react';
import { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todoTitleRef: React.RefObject<HTMLInputElement> | null;
  onAddTodo: (title: string) => Promise<boolean>;
  isLoading: boolean;
  todos: Todo[];
  onCompleted: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  todoTitleRef,
  onAddTodo,
  isLoading,
  todos,
  onCompleted,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = todoTitle.trim();

    const success = await onAddTodo(trimmedTitle);

    if (success) {
      setTodoTitle('');
    }
  };

  useEffect(() => {
    if (!isLoading) {
      todoTitleRef?.current?.focus();
    }
  }, [todoTitleRef, isLoading]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onCompleted}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoTitleRef}
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
