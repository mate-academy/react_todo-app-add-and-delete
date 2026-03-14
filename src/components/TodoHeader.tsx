import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import React from 'react';
import { postTodo } from '../api/todos';
import EError from '../utils/EError';

interface ITodoHeader {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: (todo: Todo | null) => void;
  setErrorMessage: (error: EError) => void;
}

export const TodoHeader: React.FC<ITodoHeader> = ({
  todos,
  setTodos,
  setTempTodo,
  setErrorMessage,
}) => {
  const [value, setValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAllCompleted = todos.length > 0 && todos.every(t => t.completed);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding, todos]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!value.trim()) {
      setErrorMessage(EError.emptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: 3941,
      title: value.trim(),
      completed: false,
    };

    setIsAdding(true);

    try {
      setTempTodo(newTodo);

      const createdTodo = await postTodo(newTodo);

      setTodos(current => [...current, createdTodo]);
      setValue('');
    } catch (error) {
      setErrorMessage(EError.add);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          value={value}
          disabled={isAdding}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setValue(event.target.value)}
        />
      </form>
    </header>
  );
};
