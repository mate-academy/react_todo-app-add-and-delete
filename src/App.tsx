/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as todosService from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { Error } from './components/Error/Error';
import { ErrorEnum } from './types/ErrorEnum';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorEnum | null>(null);
  const [filter, setFilter] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTodosHandler = useCallback(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorEnum.LOAD));
  }, []);

  useEffect(() => {
    getTodosHandler();
  }, [getTodosHandler]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const addTodoHandler = useCallback(() => {
    if (query.trim() === '') {
      setError(ErrorEnum.TITLE);

      return;
    }

    const newTodo = {
      userId: todosService.USER_ID,
      title: query.trim(),
      completed: false,
    };

    setIsLoading(true);
    setTempTodo({ id: 0, ...newTodo });

    todosService
      .addTodo(newTodo)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setQuery('');
      })
      .catch(() => setError(ErrorEnum.ADD))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  }, [query]);

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);
    todosService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(prevtodos => prevtodos.filter(todo => todo.id !== todoId)),
      )
      .catch(() => {
        setTodos(prevTodos => prevTodos);
        setError(ErrorEnum.DELETE);
      })
      .finally(() => {
        setIsLoading(false);
        inputRef.current?.focus();
      });
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
      case 'all':
        return true;
    }
  });

  const activeTodos = todos.filter(todo => !todo.completed);
  const complitedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          onInput={setQuery}
          onAdd={addTodoHandler}
          ref={inputRef}
          isLoading={isLoading}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
        />

        {todos.length > 0 && (
          <Footer
            filter={filter}
            onFilter={setFilter}
            activeTodosCount={activeTodos.length}
            complitedTodos={complitedTodos}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <Error error={error} onClose={() => setError(null)} />
    </div>
  );
};
