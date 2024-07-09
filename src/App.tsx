import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';
import { USER_ID, deleteTodo, getTodos } from './api/todos';
import { isAllTodosCompleted } from './utils/Helpers';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setfilterBy] = useState<FilterBy>(FilterBy.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);

  const fieldTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.Active:
          return !todo.completed;
        case FilterBy.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [filterBy, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onAddTodo = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  const onDeleteTodo = (id: number) => {
    setProcessingTodos([id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setProcessingTodos([]);
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        fieldTitle.current?.focus();
      });
  };

  const onDeleteCompleted = () => {
    Promise.allSettled(
      todos
        .filter(todo => todo.completed)
        .map(todo => {
          setProcessingTodos(prev => [...prev, todo.id]);

          return deleteTodo(todo.id)
            .then(() =>
              setTodos(prevTodos =>
                prevTodos.filter(prevTodo => prevTodo.id !== todo.id),
              ),
            )
            .catch(() => setError('Unable to delete a todo'));
        }),
    ).then(() => {
      fieldTitle.current?.focus();
      setProcessingTodos([]);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={onAddTodo}
          isAllTodosCompleted={isAllTodosCompleted(todos)}
          setError={setError}
          setTempTodo={setTempTodo}
          fieldTitle={fieldTitle}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={onDeleteTodo}
          processingTodos={processingTodos}
        />
        {!!todos.length && (
          <Footer
            setfilterBy={setfilterBy}
            filterBy={filterBy}
            todos={todos}
            onDeleteCompleted={onDeleteCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
