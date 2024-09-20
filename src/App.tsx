import React, { useCallback, useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';

import { USER_ID } from './api/todos';
import { todos as todosClient } from './api/todos';
import { ErrorNotification } from './Components/ErrorNotification';
import { TodoHead } from './Components/TodoHead';
import { TodoList } from './Components/TodoList';
import { TodoFilter } from './Components/TodoFilter';
import { Errors } from './types/Errors';
import { Filters } from './types/Filters';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filter, setFilter] = useState<Filters>(Filters.all);
  const [inputResetFlag, setInputResetFlag] = useState(Math.random());
  const [inputLoadingFlag, setInputLoadingFlag] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<string | null>(null);

  const handleErrors = (error: Errors) => {
    window.setTimeout(() => {
      setErrorMessage(error);
    }, 300);
  };

  const filtering = (arr: Todo[], filterParam: Filters): Todo[] | [] => {
    const filteredArr = [...arr];

    switch (filterParam) {
      case Filters.completed:
        return filteredArr.filter(todo => todo.completed);

      case Filters.active:
        return filteredArr.filter(todo => !todo.completed);

      case Filters.all:
      default:
        return filteredArr;
    }
  };

  const filteredTodos: Todo[] = filtering(todos, filter);

  // Initial TODOs loading
  useEffect(() => {
    todosClient
      .get()
      .then(res => {
        setTodos(() => res);
      })
      .catch(() => {
        handleErrors(Errors.load);
      });
  }, []);

  // Error Reset
  useEffect(() => {
    window.setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, [errorMessage]);

  const addTodos = useCallback((newTodoTitle: string) => {
    setInputLoadingFlag(true);
    setTempTodo(newTodoTitle);
    todosClient
      .add({
        title: newTodoTitle,
        userId: +USER_ID,
        completed: false,
      })
      .then(res => {
        setTodos(current => [...current, res]);
        setInputResetFlag(Math.random());
      })
      .catch(() => {
        handleErrors(Errors.add);
      })
      .finally(() => {
        setInputLoadingFlag(false);
        setTempTodo(null);
      });
  }, []);

  const deleteTodos = useCallback((idDelete: number) => {
    setLoadingTodoId(() => idDelete);
    todosClient
      .delete(idDelete)
      .then(() => {
        setTodos(cuurent => cuurent.filter(todo => todo.id !== idDelete));
      })
      .catch(() => {
        handleErrors(Errors.delete);
      })
      .finally(() => {
        setLoadingTodoId(() => null);
        setInputResetFlag(Math.random());
      });
  }, []);

  const deleteAllCompleted = useCallback(() => {
    Promise.allSettled(
      todos.filter(todo => {
        if (todo.completed) {
          return deleteTodos(todo.id);
        }
      }),
    )
      .catch(() => handleErrors(Errors.delete))
      .finally(() => setInputResetFlag(Math.random()));
  }, [todos, deleteTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHead
          todos={filteredTodos}
          onAdd={addTodos}
          setError={setErrorMessage}
          resetFlag={inputResetFlag}
          loadingFlag={inputLoadingFlag}
        />

        <TodoList
          todos={filteredTodos}
          tempTodoTitle={tempTodo}
          loadingId={loadingTodoId}
          onDelete={deleteTodos}
        />

        <TodoFilter
          todos={todos}
          filter={filter}
          onClick={setFilter}
          onDeleteAllCompleted={deleteAllCompleted}
        />
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
