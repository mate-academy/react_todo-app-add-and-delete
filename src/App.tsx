/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Todo, TodoStatus } from './types/Todo';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { ERROR_MESSAGES } from './constants/constants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<TodoStatus>(
    TodoStatus.All,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [deletingTodo, setDeletingTodo] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  //завантаження тудушок
  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ERROR_MESSAGES.load);
      })
      .finally(() => setLoading(false));
  }, []);

  //автоматичне приховування помилок
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  //фокус після створення тудушки
  useEffect(() => {
    if (tempTodo === null && deletingTodo.length === 0) {
      inputRef.current?.focus();
    }
  }, [tempTodo, deletingTodo]);

  const filteredTodos = useMemo(
    () => getFilteredTodos({ todos, selectedFilter }),
    [todos, selectedFilter],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizeTitle = title.trim();

    if (normalizeTitle === '') {
      setError(ERROR_MESSAGES.emptyTitle);

      return;
    }

    setError('');

    const request = postTodo(normalizeTitle);

    setTempTodo({
      id: 0,
      title: normalizeTitle,
      completed: false,
      userId: USER_ID,
    });

    request
      .then(todo => {
        setTodos(currentTodo => [...currentTodo, todo]);
        setTitle('');
      })
      .catch(() => setError(ERROR_MESSAGES.add))
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setError('');
    setDeletingTodo(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setError(ERROR_MESSAGES.delete))
      .finally(() =>
        setDeletingTodo(prev => prev.filter(itemId => itemId != todoId)),
      );
  };

  const handleClearCompleted = () => {
    setError('');
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosId = completedTodos.map(todo => todo.id);

    setDeletingTodo(prev => [...prev, ...completedTodosId]);

    const deleteRequests = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.allSettled(deleteRequests)
      .then(result => {
        const hasError = result.some(item => item.status === 'rejected');
        const successRequest = completedTodos
          .filter((todo, index) => result[index].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successRequest.includes(todo.id)),
        );

        inputRef.current?.focus();

        if (hasError) {
          setError(ERROR_MESSAGES.delete);
        }
      })
      .finally(() => {
        setDeletingTodo(prev =>
          prev.filter(prevId => !completedTodosId.includes(prevId)),
        );
      });
  };

  const showTodoList = todos.length > 0 || tempTodo !== null;

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

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={tempTodo !== null}
              autoFocus
            />
          </form>
        </header>
        {loading && (
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}

        {showTodoList && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            handleDelete={handleDelete}
            deletingTodo={deletingTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorText={error} setErrorText={setError} />
    </div>
  );
};
