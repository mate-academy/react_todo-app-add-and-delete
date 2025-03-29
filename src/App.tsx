/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodos, getTodos } from './api/todos';
import { Header } from './components/Header';
import { Error } from './components/Error';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Error';
import { TodoStatus } from './types/TodoStatus';
import { useErrorHandler } from './hooks/useErrorHandler';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoStatus>(TodoStatus.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const { error, handleError } = useErrorHandler();
  const [loading, setLoading] = useState<number[]>([]);

  const receiveData = async () => {
    try {
      const data = await getTodos();

      setTodos(data);
    } catch (err) {
      handleError(ErrorType.loading_error, 3000);
    }
  };

  const updateTodoStatus = (id: number, completed: boolean) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, completed } : todo)),
    );
  };

  const deleteItemFromTodos = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const clearAllCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setLoading(completedTodosIds);

    try {
      const deleteRequests = completedTodosIds.map(async todoId => {
        try {
          await deleteTodos(todoId);
          deleteItemFromTodos(todoId);
        } catch {
          handleError(ErrorType.delete_error, 3000);
        }
      });

      Promise.allSettled(deleteRequests);
    } catch {
      handleError(ErrorType.delete_error, 3000);
    } finally {
      setLoading([]);
    }
  };

  const filterData = (filterBy: TodoStatus) => {
    switch (filterBy) {
      case TodoStatus.active:
        return todos.filter(todo => !todo.completed);

      case TodoStatus.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  useEffect(() => {
    receiveData();
  }, []);

  const visibleTodos = filterData(filter);

  return (
    <div className="todoapp">
      {!USER_ID ? (
        <UserWarning />
      ) : (
        <>
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header
              setTodos={setTodos}
              todos={todos}
              setError={handleError}
              setTempTodo={setTempTodo}
              tempTodo={tempTodo}
            />

            {todos.length > 0 && (
              <>
                <TodoList
                  todos={visibleTodos}
                  setUpdateTodoStatus={updateTodoStatus}
                  tempTodo={tempTodo}
                  setError={handleError}
                  setDeleteItemFromTodos={deleteItemFromTodos}
                  loading={loading}
                  setLoading={setLoading}
                />
                <Footer
                  filterBy={filter}
                  setFilterBy={setFilter}
                  todos={todos}
                  clearAllCompletedTodos={clearAllCompletedTodos}
                />
              </>
            )}
          </div>

          <Error error={error} setError={handleError} />
        </>
      )}
    </div>
  );
};
