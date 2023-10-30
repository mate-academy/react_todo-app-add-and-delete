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
  clearTempTodo,
  setErrorType,
  setFilter,
  setInputValue,
  setTempTodo,
} from './redux/todoSlice';
import { ErrorType } from './types/errorType';
import { selectFilteredTodos } from './store/selectors';
import { fetchTodos, addTodo } from './redux/todoThunks';

export const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const todos = useSelector((state: RootState) => state.todos.todos);
  const status = useSelector((state: RootState) => state.todos.status);
  const error = useSelector((state: RootState) => state.todos.error);
  const errorType = useSelector((state: RootState) => state.todos.errorType);
  // const tempTodo = useSelector((state: RootState) => state.todos.tempTodo);

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
    if (!title) {
      dispatch(setErrorType(ErrorType.EmptyTitle));

      return;
    }

    const newTempTodo = {
      id: 0,
      title,
      completed: false,
    };

    dispatch(setTempTodo(newTempTodo));

    dispatch(addTodo({ title }))
      .then(() => {
        dispatch(clearTempTodo());
        dispatch(setInputValue(''));
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

        <TodoHeader
          handleAddTodo={handleAddTodo}
        />

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

// Focus the text field after receiving a response:

// const inputRef = React.useRef(null);

// useEffect(() => {
//   if (responseReceived) {
//     // Assume responseReceived is a piece of state updated when a response is received
//     inputRef.current.focus();
//   }
// }, [responseReceived]);

// // In your JSX
// <input ref={inputRef} /* other props */ />
