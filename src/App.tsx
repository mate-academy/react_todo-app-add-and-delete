/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as servisesTodos from './api/todos';
import { Todo } from './types/Todo';
import { TodoInput } from './components/TodoInput/TodoInput';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';

export enum FilterParam {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(FilterParam.All);
  const [tempTodo, setTempTodo] = useState(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    servisesTodos
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    if (filter === FilterParam.Active) {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === FilterParam.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  const handleDeleteTodo = (todoId: number) => {
    setLoadingIds(current => [...current, todoId]);

    return servisesTodos
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todoId));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput
          setErrorMessage={setErrorMessage}
          todos={todos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          loadingIds={loadingIds}
        />
        {todos.length > 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
