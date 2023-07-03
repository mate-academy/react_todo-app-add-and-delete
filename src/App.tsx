/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import { Todo } from './types/Todo';
import { TodoStatusFilter } from './types/TodoStatusFilter';
import { getFilteredTodos } from './helpers';
import { createTodo, deleteTodo, getTodos } from './api/todos';

import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoError } from './components/TodoError/TodoError';

const USER_ID = 10884;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState(TodoStatusFilter.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputTitle, setInputTitle] = useState<string>('');
  const [isLoadingTodo, setIsLoading] = useState<number[]>([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch((errorFromServer) => {
        setError(errorFromServer.message);
      });
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (error) {
      timerId = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => clearTimeout(timerId);
  }, [error]);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, statusFilter);
  }, [statusFilter, todos]);

  const selectStatusFilter = useCallback((status: TodoStatusFilter) => {
    setStatusFilter(status);
  }, []);

  const addError = (errorText: string) => {
    setError(errorText);
  };

  const closeError = useCallback(() => {
    setError(null);
  }, []);

  const addTodo = async (todoTitle: string) => {
    const newTodo = {
      userId: USER_ID,
      completed: false,
      title: todoTitle,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await createTodo(newTodo);

      setTodos((currentTodos) => [...currentTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setInputTitle('');
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      setIsLoading((currentTodoIds) => [...currentTodoIds, todoId]);
      await deleteTodo(todoId);
      setTodos((currentTodos) => currentTodos.filter(todo => (
        todo.id !== todoId)));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsLoading((currentTodos) => (
        currentTodos.filter((id => id !== todoId))));
    }
  };

  const onIputTodoTitle = (todoTitle: string) => {
    setInputTitle(todoTitle);
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const isVisibleClearCompleted = completedTodosCount > 0;
  const isVisibleTodoList = todos.length > 0;
  const isVisibleToggleAllActive = todos.length > 0;

  const isActiveToggleAllActive = completedTodosCount > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isActiveToggleAllActive={isActiveToggleAllActive}
          isVisibleToggleAllActive={isVisibleToggleAllActive}
          title={inputTitle}
          onInputTitle={onIputTodoTitle}
          onAddTodo={addTodo}
          onAddError={addError}
        />

        {isVisibleTodoList && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              isLoadingTodo={isLoadingTodo}
              onRemoveTodo={removeTodo}
            />

            <TodoFooter
              status={statusFilter}
              onSelectStatusFilter={selectStatusFilter}
              uncompletedTodosCount={activeTodosCount}
              isVisibleClearCompleted={isVisibleClearCompleted}
              todos={todos}
              onRemoveTodo={removeTodo}
            />
          </>
        )}
      </div>

      <TodoError error={error} onCloseError={closeError} />
    </div>
  );
};
