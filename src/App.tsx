/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { Header } from './components/Header';
import { ErrorInfo } from './components/ErrorInfo';
import { Footer } from './components/Footer';

const getFilteredTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  const filteredTodos = [...todos];

  switch (filter) {
    case FilterType.active:
      return filteredTodos.filter(todo => !todo.completed);
    case FilterType.completed:
      return filteredTodos.filter(todo => todo.completed);
    default:
      return filteredTodos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [, setLoad] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState(FilterType.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadTodos, setLoadTodos] = useState<number[]>([]);

  const filteredTodos = getFilteredTodos(todos, filter);

  const getCountActive = (): number => {
    return todos.filter(todo => !todo.completed).length;
  };

  useEffect(() => {
    getTodos()
      .then(response => {
        setTodos(response);
        setLoad(false);
      })
      .catch(() => setError('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onSubmit = (value: Todo): void => {
    setTodos(prev => [...prev, value]);
    setTitle('');
  };

  const onDelete = (value: number): void => {
    setTodos(prev => {
      const newList = [...prev].filter(todo => todo.id !== value);

      return newList;
    });
  };

  const handleDeleteCompleted = (): void => {
    const completedIds = getFilteredTodos(todos, FilterType.completed).map(
      todo => todo.id,
    );

    setLoadTodos(completedIds);

    const deletedTodos: number[] = [];

    Promise.allSettled(
      completedIds.map(id => deleteTodo(id).then(() => deletedTodos.push(id))),
    ).then(results => {
      const failedDeletions = results.filter(
        result => result.status === 'rejected',
      );

      if (failedDeletions.length > 0) {
        setError('Unable to delete a todo');
      }

      setLoadTodos([]);
      setTodos(prev =>
        [...prev].filter(todo => !deletedTodos.includes(todo.id)),
      );
    });
  };

  const isClearButton =
    getFilteredTodos(todos, FilterType.completed).length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          onChange={setTitle}
          onSubmit={onSubmit}
          onError={setError}
          onAdd={setTempTodo}
          loadTodos={loadTodos}
          onLoadTodos={setLoadTodos}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          loadTodos={loadTodos}
          onLoadTodos={setLoadTodos}
          onDelete={onDelete}
          onError={setError}
        />

        {todos.length > 0 && (
          <Footer
            selected={filter}
            onSelect={setFilter}
            counter={getCountActive()}
            isClearButton={isClearButton}
            onDelete={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorInfo error={error} onError={setError} />
    </div>
  );
};
