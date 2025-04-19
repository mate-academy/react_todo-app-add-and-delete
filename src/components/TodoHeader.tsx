import React, { useEffect, useState } from 'react';

import { addTodo, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

interface TodoHeaderProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputTodoRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  setError,
  setTempTodo,
  setTodos,
  inputTodoRef,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputEl = inputTodoRef.current;

  useEffect(() => {
    inputEl?.focus();
  }, [inputEl]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setError('Title should not be empty');

      return;
    }

    if (inputEl) {
      inputEl.disabled = true;
    }

    const todoData: Omit<Todo, 'id'> = {
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    };

    try {
      setTempTodo({ ...todoData, id: 0 });
      const addedTodo = await addTodo(todoData);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
      setInputValue('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);

      if (inputEl) {
        inputEl.disabled = false;
        inputEl.focus();
      }
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputTodoRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
