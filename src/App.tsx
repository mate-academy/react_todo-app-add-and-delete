/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { USER_ID } from './api/todos';
import { todoFilterPredicates } from './utils/todoFilterPredicates';

import { Todo } from './types/Todo';
import { TodoFilterEnum } from './enums/TodoFilter';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

import { useTodos } from './hooks/useTodos';
import { useAutoDismissError } from './hooks/useAutoDismissError';

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoFilter, setTodoFilter] = useState<TodoFilterEnum>(
    TodoFilterEnum.All,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const newTodoInputRef = useRef<HTMLInputElement | null>(null);

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const handleClearError = useCallback(() => {
    setErrorMessage('');
  }, []);

  const { todos, loadingTodoIds, loadTodos, addTodo, removeTodo } = useTodos({
    onError: handleError,
    onClearError: handleClearError,
  });

  const handleRemoveTodo = useCallback(
    (todoId: number) => {
      removeTodo(todoId).finally(() => {
        newTodoInputRef.current?.focus();
      });
    },
    [removeTodo],
  );

  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos
      .filter(todo => todo.completed)
      .filter(todo => !loadingTodoIds.includes(todo.id));

    if (completedTodos.length === 0) {
      return;
    }

    const removeTodoPromises = completedTodos.map(todo => removeTodo(todo.id));

    Promise.allSettled(removeTodoPromises).finally(() => {
      newTodoInputRef.current?.focus();
    });
  }, [todos, loadingTodoIds, removeTodo]);

  const handleTempTodoChange = useCallback((temp: Todo | null) => {
    setTempTodo(temp);
  }, []);

  const handleCloseError = useCallback(() => setErrorMessage(''), []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useAutoDismissError(errorMessage, handleCloseError);

  const visibleTodos = useMemo(() => {
    return todos.filter(todoFilterPredicates[todoFilter]);
  }, [todos, todoFilter]);

  const { isAllTodoCompleted, hasTodos, leftTodos, hasCompletedTodo } =
    useMemo(() => {
      const hasAny = todos.length > 0;
      const completedCount = todos.filter(todo => todo.completed).length;

      return {
        hasTodos: hasAny,
        isAllTodoCompleted: hasAny && completedCount === todos.length,
        leftTodos: todos.length - completedCount,
        hasCompletedTodo: completedCount > 0,
      };
    }, [todos]);

  const isClearing = useMemo(() => {
    return todos.some(
      todo => todo.completed && loadingTodoIds.includes(todo.id),
    );
  }, [todos, loadingTodoIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header>
          <TodoForm
            hasTodos={hasTodos}
            isAllTodoCompleted={isAllTodoCompleted}
            newTodoInputRef={newTodoInputRef}
            onAddTodo={addTodo}
            onTempTodoChange={handleTempTodoChange}
            onError={handleError}
            onClearError={handleClearError}
          />
        </Header>

        <TodoList
          onRemoveTodo={handleRemoveTodo}
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
        />

        {hasTodos && (
          <TodoFilter
            todoFilter={todoFilter}
            leftItems={leftTodos}
            hasCompletedTodo={hasCompletedTodo}
            onTodoFilterChange={setTodoFilter}
            onClearCompleted={handleClearCompleted}
            isClearing={isClearing}
          />
        )}
      </div>

      <ErrorMessage message={errorMessage} onCloseError={handleCloseError} />
    </div>
  );
};
