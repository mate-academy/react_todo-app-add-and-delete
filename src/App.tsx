/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { createTodos, getTodos, updateTodos, deleteTodos } from './api/todos';

enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [loading, setLoading] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const [counterOfActiveTodos, setCounterOfActiveTodos] = useState(0);

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        // Рассчитываем количество активных задач после обновления состояния
        setCounterOfActiveTodos(
          fetchedTodos.filter(todo => !todo.completed).length,
        );
      })
      .catch(err => {
        setError('Unable to load todos' + err.message);
      })
      .finally(() => setLoading(false));

    console.log(error); // Проверка значения error
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  function addTodo(title: string) {
    const trimmedTitle = title.trim(); // Обрезаем пробелы

    if (trimmedTitle.length === 0) {
      setError('Title should not be empty');

      return;
    }

    const tempTodo = {
      title: trimmedTitle, // Используем обрезанное название
      userId: USER_ID,
      completed: false,
      id: Date.now(), // Временный ID
    };

    setTodos(currentTodos => [...currentTodos, tempTodo]); // Добавляем временную задачу

    setLoading(true);
    setLoadingTodoId(tempTodo.id); // Устанавливаем загрузку для этой задачи

    createTodos({ title: trimmedTitle, userId: USER_ID, completed: false }) // Отправляем обрезанное название
      .then(newTodo => {
        setTodos(currentTodos =>
          currentTodos.map(
            todo =>
              todo.id === tempTodo.id
                ? { ...newTodo, title: trimmedTitle }
                : todo, // Заменяем временную задачу на настоящую
          ),
        );
        setCounterOfActiveTodos(currentCount => currentCount + 1);
        setNewTodoTitle(''); // Очищаем поле ввода
        setError(null);
      })
      .catch(err => {
        setError('Unable to add a todo' + err.message);
        // Удаляем временную задачу при ошибке
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== tempTodo.id),
        );
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null); // Сбрасываем состояние загрузки
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  }

  function deleteTodo(todoId: number) {
    setLoadingTodoId(todoId);
    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setCounterOfActiveTodos(currentCount => currentCount - 1); // Уменьшаем счетчик
      })
      .catch(err => setError('Unable to delete a todo' + err.message))
      .finally(() => setLoadingTodoId(null));
  }

  function handleDeleteAllCompleted() {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.map(todo => deleteTodo(todo.id));
  }

  function updateTodoStatus(todoId: number, completed: boolean) {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    setLoadingTodoId(todoId);
    updateTodos({ ...todoToUpdate, completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(err => setError('Unable to delete a todo' + err.message))
      .finally(() => setLoadingTodoId(null));
  }

  const handleFilterChange = (newFilter: Filter) => setFilter(newFilter);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
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
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          <form
            onSubmit={e => {
              e.preventDefault();
              if (!loading) {
                addTodo(newTodoTitle);
              }
            }}
          >
            <input
              ref={inputRef}
              name="todo"
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={loading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => updateTodoStatus(todo.id, !todo.completed)}
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${loadingTodoId === todo.id ? 'is-active' : ''}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${counterOfActiveTodos} items left`}
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === Filter.ALL ? 'selected' : ''}`}
                onClick={() => handleFilterChange(Filter.ALL)}
                data-cy="FilterLinkAll"
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${filter === Filter.ACTIVE ? 'selected' : ''}`}
                onClick={() => handleFilterChange(Filter.ACTIVE)}
                data-cy="FilterLinkActive"
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === Filter.COMPLETED ? 'selected' : ''}`}
                onClick={() => handleFilterChange(Filter.COMPLETED)}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed)}
              onClick={handleDeleteAllCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error === null ? 'hidden' : ''}`}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {error}
      </div>
    </div>
  );
};
