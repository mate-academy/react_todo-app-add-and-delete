/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, getTodos, deleteTodo, addTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { getFilteredTodos } from './helpers';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentError, setCurrentError] = useState<Error | null>(null);
  const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.All);
  const [deleteTodoId, setDeleteTodoId] = useState<Todo['id'] | null>(null);
  const [addTodoTitle, setAddTodoTitle] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isNewTodoLoading, setIsNewTodoLoading] = useState<boolean>(false);
  // const [errorTimeoutId, setErrorTimeoutId] = useState<NodeJS.Timeout | null>(
  //   null,
  // );

  const newTodoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If there's no error
    // if (!currentError) {
    //   setErrorTimeoutId(null);
    // }

    // // If there is a timer
    // if (errorTimeoutId) {

    //   clearTimeout(errorTimeoutId);
    // }

    // Set a timeout to delete it
    // const timeout = setTimeout(() => setCurrentError(null), 3000);

    if (currentError) {
      newTodoInput.current?.focus();

      setTimeout(() => setCurrentError(null), 3000);
    }

    // Remember new timeout's id
    // setErrorTimeoutId(timeout);
  }, [currentError]);

  useEffect(() => {
    newTodoInput.current?.focus();
  }, [todos, newTodoInput]);

  useEffect(() => {
    if (deleteTodoId) {
      setCurrentError(null);

      deleteTodo(deleteTodoId)
        .then(() => {
          getTodos()
            .then(setTodos)
            .catch(() => {
              setCurrentError(Error.CannotLoad);
            });
        })
        .catch(() => {
          setCurrentError(Error.CannotDelete);
        })
        .finally(() => setDeleteTodoId(null));
    }
  }, [deleteTodoId]);

  useEffect(() => {
    if (addTodoTitle === null) {
      return;
    }

    // setCurrentError(null);
    // console.log('Error: ', currentError);

    if (addTodoTitle.length === 0) {
      setAddTodoTitle(null);
      // console.log('Set Error Back again');
      setCurrentError(Error.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: addTodoTitle,
      completed: false,
    });

    setIsNewTodoLoading(true);

    addTodo(addTodoTitle)
      .then(newTodo => {
        // When this response get's back -> We want to:
        // - Focus the header input
        // - Remove the header input value
        setTodos(
          (currentTodos: Todo[]) => [...currentTodos, newTodo] as Todo[],
        );

        setAddTodoTitle(null);
      })
      .catch(() => {
        setCurrentError(Error.CannotAdd);
      })
      .finally(() => {
        setTempTodo(null);
        setIsNewTodoLoading(false);
      });
  }, [addTodoTitle]);

  useEffect(() => {
    setCurrentError(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setCurrentError(Error.CannotLoad);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosAmount = todos.filter(
    (todo: Todo) => !todo.completed,
  ).length;

  const handleFilterChange = (filter: Filter) => {
    return () => setCurrentFilter(filter);
  };

  // const allTodos = tempTodo ? todos.concat(tempTodo) : todos;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleAddTodo={setAddTodoTitle}
          addTodoTitle={addTodoTitle}
          newTodoInput={newTodoInput}
          isNewTodoLoading={isNewTodoLoading}
        />

        {todos.length > 0 && (
          <TodoList
            todos={getFilteredTodos(todos, currentFilter)}
            handleDeleteTodo={setDeleteTodoId}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            handleDeleteTodo={setDeleteTodoId}
            isTemp={true}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            activeTodosAmount={activeTodosAmount}
            currentFilter={currentFilter}
            handleFilterChange={handleFilterChange}
          />
        )}
      </div>

      <ErrorNotification
        currentError={currentError}
        setCurrentError={setCurrentError}
      />
    </div>
  );
};
