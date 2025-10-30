/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodos,
  deleteTodos,
  getTodos,
  todosServiceErrorText,
  USER_ID,
} from './api/todos';
import { NewTodo } from './components/NewTodo';
import { Todo } from './types/Todo';
import { Filter, FilterStatus } from './components/Filter';
import cn from 'classnames';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';

export const App: React.FC = () => {
  const shouldShowUserWarning = !USER_ID;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const focusedInput = useRef<HTMLInputElement>(null);

  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [creating, setIsCreating] = useState(false);
  const [processing, setProcessing] = useState<number[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage(todosServiceErrorText.Unable_to_load_todos);
        setTimeout(() => setErrorMessage(null), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (!isLoading && !creating && focusedInput.current) {
      focusedInput.current.focus();
    }
  }, [isLoading, creating]);

  const getFilteredTodos = (todosToFilter: Todo[], filters: FilterStatus) => {
    switch (filters) {
      case FilterStatus.Active:
        return todosToFilter.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return todosToFilter.filter(todo => todo.completed);
      case FilterStatus.All:
      default:
        return todosToFilter;
    }
  };

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      setErrorMessage(todosServiceErrorText.title_should_not_be_empty);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      focusedInput.current?.focus();

      return;
    }

    setErrorMessage(null);
    setIsCreating(true);

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const created = await createTodos(title);

      setTodos(prev => [...prev, created]);
      setTodoTitle('');
    } catch {
      setErrorMessage(todosServiceErrorText.Unable_to_add_a_todo);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    } finally {
      setTempTodo(null);
      setIsCreating(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setProcessing(prev => [...prev, id]);
      await deleteTodos(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(todosServiceErrorText.Unable_to_delete_a_todo);
    } finally {
      setProcessing(prev => prev.filter(todoId => todoId !== id));
      focusedInput.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    try {
      setProcessing(prev => [...prev, ...completedTodos.map(todo => todo.id)]);

      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodos(todo.id)),
      );

      const successfulIds = completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      const hasErrors = results.some(result => result.status === 'rejected');

      if (hasErrors) {
        setErrorMessage(todosServiceErrorText.Unable_to_delete_a_todo);
        setTimeout(() => setErrorMessage(null), 3000);
      }
    } finally {
      setProcessing(prev =>
        prev.filter(
          id => !todos.some(todo => todo.completed && todo.id === id),
        ),
      );

      focusedInput.current?.focus();
    }
  };

  const filteredTodos = getFilteredTodos(todos, filter);
  const hasTodos = todos.length > 0;
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  const hasCompleted = todos.some(todo => todo.completed);

  if (shouldShowUserWarning) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: allCompleted })}
            data-cy="ToggleAllButton"
            disabled={!hasTodos}
          />

          <NewTodo
            loading={isLoading || creating}
            focusedInput={focusedInput}
            todoTitle={todoTitle}
            onTitleChange={setTodoTitle}
            onCreateTodo={handleAddTodo}
          />
        </header>

        {hasTodos && (
          <TodoList
            todos={filteredTodos}
            loading={isLoading}
            processingIds={processing}
            onDeleteTodo={handleDeleteTodo}
            creating={creating}
            tempTodo={tempTodo}
          />
        )}

        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left
            </span>

            <Filter value={filter} onChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompleted}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Notification
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
