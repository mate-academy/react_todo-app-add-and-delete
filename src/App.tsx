/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filters } from './types/Filters';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';

const USER_ID = 11564;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterTodos, setFilterTodos] = useState<Filters>('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingItems, setLoadingItems] = useState<number[]>([]);

  const completedTodoCount = todos.some(todo => todo.completed);

  const updateTodos = (newTodo: Todo) => {
    setTodos((prevState) => {
      if (newTodo === null) {
        return prevState;
      }

      return [...prevState, newTodo];
    });
  };

  const handleFilterTodos
  = (todosArray: Todo[], option: Filters): Todo[] => {
    return todosArray.filter((todo) => {
      if (option === 'Active') {
        return !todo.completed;
      }

      if (option === 'Completed') {
        return todo.completed;
      }

      return true;
    });
  };

  const MadeTodoList = () => {
    return handleFilterTodos(todos, filterTodos);
  };

  useEffect(() => {
    setErrorMessage('');
    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then((data) => setTodos(data))
      .then(() => setTempTodo(null))
      .catch(() => {
        setErrorMessage('Unable to load todos');
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
          USER_ID={USER_ID}
          todos={todos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          updateTodos={updateTodos}
          setLoadingItems={setLoadingItems}
        />

        <TodoList
          todos={MadeTodoList()}
          setTodos={setTodos}
          tempTodo={tempTodo}
          setErrorMessage={setErrorMessage}
          setLoadingItems={setLoadingItems}
          loadingItems={loadingItems}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            filterTodos={filterTodos}
            setFilterTodos={setFilterTodos}
            setErrorMessage={setErrorMessage}
            completedTodoCount={completedTodoCount}
            setLoadingItems={setLoadingItems}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
