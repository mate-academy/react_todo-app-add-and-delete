/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { ErrorMessage } from './types/ErrorMessage';
import { RequestStatus } from './types/RequestStatus';

import * as todoApi from './api/todos';

import { UserWarning } from './UserWarning';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoList } from './components/TodoList';
import { TodoAppFooter } from './components/TodoAppFooter';
import { ErrorNotification } from './components/ErrorNotification';

function filterTodo(todos: Todo[], filterBy: FilterBy): Todo[] {
  switch (filterBy) {
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return [...todos];
  }
}

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.NONE,
  );
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);

  const [tempAddedTodo, setTempAddedTodo] = useState<Todo | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [addingStatus, setAddingStatus] = useState<RequestStatus>(
    RequestStatus.None,
  );

  useEffect(() => {
    setErrorMessage(ErrorMessage.NONE);
    setIsLoading(true);
    todoApi
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.TODO_LOAD))
      .finally(() => setIsLoading(false));
  }, []);

  const addTodo = useCallback((newTodoTitle: string) => {
    if (!newTodoTitle) {
      setErrorMessage(ErrorMessage.TITLE_EMPTY);

      return;
    }

    const todoToAdd = {
      id: 0,
      title: newTodoTitle,
      completed: false,
      userId: todoApi.USER_ID,
    };

    setAddingStatus(RequestStatus.Processing);
    setTempAddedTodo(todoToAdd);

    todoApi
      .addTodo(todoToAdd)
      .then((addedTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setAddingStatus(RequestStatus.None);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.TODO_ADD);
        setAddingStatus(RequestStatus.InError);
      })
      .finally(() => {
        setTempAddedTodo(null);
      });
  }, []);

  const deleteTodo = useCallback((idToDelete: number) => {
    setDeletedIds(ids => [...ids, idToDelete]);

    todoApi
      .deleteTodo(idToDelete)
      .then(() => {
        setDeletedIds(ids => ids.filter(id => id !== idToDelete));
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== idToDelete),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.TODO_DELETE);
      });
  }, []);

  const clearCompleted = useCallback(() => {
    const ids: number[] = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    ids.forEach(id => deleteTodo(id));
  }, [deleteTodo, todos]);

  const updateTodo = useCallback(
    (updatedTodo: Todo) => {
      const newTodos = [...todos];
      const id = todos.findIndex(todo => todo.id === updatedTodo.id);

      newTodos.splice(id, 1, updatedTodo);

      setTodos(newTodos);
      /*todoApi
      .updateTodo(updatedTodo)
      .catch(() => setErrorMessage(ErrorMessage.TODO_UPDATE));*/
    },
    [todos],
  );

  const toggleAll = useCallback((completeAll: boolean) => {
    setTodos(currentTodos =>
      currentTodos.map(todo => ({ ...todo, completed: completeAll })),
    );
  }, []);

  const clearError = useCallback(() => setErrorMessage(ErrorMessage.NONE), []);

  const filteredTodos: Todo[] = useMemo(() => {
    const a = filterTodo(todos, filterBy);

    return a;
  }, [todos, filterBy]);

  if (!todoApi.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          todos={todos}
          addingStatus={addingStatus}
          onAdd={addTodo}
          onToggleAll={toggleAll}
        />

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          todos.length > 0 && (
            <>
              <TodoList
                todos={filteredTodos}
                deletedIds={deletedIds}
                loadingTodo={tempAddedTodo}
                onTodoEdit={updateTodo}
                onTodoRemove={deleteTodo}
              />

              <TodoAppFooter
                todos={todos}
                currentFilter={filterBy}
                onfilterChange={setFilterBy}
                onClearCompleted={clearCompleted}
              />
            </>
          )
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} clearError={clearError} />
    </div>
  );
};
