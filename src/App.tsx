/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';

import { getTodos, addTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterBy } from './types/FilterBy';
import { ErrorNotification } from './components/ErrorNotifications';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [hasError, setHasError] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTodoId, setselectedTodoId] = useState<number[]>([0]);
  const tempTodo = {
    id: 0,
    title: '',
    completed: false,
    userId: 0,
  };
  const [temproraryTodo, setTemporaryTodo] = useState<Todo>(tempTodo);

  const getTodosFromServer = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setHasError(true);
        setErrorMessage('Can not load todos from server');
      }
    }
  };

  const deleteErrors = useCallback(() => {
    return setHasError(false);
  }, []);

  const visibleTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.Completed:
          return todo.completed;
        case FilterBy.Active:
          return !todo.completed;
        case FilterBy.All:
        default:
          return todo;
      }
    })
  ), [todos, filterBy]);

  const handleFilter = useCallback((filter: FilterBy) => {
    setFilterBy(filter);
  }, []);

  useEffect(() => {
    getTodosFromServer();

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSumbitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage('Title can not be empty');
      setHasError(true);
    }

    if (user && todoTitle.trim() && temproraryTodo) {
      try {
        setIsAdding(true);
        setTemporaryTodo((currentTemp => ({
          ...currentTemp,
          title: todoTitle,
          userId: user.id,
        })));
        const newTodo = {
          title: todoTitle,
          completed: false,
          userId: user?.id,
        };

        await addTodo(user.id, newTodo);
        await getTodosFromServer();
        setIsAdding(false);
        setTodoTitle('');
      } catch (error) {
        setErrorMessage('Unable to add todo');
        setHasError(true);
      }
    }
  };

  const handleDeleteButton = async (todoId: number) => {
    try {
      setselectedTodoId(currentTodo => [...currentTodo, todoId]);
      setIsDeleting(true);
      await deleteTodo(todoId);
      await getTodosFromServer();
      setselectedTodoId(currentTodo => (
        currentTodo.filter(currentTodoId => currentTodoId !== todoId)));
      setIsDeleting(false);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setHasError(true);
    }
  };

  const completedTodos = (todos.filter((todo) => todo.completed));

  const removeAllCompletedTodos = async () => {
    try {
      await Promise.all(completedTodos.map((todo) => (
        handleDeleteButton(todo.id)
      )));
    } catch (error) {
      setErrorMessage('Unable to remove all completed todo');
      setHasError(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setHasError(false);
    }, 3000);
  }, [hasError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form
            action="/api/todos"
            method="POST"
            onSubmit={handleSumbitForm}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => (setTodoTitle(event.target.value))}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDeleteButton={handleDeleteButton}
              temporaryTodo={temproraryTodo}
              isAdding={isAdding}
              isDeleting={isDeleting}
              selectedTodoId={selectedTodoId}
            />
            <TodoFooter
              filterBy={filterBy}
              handleFilter={handleFilter}
              todos={todos.length}
              removeAllCompletedTodos={removeAllCompletedTodos}
              completedTodos={completedTodos.length}
            />
          </>
        )}

      </div>
      {hasError && (
        <ErrorNotification
          deleteErrors={deleteErrors}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
