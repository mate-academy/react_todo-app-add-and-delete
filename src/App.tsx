import React, {
  useContext, useEffect, useRef, useState, useMemo, useCallback,
} from 'react';
import { getUserId } from './api/users';
import {
  getTodos, getFilteredTodos, createTodo, deleteTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Title } from './components/Title';
import { Content } from './components/Content/Content';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { Error } from './types/Error';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState(TodoStatus.ALL);
  const [error, setError] = useState<Error | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessed, setIsProcessed] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = useMemo(() => (
    getFilteredTodos(todos, todoFilter)
  ), [todos, todoFilter]);

  const activeTodos = useMemo(() => (
    getFilteredTodos(todos, TodoStatus.ACTIVE)
  ), [todos]);

  const completedTodos = useMemo(() => (
    getFilteredTodos(todos, TodoStatus.COMPLETED)
  ), [todos]);

  const handleTodoFilter = useCallback((filterStatus: TodoStatus) => {
    setTodoFilter(filterStatus);
  }, []);

  const handleError = useCallback((errorType: Error | null) => {
    setError(errorType);
  }, []);
  
  const handleAddTodo = useCallback(
    async (newTitle: string) => {
      setIsAdding(true);
      setError(null);

      try {
        if (!newTitle.trim()) {
          setError(Error.TITLE);
          setIsAdding(false);

          return;
        }

        if (user) {
          setTempTodo({
            id: 0,
            userId: user.id,
            title: newTitle,
            completed: false,
          });

          const createNewTodo = await createTodo({
            userId: user.id,
            title: newTitle,
            completed: false,
          });

          setTodos(allTodos => [...allTodos, createNewTodo]);
        }
      } catch {
        setError(Error.ADD_TODO);
      } finally {
        setIsAdding(false);
        setTempTodo(null);
      }
    }, [],
  );

  type IsProcessedMethod = 'ADD' | 'DELETE';

  const handleIsProcessed = (method: IsProcessedMethod, todoId: number) => {
    switch (method) {
      case 'ADD':
        setIsProcessed(current => [...current, todoId]);
        break;

      case 'DELETE':
        setIsProcessed(
          current => current.filter(id => id !== todoId),
        );
        break;

      default:
        break;
    }
  };

  const handleUpdateTodo = useCallback(
    async (todoId: number, data: {}) => {
      handleIsProcessed('ADD', todoId);
      setError(null);

      try {
        const updatedTodo = await updateTodo(todoId, data);

        setTodos(prev => prev.map(todo => {
          if (todo.id === updatedTodo.id) {
            return updatedTodo;
          }

          return todo;
        }));
      } catch {
        setError(Error.UPDATE_TODO);
      } finally {
        handleIsProcessed('DELETE', todoId);
      }
    }, [],
  );

  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      handleIsProcessed('ADD', todoId);
      setError(null);

      try {
        await deleteTodo(todoId);

        setTodos(allTodos => allTodos.filter(todo => todo.id !== todoId));
      } catch {
        setError(Error.DELETE_TODO);
      } finally {
        handleIsProcessed('DELETE', todoId);
      }
    }, [],
  );

  useEffect(() => {
    const onScreenTimer = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(onScreenTimer);
  }, [error]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(getUserId(user))
        .then(setTodos)
        .catch(() => handleError(Error.SERVER));
    }
  }, []);

  return (
    <div className="todoapp">
      <Title />

      <Content
        todos={filteredTodos}
        newTodo={newTodoField}
        tempTodo={tempTodo}
        activeTodos={activeTodos.length}
        completedTodos={completedTodos}
        todoFilter={todoFilter}
        isTodos={todos.length > 0}
        isAdding={isAdding}
        isProcessed={isProcessed}
        onTodoFilter={handleTodoFilter}
        onAddTodo={handleAddTodo}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodo={handleDeleteTodo}
      />

      {error && (
        <ErrorNotification
          error={error}
          onError={handleError}
        />
      )}
    </div>
  );
};
