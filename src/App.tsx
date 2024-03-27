/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getCount,
  getNewTodoId,
  getTodos,
  getVisibleTodos,
} from './api/todos';
import { Todo, Status } from './types/Todo';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { ErrorNotifications } from './components/errorNotifications';
import { Header } from './components/header';

export const App: React.FC = () => {
  const [preparedTodos, setPreparedTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>(Status.All);
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number | null>(null);

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setPreparedTodos(todosFromServer);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, [isLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getVisibleTodos(preparedTodos, selectedFilter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setPreparedTodos={setPreparedTodos}
          todos={visibleTodos}
          title={title}
          setTitle={setTitle}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          todoId={getNewTodoId(preparedTodos)}
          setIsSubmitting={setIsSubmitting}
          isSubmitting={isSubmitting}
          setTempTodo={setTempTodo}
        />

        {!!preparedTodos?.length && (
          <>
            <TodoList
              todos={visibleTodos}
              setPreparedTodos={setPreparedTodos}
              tempTodo={tempTodo}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setErrorMessage={setErrorMessage}
            />

            <Footer
              setPreparedTodos={setPreparedTodos}
              selectedFilter={selectedFilter}
              onSelect={setSelectedFilter}
              count={getCount(preparedTodos)}
              todos={visibleTodos}
              setIsLoading={setIsLoading}
              setErrorMessage={setErrorMessage}
            />
          </>
        )}
      </div>

      <ErrorNotifications message={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
