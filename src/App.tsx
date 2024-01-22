/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import * as postService from './api/todos';
import { ErrorMessages } from './types/errorMessages';
import { getPrepareTodos } from './utils/getPrepareTodos';

const USER_ID = 11272;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState(FilterOptions.All);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.None);

  const preparedTodos = useMemo(() => {
    return getPrepareTodos(todos, filterOption);
  }, [todos, filterOption]);

  const hasActiveTodo = todos.some(todo => !todo.completed);
  const hasTodo = todos.length > 0;

  const activeTodosCount = todos
    .filter(todo => !todo.completed)
    .length;

  const completedTodoIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.Get);
        setHasError(true);
      });
  }, []);

  const addTodo = useCallback((title: string) => {
    if (!title) {
      setHasError(true);
      setErrorMessage(ErrorMessages.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsDisabled(true);

    postService.createTodo(newTodo)
      .then(todo => setTodos(currentTodos => [...currentTodos, todo]))
      .catch(() => {
        setErrorMessage(ErrorMessages.Add);
        setHasError(true);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  }, []);

  const deleteTodo = useCallback((todoId: number) => {
    setDeletingTodoIds(prevIds => [
      ...prevIds,
      todoId,
    ]);

    postService.deleteTodo(todoId)
      .then(() => {
        setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setTodos(currTodos => currTodos);
        setHasError(true);
        setErrorMessage(ErrorMessages.Delete);
      })
      .finally(() => {
        setDeletingTodoIds([]);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  window.console.log(todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          onAddTodo={addTodo}
          isDisabled={isDisabled}
          hasActiveTodo={hasActiveTodo}
          hasTodo={hasTodo}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={preparedTodos}
              tempTodoTitle={tempTodo?.title}
              deletingTodoIds={deletingTodoIds}
              deleteTodo={deleteTodo}
            />
            <TodoFooter
              filterOption={filterOption}
              onSetFilterOption={setFilterOption}
              activeTodosCount={activeTodosCount}
              completedTodoIds={completedTodoIds}
              deleteTodo={deleteTodo}
            />
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
