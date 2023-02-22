import React, { useState, useEffect, useCallback } from 'react';
import { deleteTodo, getTodos } from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { Options } from './types/Options';
import { getFilteredTodos } from './utils/filterTodos';
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 6345;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>(
    ErrorMessages.NOERROR,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(Options.ALL);
  const [loadingTodoIds, setLoadingTodoIds] = useState([0]);

  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setErrorMessage(ErrorMessages.NOERROR);

      setTodos((prevTodos: Todo[]): Todo[] => {
        return prevTodos.filter(item => item.id !== todoId);
      });
    } catch (error) {
      setErrorMessage(ErrorMessages.ONDELETE);
    }
  };

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setLoadingTodoIds(prevIds => ([...prevIds, todoId]));
    await removeTodo(todoId);
    setLoadingTodoIds(prevIds => prevIds.filter((prevId) => prevId !== todoId));
  }, []);

  const deleteCompletedTodos = useCallback(() => {
    const completedTodosToDelete = getFilteredTodos(todos, Options.COMPLETED);

    completedTodosToDelete.forEach(todo => handleDeleteTodo(todo.id));
  }, [todos]);

  const visibleTodos = getFilteredTodos(todos, filterType);

  const completedTodos: boolean = todos.some(item => item.completed);

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setErrorMessage(ErrorMessages.NOERROR);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(ErrorMessages.ONLOAD);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          userId={USER_ID}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
        />
        {!!todos.length
          && (
            <TodoList
              todos={visibleTodos}
              handleDeleteTodo={handleDeleteTodo}
              loadingTodoIds={loadingTodoIds}
            />
          )}
        {tempTodo
        && (
          <TodoItem
            todo={tempTodo}
            loadingTodoIds={loadingTodoIds}
          />
        )}

        {!!todos.length && (
          <Footer
            setFilterType={setFilterType}
            completedTodos={completedTodos}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}

      </div>
      {!!errorMessage
        && (
          <ErrorNotification
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
    </div>
  );
};
