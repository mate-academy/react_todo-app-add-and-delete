/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { TodosContext, USER_ID } from '../Store/Store';
import { Todo } from '../../types/Todo';

type Props = {};

export const Header: React.FC<Props> = React.memo(() => {
  const {
    todos,
    setTodos,
    setTempItem,
    addTodo,
    errorMessage,
    setErrorMessage,
    loading,
    setLoading,
  } = useContext(TodosContext);

  const [title, setTitle] = useState('');
  const inputAutoFocus = useRef<HTMLInputElement>(null);

  const hasToggle = todos.length > 0;
  const activeToggle = todos.every(todo => todo.completed);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const addTempItem = useCallback((newTodo: Todo) => {
    setTempItem(newTodo);
  }, [setTempItem]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    addTempItem(newTodo);

    try {
      const createTodo = await addTodo(newTodo);

      if (createTodo !== undefined) {
        const updatedTodos = [...todos, createTodo];

        setTodos(updatedTodos);
        setTitle('');
      }
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempItem(null);
      setLoading(false);
    }
  };

  const handleCompletedAll = () => {
    const updatedTodos = todos.map(upTodo => (
      { ...upTodo, completed: !activeToggle }
    ));

    setTodos(updatedTodos);
  };

  useEffect(() => {
    if (inputAutoFocus.current) {
      inputAutoFocus.current.focus();
    }
  }, [errorMessage, todos.length]);

  return (
    <header className="todoapp__header">
      {hasToggle && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: activeToggle })}
          data-cy="ToggleAllButton"
          onClick={handleCompletedAll}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputAutoFocus}
          value={title}
          onChange={handleTitle}
          disabled={loading}
        />
      </form>
    </header>
  );
});
