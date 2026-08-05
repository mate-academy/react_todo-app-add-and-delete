import React from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import type { Todo } from './types/Todo';
import { FilterTypes } from './types/FilterTypes';
import { ErrorMessages } from './types/ErrorMessages';

import { TodoList } from './components/TodoList';
import { TodosFooter } from './components/TodosFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<ErrorMessages | null>(
    null,
  );
  const [filterType, setFilterType] = React.useState<FilterTypes>(
    FilterTypes.ALL,
  );
  const [newTodoTitle, setNewTodoTitle] = React.useState<string>('');
  const [isAddingTodo, setIsAddingTodo] = React.useState<boolean>(false);
  const [temporaryTodo, setTemporaryTodo] = React.useState<Todo | null>(null);
  const [deletingTodos, setDeletingTodos] = React.useState<number[]>([]);
  const newTodoFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setErrorMessage(null);
    getTodos()
      .then(loadedTodos => setTodos(loadedTodos))
      .catch(() => setErrorMessage(ErrorMessages.LOAD_ERROR));
  }, []);

  React.useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  React.useEffect(() => {
    if (isAddingTodo || deletingTodos.length > 0) {
      return;
    }

    newTodoFieldRef.current?.focus();
  }, [isAddingTodo, deletingTodos.length]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const visibleTodos = todos.filter(todo => {
    if (filterType === FilterTypes.ACTIVE) {
      return !todo.completed;
    }

    if (filterType === FilterTypes.COMPLETED) {
      return todo.completed;
    }

    return true;
  });
  const temporaryTodoForList =
    filterType === FilterTypes.COMPLETED ? null : temporaryTodo;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const areAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorMessages.EMPTY_TITLE);

      return;
    }

    const currentTodoTitle = newTodoTitle.trim();
    const newTodoData: Omit<Todo, 'id'> = {
      title: currentTodoTitle,
      completed: false,
      userId: USER_ID,
    };
    const newTodoWithId: Todo = {
      ...newTodoData,
      id: 0,
    };

    setErrorMessage(null);
    setIsAddingTodo(true);
    setTemporaryTodo(newTodoWithId);
    addTodo(newTodoData)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setErrorMessage(ErrorMessages.ADD_ERROR))
      .finally(() => {
        setIsAddingTodo(false);
        setTemporaryTodo(null);
      });
  };

  const onDeleteTodo = (todoId: number) => {
    setErrorMessage(null);
    setDeletingTodos(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(ErrorMessages.DELETE_ERROR))
      .finally(() =>
        setDeletingTodos(prev => prev.filter(id => id !== todoId)),
      );
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setErrorMessage(null);
    setDeletingTodos(prev => [...prev, ...completedTodoIds]);
    Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => todo.id)
          .catch(() => null),
      ),
    )
      .then(results => {
        const deletedTodoIds = results.filter(
          (id): id is number => id !== null,
        );

        if (deletedTodoIds.length < completedTodoIds.length) {
          setErrorMessage(ErrorMessages.DELETE_ERROR);
        }

        setTodos(prevTodos =>
          prevTodos.filter(todo => !deletedTodoIds.includes(todo.id)),
        );
      })
      .finally(() =>
        setDeletingTodos(prev =>
          prev.filter(id => !completedTodoIds.includes(id)),
        ),
      );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: areAllTodosCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={onSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAddingTodo}
              ref={newTodoFieldRef}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          temporaryTodo={temporaryTodoForList}
          onDeleteTodo={onDeleteTodo}
          deletingTodoIds={deletingTodos}
          isDeletingTodo={deletingTodos.length > 0}
        />

        {todos.length > 0 && (
          <TodosFooter
            activeTodosCount={activeTodosCount}
            filterType={filterType}
            onFilterChange={setFilterType}
            hasCompletedTodos={hasCompletedTodos}
            onClearCompleted={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
