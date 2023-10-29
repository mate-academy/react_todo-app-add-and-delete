/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { useTodos } from '../../TodosContext';
import { addTodo } from '../../api/todos';

export const Header: React.FC = () => {
  const todoInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const trimmedTitle = title.trim();
  const {
    error,
    todos,
    setTodos,
    setError,
    USER_ID,
    setTempTodos,
  } = useTodos();

  useEffect(() => {
    if (todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [todos, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      setTimeout(() => setError(''), 3000);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    try {
      setError('');
      setIsDisabledInput(true);
      setTempTodos([newTodo]);
      const addedTodo = await addTodo(newTodo);

      setTitle('');
      setTodos(prevTodos => [...prevTodos].concat(addedTodo));
    } catch (err) {
      setError('Unable to add a todo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setTempTodos([]);
      setIsDisabledInput(false);
    }
  };

  return (
    <header className="todoapp__header">
      {Boolean(todos.length)
        && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />
        )}

      <form onSubmit={handleSubmit}>
        <input
          ref={todoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
