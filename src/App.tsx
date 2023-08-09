import React, { useEffect, useState } from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoError } from './components/TodoError/TodoError';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 11276;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  if (isError) {
    setTimeout(() => setIsError(false), 3000);
  }

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setIsError(true);
        setErrorMessage('Unable to fetch todos');
      });
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const createTodo = async (todoTitle: string) => {
    const preparedTodo: Omit<Todo, 'id'> = {
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ ...preparedTodo, id: 0 });

    try {
      const newTodo = await postTodo(preparedTodo);

      setTodos([...todos, newTodo]);
    } catch (e) {
      setErrorMessage('Unable to add a todo');
      setIsError(true);
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);
    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setErrorMessage('Unable to delete a todo');
      setIsError(true);
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !== todoId));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
          createTodo={createTodo}
        />

        <TodoList
          todos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          removeTodo={removeTodo}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isLoading
            removeTodo={removeTodo}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filterStatus={filterStatus}
            onFilterStatus={setFilterStatus}
            removeTodo={removeTodo}
          />
        )}
      </div>

      <TodoError
        isError={isError}
        onSetError={setIsError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
