/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getCount, getNewTodoId, getTodos } from './api/todos';
import { Todo, Status } from './types/Todo';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { ErrorNotifications } from './components/errorNotifications';
import { Header } from './components/header';

export const App: React.FC = () => {
  const [preparedTodos, setPreparedTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>(Status.all);
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
        switch (selectedFilter) {
          case Status.active:
            setPreparedTodos(todosFromServer.filter(todo => !todo.completed));
            break;
          case Status.complited:
            setPreparedTodos(todosFromServer.filter(todo => todo.completed));
            break;
          default:
            setPreparedTodos(todosFromServer);
        }
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, [isSubmitting, selectedFilter, isLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setPreparedTodos={setPreparedTodos}
          todos={preparedTodos}
          title={title}
          setTitle={setTitle}
          setErrorMessage={setErrorMessage}
          todoId={getNewTodoId(preparedTodos)}
          setIsSubmitting={setIsSubmitting}
          isSubmitting={isSubmitting}
          setTempTodo={setTempTodo}
        />

        {/* Some problems with logic. When filter = complited and we don't have any complite todos, footer has gone */}
        {!!preparedTodos?.length && (
          <>
            <TodoList
              todos={preparedTodos}
              tempTodo={tempTodo}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setErrorMessage={setErrorMessage}
            />
            <Footer
              selectedFilter={selectedFilter}
              onSelect={setSelectedFilter}
              count={getCount(preparedTodos)}
              todos={preparedTodos}
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
