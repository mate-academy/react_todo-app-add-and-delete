import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID, addTodo } from '../api/todos';
import { Error } from '../types/EnumError';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  showError: (error: string) => void;
  setTodosAreLoadingIds: (todosAreLoadingIds: number[]) => void;
  setTodosActiveIds: (todosActiveIds: number[]) => void;
  todosAreLoadingIds: number[];
  todosActiveIds: number[];
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  showError,
  setTodosAreLoadingIds,
  setTodosActiveIds,
  todosAreLoadingIds,
  todosActiveIds,
}) => {
  const allAreCompleted = todos.every(todo => todo.completed);
  const field = useRef<HTMLInputElement>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      showError(Error.emptyTitle);

      return;
    }

    const tempTodo = {
      title: newTitle,
      completed: false,
      userId: USER_ID,
      id: 50,
    };

    setTodos([...todos, tempTodo]);
    setTodosAreLoadingIds([...todosAreLoadingIds, tempTodo.id]);

    addTodo({ title: newTitle.trim(), completed: false, userId: USER_ID })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setNewTitle('');
        setTodosActiveIds([...todosActiveIds, newTodo.id]);
      })
      .catch(() => {
        showError(Error.add);
        setTodos(todos);
      })
      .finally(() => setTodosAreLoadingIds([]));
  };

  useEffect(() => {
    field.current?.focus();
  }, [todos, showError]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allAreCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={field}
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          disabled={!!todosAreLoadingIds.length}
        />
      </form>
    </header>
  );
};
