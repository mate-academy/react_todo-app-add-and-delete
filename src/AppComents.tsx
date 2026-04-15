// #region Imports
import React, { useEffect, useMemo, useState, useRef } from 'react';

import * as todoServese from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessages } from './types/ErrorMessages';
import { TodoItems } from './components/TodoItems/TodoItems';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotif/ErrorNotification';
// #endregion

/** Перелік можливих станів фільтрації */
export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  // #region State (Стан додатка)
  const [todos, setTodos] = useState<Todo[]>([]); // Основний масив справ
  const [error, setError] = useState<ErrorMessages | null>(null); // Поточна помилка для сповіщення
  const [loading, setLoading] = useState(true); // Глобальний статус завантаження
  const [addNewTodo, setAddNewTodo] = useState(''); // Текст у полі введення нової справи
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null); // ID справи, яка зараз оновлюється
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]); // Список ID справ, що видаляються

  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const newTodoInputRef = useRef<HTMLInputElement>(null); // Реф для фокусування на інпуті

  // Рахуємо кількість несевершених справ:
  // Фільтруємо масив, залишаючи тільки ті, де completed === false, і беремо довжину отриманого масиву
  const uncompletedTodosCount = todos.filter(todo => !todo.completed).length;

  // Створюємо список тільки завершених справ (мемоізований)
  const completedTodos = useMemo(() => {
    // Ця функція всередині виконається лише тоді, коли зміниться масив [todos]
    return todos.filter(todo => todo.completed);
  }, [todos]); // Список залежностей: стежимо за змінами в todos
  // #endregion

  /** Ефект: Автоматичне приховування помилки через 3 секунди */
  useEffect(() => {
    if (error === null) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timerId); // Очистка таймера при зміні помилки
  }, [error]);

  /** Додавання нової справи */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedTitle = addNewTodo.trim();

    // Валідація на порожній рядок
    if (trimmedTitle === '') {
      setError(ErrorMessages.TitleEmpty);

      return;
    }

    setLoading(true);
    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      userId: todoServese.USER_ID,
      completed: false,
    };

    setLoadingTodoId(todoServese.USER_ID); // Імітуємо завантаження для скелетону

    todoServese
      .createTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setAddNewTodo(''); // Очищаємо інпут після успіху
      })
      .catch(() => setError(ErrorMessages.AddFail))
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  };

  /** Видалення однієї справи за ID */
  const handleDelete = (todoID: number) => {
    setError(null);
    setLoading(true);
    setLoadingTodoId(todoID); // Активуємо спінер на конкретному рядку

    todoServese
      .deleteTodo(todoID)
      .then(() => {
        setTodos(prev => prev.filter(p => p.id !== todoID));
      })
      .catch(() => setError(ErrorMessages.DeleteFail))
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  };

  /** Масове видалення всіх завершених справ */
  const handleDeleteClearCompleted = () => {
    setError(null);
    if (completedTodos.length === 0) {
      return;
    }

    setLoading(true);
    const idsToDelete = completedTodos.map(todo => todo.id);

    setDeletingTodoIds(idsToDelete);

    const failedIds: number[] = [];

    // Запускаємо всі запити на видалення паралельно
    const deletePromises = completedTodos.map(todo =>
      todoServese.deleteTodo(todo.id).catch(() => {
        failedIds.push(todo.id);
        setError(ErrorMessages.DeleteFail);

        return null;
      }),
    );

    // Чекаємо завершення всіх асинхронних операцій видалення, які були запущені раніше
    Promise.all(deletePromises)
      .then(() => {
        // Оновлюємо основний масив справ у стані React
        setTodos(currentTodos =>
          // Залишаємо в списку тільки ті справи, які:
          currentTodos.filter(
            // 1. Або ще не були завершені (не підлягали видаленню)
            // 2. Або завершені, але їх видалення на сервері провалилося (вони є в failedIds)
            todo => !todo.completed || failedIds.includes(todo.id),
          ),
        );
      })
      .finally(() => {
        // Цей блок виконається в будь-якому випадку після завершення всіх запитів:
        // Очищаємо список ID, що перебували в процесі видалення, щоб зняти з них візуальне блокування
        setDeletingTodoIds([]);
        // Вимикаємо загальний індикатор завантаження для інтерфейсу
        setLoading(false);
      });
  };

  /** Початкове завантаження даних при старті додатка */
  useEffect(() => {
    setError(null);
    setLoading(true);
    todoServese
      .getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessages.LoadFail))
      .finally(() => setLoading(false));
  }, []);

  /** Фокусування на полі введення після того, як завантаження завершено */
  useEffect(() => {
    if (!loading && newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [loading]);

  /** Фільтрація списку справ залежно від обраної вкладки (All/Active/Completed) */
  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={newTodoInputRef}
          addNewTodo={addNewTodo}
          setAddNewTodo={setAddNewTodo}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {/* Проходимося по масиву filteredTodos (список справ після фільтрації)
              і для кожного об'єкта todo створюємо компонент TodoItems */}
          {filteredTodos.map(todo => (
            <TodoItems
              key={todo.id} // Унікальний ідентифікатор React для оптимізації рендерингу
              todo={todo} // Передаємо дані конкретної справи в пропси
              loadingTodo={
                /* Визначаємо, чи заблокувати справу індикатором завантаження:
                              - якщо її ID збігається з ID справи, що зараз редагується (loadingTodoId)
                              - або якщо її ID є в списку справ на видалення (deletingTodoIds) */
                loadingTodoId === todo.id || deletingTodoIds.includes(todo.id)
              }
              handleDelete={handleDelete} // Передаємо функцію для видалення
            />
          ))}

          {/* Цей блок відповідає за відображення "тимчасової" справи під час створення нової.
                      Умова: якщо йде завантаження (loading) і ми додаємо справу саме для поточного користувача.
                      */}

          {loading && loadingTodoId === todoServese.USER_ID && (
            <TodoItems
              key={-1} // Використовуємо -1 як тимчасовий ключ, оскільки справжнього ID від сервера ще немає
              todo={{
                id: -1,
                title: addNewTodo, // Текст, який користувач щойно ввів у поле вводу
                userId: todoServese.USER_ID,
                completed: false, // За замовчуванням нова справа не виконана
              }}
              loadingTodo={loading} // Примусово встановлюємо стан завантаження для цього елемента
              handleDelete={handleDelete}
            />
          )}
        </section>

        {/* Футер показуємо тільки якщо є хоча б одна справа */}
        {todos.length > 0 && (
          <Footer
            uncompletedTodosCount={uncompletedTodosCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            handleDeleteClearCompleted={handleDeleteClearCompleted}
            completedTodosCount={completedTodos.length}
          />
        )}
      </div>

      {/* Глобальне сповіщення про помилки */}
      <ErrorNotification errorMessage={error} onClose={() => setError(null)} />
    </div>
  );
};
