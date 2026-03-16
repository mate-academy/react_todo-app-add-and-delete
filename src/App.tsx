/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo } from './api/todos';
import { useEffect, useState, useRef } from 'react';
import { getTodos } from './api/todos';
import { Todo, FilterType, ErrorMessage } from './types/Todo';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TempTodoItem } from './components/TempTodoItem';

export const App: React.FC = () => {
  const field = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [loading, setLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  function showError(message: string) {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  async function loadTodos() {
    setError('');
    setLoading(true);
    try {
      const result = await getTodos();

      setTodos(result);
      field.current?.focus();
    } catch {
      showError(ErrorMessage.UnableLoadTodos);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(event: React.FormEvent) {
    setError('');
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      showError(ErrorMessage.TitleEmpty);

      return;
    }

    const todo = {
      id: 0,
      completed: false,
      title,
      userId: USER_ID,
    };

    setTempTodo(todo);

    try {
      setLoading(true);
      const newTodo = await addTodo(title);

      setTodos([...todos, newTodo]);
      setTodoTitle('');
      setTempTodo(null);
    } catch {
      showError(ErrorMessage.UnableAddTodo);
      setTempTodo(null);
    } finally {
      setLoading(false);
      field.current?.focus();
    }
  }

  async function handleDeleteTodo(id: number) {
    setDeletingIds([...deletingIds, id]);

    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      showError(ErrorMessage.UnableDeleteTodo);
    } finally {
      setDeletingIds(deletingIds.filter(delId => delId !== id));
    }
  }

  useEffect(() => {
    if (!loading) {
      field.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (deletingIds.length === 0 && !loading) {
      field.current?.focus();
    }
  }, [deletingIds, loading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function getFilteredTodos() {
    if (filter === FilterType.All) {
      return todos;
    }

    if (filter === FilterType.Active) {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === FilterType.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }

  async function handleClearCompleted() {
    setError('');
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingIds([...deletingIds, ...completedIds]);

    try {
      const result = await Promise.allSettled(
        completedIds.map(id => deleteTodo(id)),
      );

      const hasErrors = result.some(r => r.status === 'rejected');

      if (hasErrors) {
        showError(ErrorMessage.UnableDeleteTodo);
      }

      const successfulIds = completedIds.filter(
        (id, index) => result[index].status === 'fulfilled',
      );

      setTodos(todos.filter(todo => !successfulIds.includes(todo.id)));
    } finally {
      setDeletingIds([]);
    }
  }

  const filteredTodos = getFilteredTodos();
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          activeTodosCount={activeTodosCount}
          loading={loading}
          field={field}
          todoTitle={todoTitle}
          handleAddTodo={handleAddTodo}
          setTodoTitle={setTodoTitle}
        />

        {(filteredTodos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                loading={loading}
                deletingIds={deletingIds}
                handleDeleteTodo={handleDeleteTodo}
              />
            ))}

            <TempTodoItem tempTodo={tempTodo} />
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            completedTodosCount={completedTodosCount}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} loading={loading} setError={setError} />
    </div>
  );
};
