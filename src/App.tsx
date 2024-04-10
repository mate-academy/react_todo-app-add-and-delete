import { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorStatus } from './types/ErrorStatus';
import { ErrorNotification } from './components/ErrorNotification';
import { wait } from './utils/fetchClient';
import { getVisibleTodos } from './utils/getVisibleTodos';
import { TodoItem } from './components/TodoItem';
import React from 'react';

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

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorStatus.LoadError);
        wait(3000).then(() => {
          setErrorMessage(ErrorStatus.NoError);
        });
      });
  }, []);

  const onHandleSubmit = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorStatus.TitleError);
      wait(3000).then(() => {
        setErrorMessage(ErrorStatus.NoError);
      });

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
        setErrorMessage(ErrorStatus.AddTodoError);
        wait(3000).then(() => setErrorMessage(ErrorStatus.NoError));
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
        setErrorMessage(ErrorStatus.RenameTodoError);
        wait(3000).then(() => setErrorMessage(ErrorStatus.NoError));
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
          />

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              currentId={currentId}
              onHandleDeleteTodo={onHandleDeleteTodo}
            />
          )}

          {todos.length > 0 && (
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
