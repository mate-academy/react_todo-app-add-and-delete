/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';
import { getTodos, updateTodoStatus } from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 11719;

export enum FilterStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [loaded, setLoaded] = useState(true);
  const [nowLoading, setNowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const showErrorWithDelay = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  let filteredTodos: Todo[] = [];

  switch (filterStatus) {
    case 'Completed':
      filteredTodos = todos.filter(todo => todo.completed);
      break;
    case 'Active':
      filteredTodos = todos.filter(todo => !todo.completed);
      break;
    default:
      filteredTodos = todos;
      break;
  }

  useEffect(() => {
    getTodos(USER_ID)
      .then((todo) => {
        setTodos(todo);
        setLoaded(true);
      })
      .catch((fetchError) => {
        setLoaded(false);
        showErrorWithDelay('Unable to load todos');
        throw fetchError;
      });
  }, [loaded, nowLoading]);

  const handleCompleted = (elem: number, completed: boolean) => {
    updateTodoStatus(elem, !completed)
      .then(() => {
        getTodos(USER_ID)
          .then((todo) => {
            setTodos(todo);
            setLoaded(true);
          })
          .catch((fetchError) => {
            setLoaded(false);
            showErrorWithDelay('Unable to update a todo');
            throw fetchError;
          });
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          // tempTodo={tempTodo}
          setTempTodo={setTempTodo}
          nowLoading={nowLoading}
          setNowLoading={setNowLoading}
          // setTodos={setTodos}
          setLoaded={setLoaded}
          showErrorWithDelay={showErrorWithDelay}
          inputText={inputText}
          setInputText={setInputText}
          USER_ID={USER_ID}
        />

        <TodoList
          tempTodo={tempTodo}
          setTodos={setTodos}
          setLoaded={setLoaded}
          filteredTodos={filteredTodos}
          todos={todos}
          nowLoading={nowLoading}
          showErrorWithDelay={showErrorWithDelay}
          handleCompleted={handleCompleted}
          // USER_ID={USER_ID}
        />

        <Footer
          showErrorWithDelay={showErrorWithDelay}
          todos={todos}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      </div>

      <Errors
        error={error}
        setError={setError}
      />
    </div>
  );
};
