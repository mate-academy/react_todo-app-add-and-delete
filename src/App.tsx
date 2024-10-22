/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useCallback } from 'react';
import { getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { ErrorMessages } from './types/ErrorTypes';
import { FilterTypes } from './types/FilterTypes';

import { getVisibleTodos } from './utils/getVisibleTodos';
import { handleError } from './utils/handleError';

import * as todoService from './api/todos';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorPannel } from './components/ErrorPannel';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosToDelete, setTodosToDelete] = useState<number[]>([]);
  const [selectedFilterType, setSelectedFilterType] = useState<FilterTypes>(
    FilterTypes.ALL,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NONE,
  );

  function handleUpload() {
    getTodos()
      .then(setTodos)
      .catch(() => handleError(setErrorMessage, ErrorMessages.LOAD_FAIL));
  }

  const isAllCompleted =
    todos.every(todo => todo.completed) && todos.length !== 0;
  const filteredTodos = getVisibleTodos(todos, selectedFilterType);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  function handleClearCompleted() {
    setTodosToDelete(completedIds);
  }

  const deleteTodos = useCallback(
    (idsToDelete: number[]) => {
      const promises = idsToDelete.map(id => {
        todoService
          .deleteTodo(id)
          .then(() => {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
            setTodosToDelete(() => []);
          })
          .catch(() => {
            setTodos(todos);
            handleError(setErrorMessage, ErrorMessages.DELETE_FAIL);
            setTodosToDelete(() => []);
          });
      });

      return Promise.allSettled(promises);
    },
    [setTodos, setTodosToDelete, setErrorMessage, todos],
  );

  function addTodo({ title, userId, completed }: Todo) {
    return todoService
      .addTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);
        handleError(setErrorMessage, ErrorMessages.ADD_FAIL);

        throw error;
      });
  }

  function updateTodo(data: Todo, id: number) {
    return todoService
      .updateTodo(id, data)
      .then(updatedTodo => {
        setTodos(
          todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
        );
      })
      .catch(error => {
        handleError(setErrorMessage, ErrorMessages.UPDATE_FAIL);

        throw error;
      });
  }

  useEffect(handleUpload, [todosToDelete.length]);

  useEffect(() => {
    deleteTodos(todosToDelete);
  }, [deleteTodos, todosToDelete]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onTempTodo={setTempTodo}
          onErrorMessage={setErrorMessage}
          isAllCompleted={isAllCompleted}
          onAdd={addTodo}
          todos={todos}
        />
        {!!todos.length && (
          <>
            <TodoList
              onTodosToDelete={setTodosToDelete}
              todos={filteredTodos}
              todosToDelete={todosToDelete}
              tempTodo={tempTodo}
              onUpdate={updateTodo}
            />
            <TodoFooter
              onSelectedFilterType={setSelectedFilterType}
              selectedFilterType={selectedFilterType}
              activeTodosCount={activeTodosCount}
              completedTodosIds={completedIds}
              clearCompletedTodos={handleClearCompleted}
            />
          </>
        )}
      </div>
      <ErrorPannel errorMessage={errorMessage} />
    </div>
  );
};
