/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

interface Props {
  user: User | null
  title: string
  isAdding: boolean
  filteredTodos: Todo[]
  onTitleChange: (value: string) => void
  onError: (message: string) => void
  onAdd: (
    todo: Todo,
    todoField: React.RefObject<HTMLInputElement>
  ) => void
}

export const Header: React.FC<Props> = React.memo((
  {
    user,
    title,
    isAdding,
    filteredTodos,
    onTitleChange,
    onError,
    onAdd,
  },
) => {
  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // console.log(todos)

    if (!user?.id) {
      return;
    }

    if (!title.trim()) {
      onError('Title can\'t be empty');

      return;
    }

    const manualTodo = {
      id: 0,
      title,
      completed: false,
      userId: user?.id,
    };

    filteredTodos.push(manualTodo);

    onAdd(manualTodo, todoField);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={todoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isAdding}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
});
