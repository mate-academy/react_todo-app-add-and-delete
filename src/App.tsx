/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { ErrorType } from './types/ErrorType';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.Empty);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = useMemo(() => {
    if (filterStatus === FilterStatus.All) {
      return todos;
    }

    return todos.filter(todo =>
      filterStatus === FilterStatus.Completed
        ? todo.completed
        : !todo.completed,
    );
  }, [todos, filterStatus]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const onAddTodo = async (todoTitle: string) => {
    try {
      setTempTodo({
        id: 0,
        title: todoTitle,
        completed: false,
        userId: USER_ID,
      });
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      setErrorMessage(ErrorType.UnableToAdd);
      throw error;
    } finally {
      setTempTodo(null);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const onRemoveTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorType.UnableToDelete);
      throw error;
    } finally {
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage(ErrorType.UnableToLoad);
      }
    })();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={onAddTodo}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              onRemoveTodo={onRemoveTodo}
              loadingTodoIds={loadingTodoIds}
            />
            <TodoFooter
              activeTodosCount={activeTodosCount}
              setFilter={setFilterStatus}
              filter={filterStatus}
              onClearCompleted={onClearCompleted}
              completedTodosCount={completedTodosCount}
            />
          </>
        )}
      </div>
      <ErrorNotification error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
