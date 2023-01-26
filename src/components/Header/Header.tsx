/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { AppContext } from '../../AppContext';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';
import { AuthContext } from '../Auth/AuthContext';

export const Header:React.FC = () => {
  const [newTitle, setNewTitle] = useState('');

  const user = useContext(AuthContext);
  const {
    todos,
    setTodos,
    setError,
    isLoading,
    setIsLoading,
    setTempTodo,
  } = useContext(AppContext);

  const newTodoField = useRef<HTMLInputElement>(null);

  let maxId = useMemo(() => Math.max(...todos.map(({ id }) => id)), [todos]);

  const addTodo = async (title: string) => {
    setIsLoading(true);
    maxId += 1;
    setTempTodo({ id: 0, title, completed: false });

    try {
      const todo = {
        id: maxId,
        userId: user?.id,
        title,
        completed: false,
      };

      const newTodo = await client.post<Todo>('/todos', todo);

      setTodos(current => [...current, newTodo]);
      setNewTitle('');
    } catch (err) {
      setError(ErrorType.InsertionError);
    } finally {
      setTempTodo(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTitle === '') {
      setError(ErrorType.TitleError);

      return;
    }

    if (newTodoField.current) {
      addTodo(newTitle);
      setNewTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
