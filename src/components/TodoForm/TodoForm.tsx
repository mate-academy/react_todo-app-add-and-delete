import React, { useEffect, useRef, useState } from 'react';
import { useTodos } from '../context/TodosContext';
import { useError } from '../context/ErrorContext';
import { TodoError } from '../../types/enums';

export const TodoForm: React.FC = () => {
  const { addTodo, isLoading, setIsLoading, removeTodo } = useTodos();
  const [inputTodo, setInputTodo] = useState('');

  const { setErrorMessage } = useError();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, removeTodo]);

  const handleSumbmitTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const trimmedInput = inputTodo.trim();

    try {
      if (!trimmedInput) {
        setErrorMessage(TodoError.NoTitle);

        return;
      }

      const newTodo = {
        id: 0,
        userId: 1,
        title: trimmedInput,
        completed: false,
      };

      await addTodo(newTodo);
      setInputTodo('');
    } catch (error) {
      setErrorMessage(TodoError.UnableToAdd);
    } finally {
      inputRef.current?.focus();
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSumbmitTodo}>
      <input
        aria-label="NewTodoField"
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputTodo}
        onChange={event => setInputTodo(event.target.value)}
        ref={inputRef}
        disabled={isLoading}
      />
    </form>
  );
};
