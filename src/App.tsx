import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID, creatTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { wait } from './utils/fetchClient';
import { SortField } from './types/SortField';
import { filterTodos } from './utils/helpers.ts/filterTodos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/Todolist';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(SortField.All);
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    wait(3000).then(() => setError(null));
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, error]);

  const filteredTodos = filterTodos(todos, filter);
  const handelFilter = (filterValue: SortField) => {
    setFilter(filterValue);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title should not be empty');
      handleReset();

      return;
    }

    setIsDisabled(true);
    setIsLoading(true);

    try {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      });

      const newTodo = await creatTodo({
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTitle('');
    } catch {
      setError('Unable to add a todo');
      handleReset();
    } finally {
      setIsDisabled(false);
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setIsLoading(true);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
      handleReset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
        handleReset();
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          title={title}
          isDisabled={isDisabled}
          inputRef={inputRef}
        />

        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
        />

        {todos.length && (
          <Footer
            todos={todos}
            filter={filter}
            handelFilter={handelFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} />
    </div>
  );
};
