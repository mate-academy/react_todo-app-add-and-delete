/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { Error } from './components/Error';
import { TodoList } from './components/TodoList';
import { FilterStatus } from './types/FilterTypes';
import { ErrorType } from './types/ErrorTypes';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  // #region state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.Empty);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputAddRef = useRef<HTMLInputElement>(null);
  // #endregionstate

  // #region lifecycle
  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        if (filterStatus === FilterStatus.All) {
          return true;
        }

        return filterStatus === FilterStatus.Completed
          ? todo.completed
          : !todo.completed;
      }),
    [todos, filterStatus],
  );

  const todosLeftNum = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const todosCompleted = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const addTodo = async (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: todoService.USER_ID,
    });
    try {
      const newTodo = await todoService.createTodos({
        title: todoTitle,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setErrorMessage(ErrorType.AddTodo);
      inputAddRef?.current?.focus();
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onRemoveTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await todoService.deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(ErrorType.DeleteTodo);
      inputAddRef?.current?.focus();
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      onRemoveTodo(todo.id);
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await todoService.getTodos();

        setTodos(data);
      } catch (err) {
        setErrorMessage(ErrorType.LoadTodos);
      }
    })();
  }, []);

  // #endregionlife

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={addTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={!!tempTodo}
          todosLength={todos.length}
          inputRef={inputAddRef}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              onRemoveTodo={onRemoveTodo}
              loadingTodoIds={loadingTodoIds}
            />
            {tempTodo && (
              <TodoItem todo={tempTodo} onRemoveTodo={onRemoveTodo} isLoading />
            )}
            <Footer
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              todosLeft={todosLeftNum}
              todosCompleted={todosCompleted}
              onClearCompleted={onClearCompleted}
            />
          </>
        )}

        {/* Hide the footer if there are no todos */}
      </div>

      <Error error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
