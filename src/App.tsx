/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodos, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TempTodo } from './components/TempTodo';

export const App: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTitle, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isTitle.trim() === '') {
      setError('Title should not be empty');

      return;
    }

    try {
      setLoading(true);
      // викликаємо функцію createTodos, яка відправляє запит на сервер та створює новий todo
      const newTodo = await createTodos({
        title: isTitle.trim(),
        completed: false,
        userId: USER_ID,
      });

      setTempTodo({
        id: 0, // create a todo with id: 0
        title: isTitle.trim(),
        completed: false,
        userId: USER_ID,
      });

      //  додає новий елемент до масиву todos та оновлює його стан
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTitle('');
      setTempTodo(null); // Сховати tempTodo
    } catch (errors) {
      setError('Unable to add a todo');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodos = async (userId: number) => {
    try {
      setLoading(true);

      await deleteTodo(userId);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== userId));
      setError(null);
    } catch (errors) {
      setError('Unable to delete a todo');
    } finally {
      setLoading(false);
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
      setLoading(true);
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
      setLoading(false);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleInputTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const allTodosCompleted = todos.every(todo => todo.completed);

  // Обчислює кількість невиконаних todo
  const todosCounter = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              value={isTitle}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={e => {
                handleInputTodo(e);
              }}
              disabled={loading}
            />
          </form>
        </header>

          <section className="todoapp__main" data-cy="TodoList">
            {/* This is a completed todo */}
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => toggleTodoCompletion(todo.id)}
                  />
                </label>
                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => {
                    if (deleteTodos) {
                      deleteTodos(todo.id);
                    }
                  }}
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${loading ? '' : 'hidden'}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>

        {tempTodo && (
          <TempTodo todo={tempTodo} loading={Boolean(tempTodo)} />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todosCounter} ${todosCounter === 1 ? 'item' : 'items'} left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filterStatus === 'all' ? 'selected' : ''}`} // use the selected class to highlight a selected link;
                data-cy="FilterLinkAll"
                onClick={() => setFilterStatus('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filterStatus === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilterStatus('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filterStatus === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed)}
              onClick={clearCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
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
        {/* Unable to load todos
          <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
        {error}
      </div>
    </div>
  );
};
