/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/filterStatus';
import { ErrorMessage } from './types/errorMessage';
import { TodoHeader } from './components/todoHeader/todoHeader';
import { TodoFooter } from './components/todoFooter/todoFooter';
import { TodoMain } from './components/todoMain/todoMain';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  // Стан для збереження списку справ, завантажених з сервера
  const [todos, setTodos] = useState<Todo[]>([]);
  // Стан для збереження тексту помилки (LOAD, EMPTY_TITLE тощо)
  const [errorMessage, setErrorMessage] = useState('');
  // Стан для контролю значення в інпуті додавання нової справи
  const [newTodoTitle, setNewTodoTitle] = useState('');
  // Стан для блокування інпуту під час запиту до API
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Стан для поточного фільтра (all, active, completed)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // В App.tsx додайте стан:
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Функція, яка буде фокусувати інпут
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Ефект для первинного завантаження справ при мовтуванні компонента
  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(response => {
        // Записуємо отримані з сервера справи у стан
        setTodos(response);
      })
      .catch(() => {
        // У разі помилки завантаження показуємо відповідне повідомлення
        setErrorMessage(ErrorMessage.LOAD);
      });
  }, []);

  // Ефект автоматичного приховання повідомлення про помилку через 3 секунди
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    // Запускаємо таймер очищення помилки
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    // Очищаємо таймер при зміні помилки або розмонтуванні ефекту
    return () => clearTimeout(timerId);
  }, [errorMessage]);

  // Фільтрація справ на основі поточного filterStatus
  const visibleTodos = todos.filter(todo => {
    if (filterStatus === FilterStatus.ACTIVE) {
      return !todo.completed; // Повертаємо тільки неліквидовані справи
    }

    if (filterStatus === FilterStatus.COMPLETED) {
      return todo.completed; // Повертаємо тільки виконані справи
    }

    return true; // Для фільтра ALL повертаємо весь список
  });

  // Обробник створення нової справи
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');
        // Додаємо очищення tempTodo тут, після успішного запиту
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.ADD);
        // Прибираємо тимчасову справу, бо запит не вдався
        setTempTodo(null);
      })
      .finally(() => {
        setIsSubmitting(false);
        // Фокус інпуту після того, як React оновив DOM
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteTodo = async (id: number): Promise<void> => {
    // Додаємо ID справи в масив обробки
    setProcessingIds(prev => [...prev, id]);

    const previousTodos = [...todos];

    try {
      await client.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE);
      setTodos(previousTodos);
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      await deleteTodo(todo.id);
    }
  };

  // Перевірка наявності ідентифікатора користувача
  if (!USER_ID) {
    return <UserWarning />;
  }

  // Створюємо масив, який враховує і серверні, і тимчасову справу
  const todosForRender = [...visibleTodos];

  if (tempTodo) {
    todosForRender.push(tempTodo);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleSubmit={handleSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isSubmitting={isSubmitting}
          focusInput={inputRef}
        />

        {/* Рендеримо список та футер тільки якщо в масиві є хоча б один todo */}
        {todos.length > 0 && (
          <>
            <TodoMain
              visibleTodos={todosForRender}
              processingIds={processingIds}
              deleteTodo={deleteTodo}
            />

            <TodoFooter
              todos={todos}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      {/* Контейнер помилки, який приховується за допомогою класу hidden */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
