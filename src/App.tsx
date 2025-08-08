/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      setErrorMessage(null);
      try {
        const userTodos = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

        setTodos(userTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timerId = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    // Перевіряємо, чи посилання на елемент існує
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus(); // Встановлюємо фокус на поле введення
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // Додаємо логіку фільтрації
  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'active':
        return !todo.completed; // Показуємо тільки незавершені справи
      case 'completed':
        return todo.completed; // Показуємо тільки завершені справи
      case 'all':
      default:
        return true; // Показуємо всі справи
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage(null);
    setIsAddingTodo(true);

    const tempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTodos(currentTodos => [...currentTodos, tempTodo]);
    setLoadingTodoIds(currentIds => [...currentIds, tempTodo.id]);

    try {
      const newTodo = await client.post<Todo>('/todos', {
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === tempTodo.id ? newTodo : todo)),
      );
      setNewTodoTitle('');

      // Цей setTimeout залишається тільки тут, у finally
      // setTimeout(() => {
      //   if (newTodoFieldRef.current) {
      //     newTodoFieldRef.current.focus();
      //   }
      // }, 0);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTodos(currentTodos =>
        currentTodos.filter(todo => todo.id !== tempTodo.id),
      );

      // !!! ВИДАЛЯЄМО ЦЕЙ БЛОК setTimeout ЗВІДСИ !!!
      // setTimeout(() => {
      //   if (newTodoFieldRef.current) {
      //     newTodoFieldRef.current.focus();
      //   }
      // }, 0);
    } finally {
      setIsAddingTodo(false);
      setLoadingTodoIds(currentIds =>
        currentIds.filter(id => id !== tempTodo.id),
      );

      // Залишаємо setTimeout тільки тут, у finally
      setTimeout(() => {
        if (newTodoFieldRef.current) {
          newTodoFieldRef.current.focus();
        }
      }, 0);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setErrorMessage(null);
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      // Змінюємо текст повідомлення про помилку
      setErrorMessage('Unable to delete a todo'); // <-- Змінюємо цей рядок
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));

      setTimeout(() => {
        if (newTodoFieldRef.current) {
          newTodoFieldRef.current.focus();
        }
      }, 0);
    }
  };

  const handleToggleTodoStatus = async (
    todoId: number,
    currentStatus: boolean,
  ) => {
    setErrorMessage(null); // Приховуємо попередні помилки
    setLoadingTodoIds(currentIds => [...currentIds, todoId]); // Додаємо ID справи до списку завантаження

    try {
      // Відправляємо PATCH-запит на сервер для оновлення статусу
      const updatedTodo = await client.patch<Todo>(`/todos/${todoId}`, {
        completed: !currentStatus, // Змінюємо статус на протилежний
      });

      // Оновлюємо список справ у стані
      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (error) {
      setErrorMessage('Unable to update todo'); // Встановлюємо повідомлення про помилку
    } finally {
      // Видаляємо ID справи зі списку завантаження
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  const areAllTodosCompleted = todos.every(todo => todo.completed); // <-- Додаємо це

  // Нова функція для перемикання всіх справ
  const handleToggleAllTodos = async () => {
    // <-- Робимо функцію асинхронною
    setErrorMessage(null); // Приховуємо попередні помилки

    // Визначаємо цільовий статус: якщо всі завершені, то робимо їх активними (false), інакше - завершеними (true)
    const targetStatus = !areAllTodosCompleted;

    // Знаходимо справи, які потрібно оновити (ті, чий статус відрізняється від цільового)
    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return; // Нічого не робимо, якщо немає справ для оновлення
    }

    // Додаємо ID всіх справ, які будуть оновлюватися, до списку завантаження
    setLoadingTodoIds(currentIds => [
      ...currentIds,
      ...todosToUpdate.map(todo => todo.id),
    ]);

    try {
      // Створюємо масив промісів для кожного PATCH-запиту
      const updatePromises = todosToUpdate.map(todo =>
        client.patch<Todo>(`/todos/${todo.id}`, { completed: targetStatus }),
      );

      // Чекаємо, поки всі запити будуть виконані
      const updatedTodos = await Promise.all(updatePromises);

      // Оновлюємо локальний стан todos
      setTodos(currentTodos =>
        currentTodos.map(todo => {
          // Знаходимо оновлену версію справи з масиву updatedTodos
          const updated = updatedTodos.find(ut => ut.id === todo.id);

          return updated || todo; // Якщо знайдено оновлену версію, використовуємо її, інакше - стару
        }),
      );
    } catch (error) {
      setErrorMessage('Unable to update todos'); // Встановлюємо повідомлення про помилку
    } finally {
      // Видаляємо ID всіх оновлених справ зі списку завантаження
      setLoadingTodoIds(currentIds =>
        currentIds.filter(id => !todosToUpdate.some(todo => todo.id === id)),
      );
    }
  };

  const handleClearCompleted = async () => {
    setErrorMessage(null);

    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingTodoIds(currentIds => [
      ...currentIds,
      ...completedTodos.map(todo => todo.id),
    ]);

    const deletePromises = completedTodos.map(todo =>
      client.delete(`/todos/${todo.id}`).then(
        () => ({ status: 'fulfilled', todoId: todo.id }),
        () => ({ status: 'rejected', todoId: todo.id }),
      ),
    );

    const results = await Promise.all(deletePromises);

    const successfulDeletions = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.todoId);

    const failedDeletions = results
      .filter(result => result.status === 'rejected')
      .map(result => result.todoId);

    // Remove successfully deleted todos from state
    if (successfulDeletions.length > 0) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulDeletions.includes(todo.id)),
      );
    }

    // Show error message if any deletions failed
    if (failedDeletions.length > 0) {
      setErrorMessage('Unable to delete a todo');
    }

    setLoadingTodoIds(currentIds =>
      currentIds.filter(id => !completedTodos.some(todo => todo.id === id)),
    );

    setTimeout(() => {
      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={`todoapp__toggle-all ${areAllTodosCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={handleToggleAllTodos}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAddingTodo}
              ref={newTodoFieldRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <div
                data-cy="Todo"
                key={todo.id}
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() =>
                      handleToggleTodoStatus(todo.id, todo.completed)
                    }
                    disabled={loadingTodoIds.includes(todo.id)}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ×
                </button>
                <div
                  data-cy="TodoLoader"
                  // Додаємо клас 'is-active' тільки якщо ID справи є у loadingTodoIds
                  className={`modal overlay ${loadingTodoIds.includes(todo.id) ? 'is-active' : ''}`} // <-- Змінюємо тут
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
            {/* Індикатор завантаження для додавання нової справи - поки не чіпаємо */}
            {isAddingTodo && (
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {
                todos.filter(
                  todo => !todo.completed && !loadingTodoIds.includes(todo.id),
                ).length
              }{' '}
              items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filterStatus === 'all' ? 'selected' : ''}`}
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

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={
                todos.filter(todo => todo.completed).length === 0 ||
                loadingTodoIds.length > 0
              }
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
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
