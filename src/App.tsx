/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos, removeTodo } from './api/todos';
import { ErrorType } from './types/Error';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/FilterConditions';
import { USER_ID } from './constants';
import { ErrorNotification } from './components/ErrorNotification';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [processing, setProcessing] = useState<number[]>([]);

  const uploadTodos = useCallback(async () => {
    try {
      const uploadedTodos = await getTodos(USER_ID);

      setTodos(uploadedTodos);
    } catch {
      setError(ErrorType.Load);
    }
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      case Filter.All:
      default:
        return [...todos];
    }
  }, [todos, filter]);

  const handleClearCompletedClick = () => {
    todos.forEach(async todo => {
      if (!todo.completed) {
        return;
      }

      try {
        setProcessing(prev => [...prev, todo.id]);
        await removeTodo(todo.id);
        setTodos(prev => prev.filter(({ id }) => id !== todo.id));
      } catch {
        setError(ErrorType.Delete);
      } finally {
        setProcessing(prev => prev.filter(id => id !== todo.id));
      }
    });
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setProcessing(prev => [...prev, todoId]);
      await removeTodo(todoId);
      setTodos(prev => prev.filter(({ id }) => id !== todoId));
    } catch {
      setError(ErrorType.Delete);
    } finally {
      setProcessing(prev => prev.filter(id => id !== todoId));
    }
  };

  useEffect(() => {
    uploadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onChangeTempTodo={setTempTodo}
          onChangeTodos={setTodos}
          onChangeError={setError}
          onChangeProcessing={setProcessing}
        />

        <TodoList
          preparedTodos={filteredTodos}
          tempTodo={tempTodo}
          processing={processing}
          onRemoveTodo={deleteTodo}
        />

        {todos.length && (
          <Footer
            todos={todos}
            filterCondition={filter}
            onChangeFilter={setFilter}
            handleClearCompleted={handleClearCompletedClick}
          />
        )}
      </div>

      <ErrorNotification error={error} onChangeError={setError} />
    </div>
  );
};
