import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorStatus } from './types/ErrorStatus';
import { ErrorNotification } from './components/ErrorNotification';
import { getVisibleTodos } from './utils/getVisibleTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<FilterStatus>(FilterStatus.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [shouldClearInput, setShouldClearInput] = useState(true);
  const [errorMessage, setErrorMessage] = useState<ErrorStatus>(
    ErrorStatus.NoError,
  );

  const visibleTodos = getVisibleTodos(todos, status);
  const errorMessageTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorStatus.LoadError);
        errorMessageTimeout.current = setTimeout(() => {
          setErrorMessage(ErrorStatus.NoError);
        }, 3000);
      });

    return () => {
      clearTimeout(errorMessageTimeout.current);
    };
  }, []);

  const handleErrorMessage = (errorStatus: ErrorStatus) => {
    setErrorMessage(errorStatus);
    errorMessageTimeout.current = setTimeout(() => {
      setErrorMessage(ErrorStatus.NoError);
    }, 3000);
  };

  const onHandleSubmit = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      handleErrorMessage(ErrorStatus.TitleError);

      return;
    }

    setCurrentId(0);
    setIsSubmitting(true);
    setTempTodo({
      userId: USER_ID,
      id: 0,
      title: trimmedTitle,
      completed: false,
    });

    addTodo(trimmedTitle)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        handleErrorMessage(ErrorStatus.AddTodoError);
        setShouldClearInput(false);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
        setCurrentId(null);
      });
  };

  const onHandleDeleteTodo = (id: number) => {
    setCurrentId(id);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        handleErrorMessage(ErrorStatus.RenameTodoError);
      })
      .finally(() => {
        setCurrentId(null);
      });
  };

  const onHandleDeleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      onHandleDeleteTodo(todo.id);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <section className="section container">
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoHeader
            todos={todos}
            onHandleSubmit={onHandleSubmit}
            isSubmitting={isSubmitting}
            shouldClearInput={shouldClearInput}
          />

          <TodoList
            todos={visibleTodos}
            onHandleDeleteTodo={onHandleDeleteTodo}
            currentId={currentId}
            tempTodo={tempTodo}
          />

          {!!todos.length && (
            <TodoFooter
              status={status}
              todos={todos}
              setStatus={setStatus}
              onHandleDeleteCompleted={onHandleDeleteCompleted}
            />
          )}
        </div>
        <ErrorNotification
          errorMassage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </section>
  );
};
