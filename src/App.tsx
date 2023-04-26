/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { getTodos, deleteTodo, postTodo } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Notification } from './components/Notification/Notification';
import { TodoList } from './components/TodoList/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { ErrorTypes } from './types/ErrorTypes';
import { Header } from './components/Header/Header';

const USER_ID = 9943;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterStatus>(FilterStatus.All);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisableInput, setIsDisableInput] = useState(false);
  const [processedIds, setProcessedIds] = useState<number[]>([]);

  const handleGetTodos = async () => {
    try {
      if (USER_ID) {
        const listOfTodos = await getTodos(USER_ID);

        setTodos(listOfTodos);
      }
    } catch {
      setError(ErrorTypes.LOAD);
    } finally {
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    handleGetTodos();
  }, []);

  const filterTodos = () => {
    switch (filterType) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);

      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const handleAddTodo = useCallback(async (title: string) => {
    setError(null);
    setIsDisableInput(true);

    try {
      if (!title.trim()) {
        setError(ErrorTypes.INPUT);

        return;
      }

      if (USER_ID) {
        const dataNewTodo = {
          userId: USER_ID,
          title,
          completed: false,
        };

        setTempTodo({ ...dataNewTodo, id: 0 });

        const newTodo = await postTodo(dataNewTodo);

        setTodos(prevTodos => [...prevTodos, newTodo]);
      }
    } catch {
      setError(ErrorTypes.ADD);
    } finally {
      setTempTodo(null);
      setIsDisableInput(false);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setError(null);
    setProcessedIds(deleteIds => [...deleteIds, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos
        .filter(currentTodo => currentTodo.id !== todoId));
    } catch {
      setError(ErrorTypes.DELETE);
    } finally {
      setProcessedIds(deleteIds => deleteIds.filter(id => id !== todoId));
    }
  }, [processedIds]);

  const completedTodos = useMemo(() => todos.filter(todo => todo.completed),
    [todos]);

  const handleClearCompleted = useCallback(() => {
    setProcessedIds(completedTodos.map(todo => todo.id));
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  }, [completedTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          createTodo={handleAddTodo}
          isDisableInput={isDisableInput}
        />

        <section className="todoapp__main">
          <TodoList
            todos={filterTodos()}
            tempTodo={tempTodo}
            deleteTodo={handleDeleteTodo}
            processedIds={processedIds}
          />
        </section>

        {todos.length > 0 && (
          <Footer
            setFilterType={setFilterType}
            filterType={filterType}
            todos={todos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {error && <Notification error={error} />}
    </div>
  );
};
