/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Errors } from './types/ErrorsEnum';
import { FilterValues } from './types/FilterValuesEnum';

export const App: React.FC = () => {
  const [todoStatus, setTodoStatus] = useState<FilterValues>(FilterValues.All);
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    inputFocusRef.current?.focus();

    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setError(Errors.unableToLoadTodosError));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(Errors.clearErrors), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!isSubmitting) {
      inputFocusRef.current?.focus();
    }
  }, [isSubmitting]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setIsSubmitting(false);
      setError(Errors.emptyTitleError);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    addTodo({ title: trimmedTitle, completed: false, userId: USER_ID })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError(Errors.unableToAddTodoError);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        }),
      )
      .catch(() => setError(Errors.unableToDeleteATodoError))
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
        inputFocusRef.current?.focus();
      });
  };

  const handleClearCompletedTodo = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...completedIds]);

    Promise.all(
      completedIds.map(id =>
        deleteTodo(id)
          .then(() => setTodos(prev => prev.filter(todo => todo.id !== id)))
          .catch(() => setError(Errors.unableToDeleteATodoError))
          .finally(() =>
            setLoadingIds(prev => prev.filter(loadingId => loadingId !== id)),
          ),
      ),
    ).finally(() => inputFocusRef.current?.focus());
  };

  const filteredTodos = todos.filter(todo => {
    if (todoStatus === FilterValues.All) {
      return true;
    }

    if (todoStatus === FilterValues.Active) {
      return !todo.completed;
    }

    return todo.completed;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          inputRef={inputFocusRef}
          isSubmitting={isSubmitting}
        />

        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            loadingIds={loadingIds}
            tempTodo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            todoStatus={todoStatus}
            setTodoStatus={setTodoStatus}
            clearCompletedTodo={handleClearCompletedTodo}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
