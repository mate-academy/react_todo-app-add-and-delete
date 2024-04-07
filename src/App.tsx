/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodos, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTitle, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadingTodo, setIsLoadingTodo] = useState<number[]>([]);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'active':
        return !todo.completed;
      case 'completed':
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
      setError(''); // Очищаємо помилку після схову повідомлення
    }, 3000);
  }, []);

  // Відправляє запит на сервер для отримання списку (todos).
  const handleRequest = async () => {
    try {
      setLoading(true);
      const allTodo = await getTodos();

      setTodos(allTodo);
      setError(null); // При успішному завершенні запиту помилка схована
    } catch (errors) {
      // Обробка помилок, якщо вони виникають під час відправлення запиту
      setError('Unable to load todos');
    } finally {
      setLoading(false);
    }
  };

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
    if (isTitle.trim() === '') {
      setError('Title should not be empty');

      return;
    }

    try {
      setTempTodo({
        id: 0, // create a todo with id: 0
        title: isTitle.trim(),
        completed: false,
        userId: USER_ID,
      });

      // викликаємо функцію createTodos, яка відправляє запит на сервер та створює новий todo
      const newTodo = await createTodos({
        title: isTitle.trim(),
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

  const deleteTodos = async (userId: number) => {

    try {
      setIsLoadingTodo(prevLoading => [...prevLoading, userId]); // Встановлення статусу завантаження для вибраного todo

      await deleteTodo(userId);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== userId));
    } catch (errors) {
      setError('Unable to delete a todo');
    } finally {
      setIsLoadingTodo(prevLoading => prevLoading.filter(id => id !== userId)); // Видалення статусу завантаження після виконання операції
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
      let newFilterStatus = 'all';

      if (filterStatus === 'completed') {
        newFilterStatus = 'active';
      } else if (filterStatus === 'active') {
        newFilterStatus = 'all';
      }

      // Оновлюємо стан фільтра
      setFilterStatus(newFilterStatus);
    } catch (errors) {
      setError('Unable to toggle todo completion');
    }
  };

  // видаляє всі завершені todo
  const clearCompletedTodos = async () => {
    try {
      // setLoading(true);
      // Відбір завершених todo
      const completedTodosIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      // Видалення кожної завершеної todo за її ідентифікатором
      await Promise.all(completedTodosIds.map(id => deleteTodo(id)));
      // Оновлення списку todos, виключаючи завершені todo
      setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));

      // Перевірка, чи залишилися невиконані todo
      if (todos.some(todo => !todo.completed)) {
        setFilterStatus('completed'); // встановлюємо статус фільтра на 'Completed'todo
      }
    } finally {
      // setLoading(false);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleInputTodo = (value: string) => {
    setTitle(value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          onSubmit={handleSubmit}
          onChange={handleInputTodo}
          todos={todos}
          loading={loading}
          inputRef={inputRef}
          isTitle={isTitle}
        />

        <Main
          filteredTodos={filteredTodos}
          toggleTodoCompletion={toggleTodoCompletion}
          isLoadingTodo={isLoadingTodo}
          deleteTodos={deleteTodos}
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
        className={`notification is-danger is-light has-text-weight-normal ${!loading && error ? '' : 'hidden'}`}
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
