/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as postServise from './api/todos';
import { Errors } from './types/Errors';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Filter } from './types/Filter';
import { filterTodo } from './utils/filterFunc';

const USER_ID = 12047;

export const App: React.FC = () => {
  const [error, setError] = useState<Errors | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const filteredTodo = filterTodo(todos, filterType);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Errors.ERRORS_EMPTY_TITLE);

      return;
    }

    setIsSubmiting(true);

    try {
      const newTodo = await postServise.createTodo({
        completed: false,
        title: title.trim(),
        userId: USER_ID,
      });

      setTodos(currentTodo => [...currentTodo, newTodo]);
      setTitle('');
    } catch (newError) {
      setError(Errors.UNABLE_ADD);
      throw newError;
    } finally {
      if (inputRef.current) {
        inputRef.current.focus();
      }

      setIsSubmiting(false);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await postServise.deleteTodo(todoId);
    } catch (removeError) {
      setError(Errors.UNABLE_DELETE);
    }

    setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const todosFromServer = await postServise.getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setError(Errors.UNABLE);
      }
    };

    getData();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isSubmiting={isSubmiting}
          title={title}
          handleFormSubmit={handleFormSubmit}
          inputRef={inputRef}
          handleChangeInput={handleChangeInput}
        />

        <TodoList
          removeTodo={removeTodo}
          filteredTodo={filteredTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            setFilterType={setFilterType}
            filterType={filterType}
            filteredTodo={filteredTodo}
          />
        )}
        {error && (
          <ErrorNotification setError={setError} error={error} />
        )}
      </div>
    </div>
  );
};
