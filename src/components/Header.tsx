import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { USER_ID } from '../utils/constants';
import { createTodo } from '../services/todos';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setError: (error: string) => void;
  saveTempTodo: (tempTodo: Todo | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  saveTempTodo,
  inputRef,
}) => {
  const isActiveButton = !todos.some(({ completed }) => !completed);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsCreating(true);

    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    createTodo({
      ...newTodo,
    })
      .then(res => {
        setTodos([...todos, res as Todo]);
        setNewTodoTitle('');
        saveTempTodo(null);
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsCreating(false);
        saveTempTodo(null);
      });

    saveTempTodo({ ...newTodo, id: 0 });
  };

  useEffect(() => {
    if (inputRef !== null && !isCreating) {
      inputRef.current?.focus();
    }
  }, [inputRef, isCreating]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      {todos.length ? (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isActiveButton,
          })}
          data-cy="ToggleAllButton"
        />
      ) : (
        <div />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newTodoTitle}
          disabled={isCreating}
          onChange={event => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
