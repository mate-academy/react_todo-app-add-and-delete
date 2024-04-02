/* eslint-disable react/no-find-dom-node */
import React from 'react';
import { ErrorMessages } from '../types/ErrorMessages';
import { USER_ID, addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { useTodos } from '../utils/TodoContext';
import classNames from 'classnames';

export const Header: React.FC = () => {
  const {
    isLoading,
    setIsLoading,
    setTodos,
    tempTodo,
    setTempTodo,
    title,
    setTitle,
    showError,
    todos,
  } = useTodos();

  const userId = USER_ID;
  const completed = false;

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      showError(ErrorMessages.EmptyTitle);

      return;
    }

    setIsLoading(true);

    setTempTodo({
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    });

    if (tempTodo) {
      setTodos(prevTodos => [...prevTodos, tempTodo]);
    }

    return addTodo({ title, userId, completed })
      .then((newTodo: Todo) => {
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== tempTodo?.id),
        );
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => showError(ErrorMessages.AddTodo))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
          ref={input => input && input.focus()}
        />
      </form>
    </header>
  );
};
