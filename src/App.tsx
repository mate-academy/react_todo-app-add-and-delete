import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { FilterBy } from './types/FilterBy';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<FilterBy>(FilterBy.All);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const handleTodosLoading = async () => {
    setErrorMessage(null);
    try {
      const data = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

      setTodos(data);
    } catch {
      setErrorMessage(ErrorType.Load);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterBy.Active:
        return !todo.completed;
      case FilterBy.Completed:
        return todo.completed;
      case FilterBy.All:
      default:
        return true;
    }
  });

  const visibleTodos = tempTodo ? [...filteredTodos, tempTodo] : filteredTodos;

  const hasCompleted = todos.some(todo => todo.completed);
  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const title = newTodoFieldRef.current?.value.trim() || inputValue.trim();

    if (!title) {
      setErrorMessage(ErrorType.Empty);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const createdTodo = await client.post<Todo>('/todos', {
        title,
        completed: false,
        userId: USER_ID,
      });

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setInputValue('');
      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.value = '';
      }
    } catch {
      setErrorMessage(ErrorType.Add);
    } finally {
      setTempTodo(null);
      setTimeout(() => {
        newTodoFieldRef.current?.focus();
      }, 0);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setErrorMessage(null);
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);
    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      newTodoFieldRef.current?.focus();
    } catch {
      setErrorMessage(ErrorType.Delete);
    } finally {
      setDeletingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  const clearCompleted = async () => {
    setErrorMessage(null);
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      const results = await Promise.allSettled(
        completedTodos.map(todo => client.delete(`/todos/${todo.id}`)),
      );

      const successfulIds = completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id)),
      );

      const hasErrors = results.some(result => result.status === 'rejected');

      if (hasErrors) {
        setErrorMessage(ErrorType.Delete);
      } else {
        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      }
    } catch {
      setErrorMessage(ErrorType.Delete);
    }
  };

  const handleBlur = async (todo: Todo) => {
    if (!editText.trim()) {
      setEditedTodoId(null);
      await deleteTodo(todo.id);
    } else {
      setEditedTodoId(null);
    }
  };

  const handleEditing = async (
    e: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!editText.trim()) {
      setEditedTodoId(null);
      await deleteTodo(todo.id);

      return;
    }

    if (editText.trim() === todo.title) {
      setEditedTodoId(null);

      return;
    }

    try {
      await client.patch<Todo>(`/todos/${todo.id}`, {
        title: editText.trim(),
      });
      setEditedTodoId(null);
      await handleTodosLoading();
    } catch {
      setErrorMessage(ErrorType.Update);
    }
  };

  useEffect(() => {
    void handleTodosLoading();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const toggleTodo = async (todo: Todo) => {
    setErrorMessage(null);
    try {
      await client.patch<Todo>(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      await handleTodosLoading();
    } catch {
      setErrorMessage(ErrorType.Update);
    }
  };

  const handleSelectAll = async () => {
    setErrorMessage(null);
    try {
      const targetStatus = !isAllCompleted;

      await Promise.all(
        todos
          .filter(todo => todo.completed !== targetStatus)
          .map(todo =>
            client.patch(`/todos/${todo.id}`, {
              completed: targetStatus,
            }),
          ),
      );
      await handleTodosLoading();
    } catch {
      setErrorMessage(ErrorType.Update);
    }
  };

  const filterLinks = [
    { label: 'All', value: FilterBy.All, href: '#/' },
    { label: 'Active', value: FilterBy.Active, href: '#/active' },
    { label: 'Completed', value: FilterBy.Completed, href: '#/completed' },
  ];

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          newTodoFieldRef={newTodoFieldRef}
          isAllCompleted={isAllCompleted}
          handleSelectAll={() => void handleSelectAll()}
          hasTodos={todos.length > 0 || tempTodo !== null}
          isSubmitting={tempTodo !== null}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id || 'temp'}
                todo={todo}
                isEditing={todo.id === editedTodoId}
                editText={editText}
                setEditText={setEditText}
                setEditedTodoId={setEditedTodoId}
                deleteTodo={id => void deleteTodo(id)}
                toggleTodo={t => void toggleTodo(t)}
                handleEditing={(e, t) => void handleEditing(e, t)}
                handleBlur={t => void handleBlur(t)}
                isLoading={todo.id === 0 || deletingTodoIds.includes(todo.id)}
              />
            ))}
          </section>
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={hasCompleted}
            clearCompleted={() => void clearCompleted()}
            filterLinks={filterLinks}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage === ErrorType.Load && 'Unable to load todos'}
        {errorMessage === ErrorType.Empty && 'Title should not be empty'}
        {errorMessage === ErrorType.Add && 'Unable to add a todo'}
        {errorMessage === ErrorType.Delete && 'Unable to delete a todo'}
        {errorMessage === ErrorType.Update && 'Unable to update a todo'}
      </div>
    </div>
  );
};
