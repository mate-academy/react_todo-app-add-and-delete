import './styles/todoapp.scss';
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer/footer';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { ErrorNotification } from './components/Error/ErrorNotification';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const handleSubmit = (
    title: string,
    setTitle: (newTitle: string) => void,
  ) => {
    setErrorType(null);
    const preparedTitle = title.trim();

    if (!preparedTitle) {
      setErrorType('title');
      setTimeout(() => {
        setErrorType(null);
      }, 3000);

      return;
    }

    setIsLoading(true);

    const newTodo = {
      userId: USER_ID,
      title: preparedTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    postTodo(newTodo)
      .then(createdTodo => {
        if (createdTodo) {
          setIsLoading(false);
        }

        setTodos(currentTodos => [...(currentTodos ?? []), createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setIsLoading(false);
        setErrorType('add');
        setTimeout(() => {
          setErrorType(null);
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleGetTodos = () => {
    setErrorType(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorType('load');
        setTimeout(() => {
          setErrorType(null);
        }, 3000);
      });
  };

  const visibleTodos = todos?.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.All:
        return todo;

      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      default:
        return;
    }
  });

  useEffect(() => {
    handleGetTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            setErrorType={setErrorType}
            setTodos={setTodos}
          />
        </section>

        {todos && todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            setTodos={setTodos}
            setErrorType={setErrorType}
          />
        )}
      </div>

      <ErrorNotification errorType={errorType} />
    </div>
  );
};
