import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { FilterType } from './types/FilterType';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const visibleTodos = useMemo(
    () =>
      todos.filter(todo => {
        if (filterType === FilterType.All) {
          return true;
        }

        return filterType === FilterType.Completed
          ? todo.completed
          : !todo.completed;
      }),
    [todos, filterType],
  );

  const inputField = useRef<HTMLInputElement>(null);

  const isAllCompleted = todos.every(todo => todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const onAddTodo = async (newTodoTitle: string) => {
    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      title: newTodoTitle,
      completed: false,
      userId: todoService.USER_ID,
    });
    try {
      const newTodo = await todoService.addTodo({
        title: newTodoTitle,
        completed: false,
        userId: todoService.USER_ID,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      setErrorMessage(ErrorTypes.Adding);
      inputField?.current?.focus();
      throw error;
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  };

  const onDeleteTodo = async (todoToDelete: number) => {
    setLoadingTodoIds(prev => [...prev, todoToDelete]);
    try {
      await todoService.deleteTodo(todoToDelete);
      setTodos(prev => prev.filter(todo => todo.id !== todoToDelete));
    } catch (error) {
      setErrorMessage(ErrorTypes.Deleting);
      inputField?.current?.focus();
      throw error;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoToDelete));
    }
  };

  const onClearcompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    completed.forEach(todo => {
      onDeleteTodo(todo.id);
    });
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.Loading);
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          onAddTodo={onAddTodo}
          isSubmitting={isSubmitting}
          setErrorMessage={setErrorMessage}
          todosLength={todos.length}
          inputField={inputField}
        />
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map((todo: Todo) => (
            <TodoItem
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              key={todo.id}
              isLoading={loadingTodoIds.includes(todo.id)}
            />
          ))}
          {tempTodo && (
            <TodoItem todo={tempTodo} onDeleteTodo={onDeleteTodo} isLoading />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodos={completedTodos}
            filterType={filterType}
            setFilterType={setFilterType}
            onClearcompleted={onClearcompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
