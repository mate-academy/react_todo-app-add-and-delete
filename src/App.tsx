import React, { useEffect, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { getTodos, addTodo, USER_ID, deleteTodo } from './api/todos';
import { ErrorTypes } from './types/ErrorTypes';
import { TodoItem } from './components/TodoItem';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes>(
    ErrorTypes.Empty,
  );
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        if (filterStatus === FilterStatus.All) {
          return true;
        }

        return filterStatus === FilterStatus.Active
          ? !todo.completed
          : todo.completed;
      }),
    [todos, filterStatus],
  );

  const completedTodosCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );
  const todosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const onAddTodo = async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    setIsLoading(true);
    try {
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      setErrorMessage(ErrorTypes.AddTodo);
      throw error;
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    setIsLoading(true);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorTypes.DeleteTodo);
      throw error;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      setIsLoading(false);
    }
  };

  const onClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      onDeleteTodo(todo.id);
    });
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage(ErrorTypes.Loading);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onAddTodo={onAddTodo}
          setErrorMessage={setErrorMessage}
          isLoading={isLoading}
        />

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDeleteTodo={onDeleteTodo}
                  isLoading={loadingTodoIds.includes(todo.id)}
                />
              ))}
              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  onDeleteTodo={onDeleteTodo}
                  isLoading
                />
              )}
            </section>
            <Footer
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              todosCount={todosCount}
              isLoading={isLoading}
              onClearCompleted={onClearCompleted}
              completedTodosCount={completedTodosCount}
            />
          </>
        )}
      </div>

      <ErrorNotification
        data-cy="ErrorNotification"
        error={errorMessage}
        setError={setErrorMessage}
      />
    </div>
  );
};
