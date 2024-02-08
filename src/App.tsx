/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { USER_ID } from './_utils/constants';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { UserWarning } from './components/UserWarning/UserWarning';
import { TodoFilter } from './types/TodoFilter';
import {
  clearErrorType,
  // clearTempTodo,
  // setErrorType,
  setFilter,
  // setInputValue,
  // setTempTodo,
} from './redux/todoSlice';
// import { ErrorType } from './types/errorType';
import { selectFilteredTodos } from './redux/selectors';
import { fetchTodos } from './redux/todoThunks';

export const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const todos = useSelector((state: RootState) => state.todos.todos);
  const status = useSelector((state: RootState) => state.todos.status);
  const error = useSelector((state: RootState) => state.todos.error);
  const errorType = useSelector((state: RootState) => state.todos.errorType);

  useEffect(() => {
    dispatch(fetchTodos(USER_ID));
  }, [dispatch]);

  // load error
  useEffect(() => {
    if (status === 'failed') {
      console.error('Error fetching todos:', error);
    }
  }, [status, error]);

  const filteredTodos = useSelector(selectFilteredTodos);

  useEffect(() => {
    console.log(filteredTodos);
  }, [filteredTodos]);

  const handleFilterChange = (filter: TodoFilter) => {
    dispatch(setFilter(filter));
  };

  useEffect(() => {
    if (errorType) {
      const timer = setTimeout(() => {
        dispatch(clearErrorType());
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorType, dispatch]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader />

        <TodoList todos={filteredTodos} />

        {todos && todos.length > 0 && (
          <TodoFooter
            todos={filteredTodos}
            filterChange={handleFilterChange}
          />
        )}
      </div>

      <ErrorNotification
        errorType={errorType}
      />
    </div>
  );
};
