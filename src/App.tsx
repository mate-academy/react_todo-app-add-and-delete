/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoItem } from './components/TodoItem';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export const USER_ID = 1414;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const fetchedTodos = await getTodos(USER_ID);

      setTodos(fetchedTodos);
    } catch {
      showError('Unable to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    focusInput();
  }, [isSubmitting, activeTodoId]);

  const resetForm = () => {
    setTitle('');
    setTempTodo(null);
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    setTitle(trimmedTitle);

    if (!trimmedTitle) {
      showError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setIsSubmitting(true);
    setActiveTodoId(newTempTodo.id);

    try {
      const newTodo = await createTodo({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
      resetForm();
    } catch {
      showError('Unable to add a todo');
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
      setActiveTodoId(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setActiveTodoId(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setActiveTodoId(null);
      focusInput();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.allSettled(
      completedTodoIds.map(async todoId => {
        try {
          await deleteTodo(todoId);
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        } catch {
          showError('Unable to delete a todo');
        } finally {
          setActiveTodoId(null);
          focusInput();
        }
      }),
    );
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const hasCompleted = todos.some(todo => todo.completed);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todosLen={todos.length}
          onSubmit={handleSubmit}
          onReset={resetForm}
          isAllCompleted={isAllCompleted}
          title={title}
          onTitleChange={handleTitleChange}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
        />
        {!isLoading && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TransitionGroup>
                {filteredTodos.map(todo => (
                  <CSSTransition key={todo.id} timeout={300} classNames="item">
                    <TodoItem
                      todo={todo}
                      key={todo.id}
                      onDelete={handleDeleteTodo}
                      activeTodoId={activeTodoId}
                    />
                  </CSSTransition>
                ))}
                {tempTodo && (
                  <CSSTransition key={0} timeout={300} classNames="temp-item">
                    <TodoItem
                      todo={tempTodo}
                      key={tempTodo.id}
                      onDelete={handleDeleteTodo}
                      activeTodoId={activeTodoId}
                    />
                  </CSSTransition>
                )}
              </TransitionGroup>
            </section>

            {todos.length > 0 && (
              <Footer
                todos={todos}
                filter={filter}
                onFilterChange={handleFilterChange}
                hasCompleted={hasCompleted}
                onClick={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        <div>{error}</div>
      </div>
    </div>
  );
};
