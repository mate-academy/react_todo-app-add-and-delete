import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { createTodo, USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  focusInput: () => void | undefined;
};

export const Header: React.FC<Props> = ({
  todos,
  title,
  setTitle,
  setTodos,
  setErrorMessage,
  setTempTodo,
  setProcessingIds,
  setIsAdding,
  isAdding,
  inputRef,
  focusInput,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const createdTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({ id: 0, ...createdTodo });

    setIsAdding(true);

    createTodo(createdTodo)
      .then(newTodo => {
        setProcessingIds(prev => [...prev, newTodo.id]);
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
        setProcessingIds(prev => prev.filter(id => id !== newTodo.id));
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        focusInput();
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        focusInput();
      });
  };

  return (
    <div className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </div>
  );
};
