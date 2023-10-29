/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { UserWarning } from './components/UserWarning/UserWarning';
import { AppDispatch, RootState } from './redux/store';
import { TodoFilter } from './types/TodoFilter';
import {
  clearTempTodo,
  setErrorType,
  setFilter,
  setTempTodo,
} from './redux/todoSlice';
import { ErrorType } from './types/errorType';
import { selectFilteredTodos } from './store/selectors';
import { fetchTodos, addTodo } from './redux/todoThunks';
// import { AddTodoResponse } from './api/todos';
// import { Todo } from './types/Todo';

const USER_ID = 11725;

export const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const todos = useSelector((state: RootState) => state.todos.todos);
  const status = useSelector((state: RootState) => state.todos.status);
  const error = useSelector((state: RootState) => state.todos.error);
  const errorType = useSelector((state: RootState) => state.todos.errorType);
  const tempTodo = useSelector((state: RootState) => state.todos.tempTodo);

  useEffect(() => {
    dispatch(fetchTodos(11725));
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

  const handleAddTodo = (title: string) => {
    const newTempTodo = {
      id: 0,
      title,
      completed: false,
    };

    dispatch(setTempTodo(newTempTodo));

    dispatch(addTodo({ title }))
      .then(() => {
        dispatch(clearTempTodo());
      })
      .catch((err: string) => {
        console.error('Unable to add todo:', err);
        dispatch(clearTempTodo());
        dispatch(setErrorType(ErrorType.AddTodoError));
      });
  };

  const handleFilterChange = (filter: TodoFilter) => {
    dispatch(setFilter(filter));
  };

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

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <ErrorNotification
        errorType={errorType}
      />
    </div>
  );
};
