/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo as TodoType } from './types/Todo';
import { Filter, FilterType } from './components/Filter';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const newTodoFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setError('');
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setError('Unable to load todos');
      }
    };

    if (USER_ID) {
      loadTodos();
    }
  }, []);

  const focusNewTodoField = () => {
    newTodoFieldRef.current?.focus();
  };

  useEffect(() => {
    if (tempTodo === null) {
      newTodoFieldRef.current?.focus();
    }
  }, [tempTodo]);

  const handleErrorHide = () => {
    setError('');
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      focusNewTodoField();

      return;
    }

    if (tempTodo) {
      return;
    }

    setError('');

    const todoToCreate: TodoType = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(todoToCreate);

    try {
      const createdTodo = await createTodo(trimmedTitle);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setNewTodoTitle('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (processingIds.includes(id)) {
      return;
    }

    setError('');
    setProcessingIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));
      focusNewTodoField();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (!completedTodoIds.length) {
      return;
    }

    setError('');
    setProcessingIds(prev => [...prev, ...completedTodoIds]);

    const results = await Promise.allSettled(
      completedTodoIds.map(id => deleteTodo(id).then(() => id)),
    );

    const successfulIds = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<number>).value);

    const hasErrors = results.some(result => result.status === 'rejected');

    if (hasErrors) {
      setError('Unable to delete a todo');
    }

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfulIds.includes(todo.id)),
    );
    setProcessingIds(prev => prev.filter(id => !completedTodoIds.includes(id)));
    focusNewTodoField();
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasTodos = todos.length > 0;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={newTodoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={newTodoTitle}
              onChange={handleNewTodoChange}
              disabled={Boolean(tempTodo)}
            />
          </form>
        </header>

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={todos}
            filter={filter}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={handleDelete}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount === 1
                ? '1 item left'
                : `${activeTodosCount} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <Filter
              selectedFilter={filter}
              onFilterChange={handleFilterChange}
            />

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!hasCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        message={error}
        isVisible={!!error}
        onHide={handleErrorHide}
      />
    </div>
  );
};
