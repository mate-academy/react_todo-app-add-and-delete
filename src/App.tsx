/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodos, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';

export enum TodoStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}


export const App: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState<TodoStatus>(TodoStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case TodoStatus.Active:
        return !todo.completed;
      case TodoStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    if (USER_ID) {
      handleRequest();
    }

    setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  // Відправляє запит на сервер для отримання списку (todos).
  const handleRequest = async () => {
    try {
      const allTodo = await getTodos();

      setTodos(allTodo);
      setError(null);
    } catch (errors) {
      setError('Unable to load todos');
    }
  };

  const isLoading = !!loadingTodoIds.length;

  const inputRef = useRef<HTMLInputElement>(null);
  // додавання фокусу на input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  // Відповідає за обробку події форми.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') {
      setError('Title should not be empty');

      return;
    }

    try {
      setTempTodo({
        id: 0,
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });

      // викликаємо функцію createTodos, яка відправляє запит на сервер та створює новий todo
      const newTodo = await createTodos({
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });

      //  додає новий елемент до масиву todos та оновлює його стан
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTitle('');
    } catch (errors) {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null); // Сховати tempTodo
    }
  };

  const deleteSingleTodo = async (userId: number) => {

    try {
      setLoadingTodoIds(prevLoading => [...prevLoading, userId]); // Встановлення статусу завантаження для вибраного todo

      await deleteTodo(userId);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== userId));
    } catch (errors) {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(prevLoading => prevLoading.filter(id => id !== userId)); // Видалення статусу завантаження після виконання операції
    }
  };

  // Функція відповідає за зміну статусу завдання
  const toggleTodoCompletion = (todoId: number) => {
    try {
      // Отримуємо посилання на завдання за його id
      const updatedTodos = todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      );

      // Оновлюємо стан todos
      setTodos(updatedTodos);
      setError(null);

      // Отримуємо новий стан фільтра
      let newFilterStatus: TodoStatus = TodoStatus.All;

      if (filterStatus === TodoStatus.Completed) {
        newFilterStatus = TodoStatus.Completed;
      } else if (filterStatus === TodoStatus.Active) {
        newFilterStatus = TodoStatus.All;
      }

      // Оновлюємо стан фільтра
      setFilterStatus(newFilterStatus);
    } catch (errors) {
      setError('Unable to toggle todo completion');
    }
  };

  const clearCompletedTodos = async () => {
    try {
      // Відбір завершених todo
      const completedTodosIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      // Видалення кожної завершеної todo за її ідентифікатором
      await Promise.all(completedTodosIds.map(id => deleteSingleTodo(id)));
      // Оновлення списку todos, виключаючи завершені todo
      setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));

      // Перевірка, чи залишилися невиконані todo
      if (todos.some(todo => !todo.completed)) {
        setFilterStatus(TodoStatus.Completed);
      }
    } finally {
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          onSubmit={handleSubmit}
          onChange={setTitle}
          todos={todos}
          isLoading={isLoading}
          inputRef={inputRef}
          title={title}
        />

        <Main
          filteredTodos={filteredTodos}
          toggleTodoCompletion={toggleTodoCompletion}
          loadingTodoIds={loadingTodoIds}
          deleteSingleTodo={deleteSingleTodo}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!isLoading && error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
}
