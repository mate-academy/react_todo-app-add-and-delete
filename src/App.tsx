/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorMessages } from './types/ErrorMessages';
import { useTodoActions } from './hooks/useTodoActions';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleHideError = useCallback(() => setErrorMessage(null), []);

  const { processingTodoIds, deleteSingleTodo, deleteCompletedTodos } =
    useTodoActions(setTodos, setErrorMessage);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(ErrorMessages.FetchFailed);
      } finally {
        setTodosLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          processingTodoIds={processingTodoIds}
        />
        {!todosLoading && (
          <>
            <TodoList
              todos={todos}
              filter={filter}
              onDeleteTodo={deleteSingleTodo}
              tempTodo={tempTodo}
              processingTodoIds={processingTodoIds}
            />

            {todos.length > 0 && (
              <Footer
                todos={todos}
                filter={filter}
                setFilter={setFilter}
                onDeleteCompleted={deleteCompletedTodos}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHideError={handleHideError}
      />
    </div>
  );
};
