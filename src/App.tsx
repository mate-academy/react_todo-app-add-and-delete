/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import * as postService from './api/todos';
import { ErrorMessages } from './types/errorMessages';
import { prepareTodos } from './utils/prepareTodos';

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
    return prepareTodos(todos, filterOption);
  }, [todos, filterOption]);

  const allTodoCompleted = todos.every(todo => todo.completed);
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

  const addTodo = (title: string) => {
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
  };

  const deleteTodo = () => {
    deletingTodoIds.forEach(id => {
      postService.deleteTodo(id)
        .then(() => {
          setTodos(currTodos => currTodos.filter(todo => todo.id !== id));
        })
        .catch(() => {
          setTodos(todos);
          setHasError(true);
          setErrorMessage(ErrorMessages.Delete);
        })
        .finally(() => {
          setDeletingTodoIds([]);
        });
    });
  };

  useEffect(() => {
    deleteTodo();
  }, [deletingTodoIds]);

  useEffect(() => {
    setTimeout(() => {
      setHasError(false);
    }, 3000);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          onAddTodo={addTodo}
          isDisabled={isDisabled}
          allTodoCompleted={allTodoCompleted}
          hasTodo={hasTodo}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={preparedTodos}
              tempTodoTitle={tempTodo?.title}
              deletingTodoIds={deletingTodoIds}
              setDeletingTodoIds={setDeletingTodoIds}
            />
            <TodoFooter
              filterOption={filterOption}
              onSetFilterOption={setFilterOption}
              activeTodosCount={activeTodosCount}
              completedTodoIds={completedTodoIds}
              setDeletingTodoIds={setDeletingTodoIds}
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
