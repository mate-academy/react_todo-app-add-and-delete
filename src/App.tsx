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

const USER_ID = 6345;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(Options.ALL);
  const [loadingTodoIds, setLoadingTodoIds] = useState([0]);

  // const [userId, setUserId] = useState<number>(USER_ID);

  const removeTodo = async (todoId: number) => {
    try {
      setErrorMessage('');
      await deleteTodo(todoId);

      setTodos((prevTodos: Todo[]): Todo[] => {
        return prevTodos.filter(item => item.id !== todoId);
      });
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
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
      setErrorMessage('');
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage('Unable to recieve todos');
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

        {/* This todo is being edited */}
        {/* <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form> */}

        {/* <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

        {!!todos.length
          && (
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
