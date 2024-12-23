/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import { createTodos, deleteTodo, getTodos, USER_ID } from './api/todos';

import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';

import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { Status } from './types/Status';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Default,
  );
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeStatus, setActiveStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredTodos = getFilteredTodos(todos, activeStatus);
  const notCompletedTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const onAddTodo = (title: string) => {
    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    const newTodo: Omit<Todo, 'id'> = {
      title,
      userId: USER_ID,
      completed: false,
    };

    return createTodos(newTodo)
      .then(todo => setTodos(currentTodos => [...currentTodos, todo]))
      .catch(err => {
        setErrorMessage(ErrorMessage.UnableToAdd);
        throw err;
      })
      .finally(() => setTempTodo(null));
  };

  const onDeleteTodo = (todoId: number) => {
    setLoadingTodos(prevTodos => [...prevTodos, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
      })
      .finally(() =>
        setLoadingTodos(prevTodos => prevTodos.filter(id => todoId !== id)),
      );
  };

  const onDeleteAllCompleted = () => {
    completedTodos.forEach(todo => onDeleteTodo(todo.id));
  };

  useEffect(() => {
    getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          inputRef={inputRef}
          onAddTodo={onAddTodo}
          error={errorMessage}
          setErrorMessage={setErrorMessage}
          isInputDisablet={!!tempTodo}
          isDeletedTodos={loadingTodos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onDeleteTodo={onDeleteTodo}
          loadingTodos={loadingTodos}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <TodoFooter
            notCompletedTodos={notCompletedTodos}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            completedTodos={completedTodos.length}
            onDeleteAllCompleted={onDeleteAllCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
