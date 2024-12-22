import classNames from 'classnames';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { addTodo, updateTodo, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import { getCompletedTodos, pause } from '../utils/methods';

interface Props {
  todos: Todo[];
  sizeLeft: number;
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onErrorMessage: (v: string) => void;
  onMassLoader: (v: boolean) => void;
  onLoader: (v: boolean) => void;
  onTempTodo: (v: Todo | null) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  sizeLeft,
  onTodos,
  onErrorMessage,
  onMassLoader,
  onLoader,
  onTempTodo,
}) => {
  const [title, setTitle] = useState('');
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const changeAllCompleted = async () => {
    const shouldCompleteAll =
      getCompletedTodos(todos).length === 0 || sizeLeft > 0;

    try {
      onMassLoader(true);
      await pause();

      const updatedTodos = await Promise.all(
        todos.map(async e => {
          const updatedTodo = await updateTodo({
            id: e.id,
            completed: shouldCompleteAll,
          });

          return {
            ...e,
            completed: updatedTodo.completed,
          };
        }),
      );

      onTodos(updatedTodos);
    } catch {
      onErrorMessage('Unable to update a todo');
    } finally {
      onMassLoader(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim()) {
      const newTodo = {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      };

      setDisabled(true);

      try {
        const tempTodo = { ...newTodo, id: 0 };

        onTempTodo(tempTodo);
        onLoader(true);
        await pause();

        const response = await addTodo(newTodo);

        onTodos(prev => [...prev, response]);

        setTitle('');
      } catch {
        onErrorMessage('Unable to add a todo');
      } finally {
        onTempTodo(null);
        onLoader(false);
        setDisabled(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    } else {
      onErrorMessage('Title should not be empty');
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: sizeLeft === 0,
          })}
          // className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          onClick={changeAllCompleted}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabled}
          autoFocus
          value={title}
          ref={inputRef}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
