/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { todosService } from './services/todosService';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

import './styles/todoapp.scss';

/*eslint-disable-next-line max-len*/
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]); // НОВИЙ СТАН
  const [isCreatingTodo, setIsCreatingTodo] = useState(false);

  // Фокусуємо інпут при першому рендері
  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current!.focus();
    }
  }, []);

  // Завантаження todos
  useEffect(() => {
    let timer: number | null = null;

    const loadTodos = async () => {
      setIsLoading(true); // Показуємо спіннер
      setError(null); // Очищаємо попередні помилки

      try {
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setError(err?.message || 'Unable to load todos');

        timer = window.setTimeout(() => setError(null), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    void loadTodos();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filters = {
    all: (t: Todo[]) => t,
    active: (t: Todo[]) => t.filter(todo => !todo.completed),
    completed: (t: Todo[]) => t.filter(todo => todo.completed),
  };

  const getFilteredTodos = () => {
    return (filters[status] || filters.all)(todos);
  };

  // Додавання нового todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();

    if (!title) {
      setError('Title should not be empty');
      setTimeout(() => setError(null), 3000);

      return;
    }

    // Створюємо тимчасовий todo для спіннера
    const temp: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    const tempId = 0;
    const tempTodoWithFixedId: Todo = { ...temp, id: tempId };

    setProcessingIds(prev => [...prev, tempId]);
    setTempTodo(tempTodoWithFixedId);
    setIsCreatingTodo(true);

    try {
      const created = await todosService.addTodo(title);

      setTodos(prev => [...prev, created]);
      setNewTitle('');
      setTempTodo(null); // ховаємо тимчасовий todo
    } catch {
      setError('Unable to add a todo');

      setTempTodo(null); //
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== temp.id));
      setIsCreatingTodo(false);
      setTimeout(() => {
        if (newTodoField.current) {
          newTodoField.current!.focus();
        }
      }, 0);
    }
  };

  // Видалення todo
  const handleRemoveTodo = async (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    try {
      await todosService.removeTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Unable to delete a todo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));

      setTimeout(() => {
        if (newTodoField.current) {
          newTodoField.current!.focus();
        }
      }, 0);
    }
  };

  // Переключення completed
  const handleToggleTodo = async (todo: Todo) => {
    setProcessingIds(prev => [...prev, todo.id]);

    try {
      await new Promise(res => setTimeout(res, 1000));

      const updated = await todosService.toggleTodo(todo);

      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch {
      setError('Unable to update a todo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== todo.id));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);

    setProcessingIds(prev => [...prev, ...completedTodos.map(t => t.id)]);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(t => todosService.removeTodo(t.id)),
      );

      // видаляємо ті todos, що успішно пройшли
      const successfulIds = completedTodos
        .filter((_, i) => results[i].status === 'fulfilled')
        .map(t => t.id);

      if (successfulIds.length > 0) {
        setTodos(prev => prev.filter(t => !successfulIds.includes(t.id)));
      }

      // якщо хоча б одне видалення впало → показуємо помилку
      if (results.some(r => r.status === 'rejected')) {
        setError('Unable to delete a todo');
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setProcessingIds(prev =>
        prev.filter(id => !completedTodos.map(t => t.id).includes(id)),
      );

      // повертаємо фокус
      setTimeout(() => {
        if (newTodoField.current) {
          newTodoField.current!.focus();
        }
      }, 0);
    }
  };

  const handleToggleAll = async () => {
    // Визначаємо, чи всі todo завершені
    const areAllCompleted = todos.every(todo => todo.completed);
    // Визначаємо новий стан для всіх todo
    const newCompletedStatus = !areAllCompleted;
    // Знаходимо todos, які потребують зміни стану
    const todosToToggle = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    // Якщо нічого змінювати, виходимо
    if (todosToToggle.length === 0) {
      return;
    }

    // Додаємо ID всіх todo, які будуть оновлюватися, до processingIds
    const idsToProcess = todosToToggle.map(t => t.id);

    setProcessingIds(prev => [...prev, ...idsToProcess]);

    try {
      // const updatedTodos = await todosService.toggleAllTodos(
      //   todosToToggle,
      //   newCompletedStatus,
      // );

      setTodos(prev =>
        prev.map(t =>
          idsToProcess.includes(t.id)
            ? { ...t, completed: newCompletedStatus }
            : t,
        ),
      );
    } catch {
      setError('Unable to toggle all todos');
      setTimeout(() => setError(null), 3000);
    } finally {
      // Видаляємо всі оброблені ID зі списку
      setProcessingIds(prev => prev.filter(id => !idsToProcess.includes(id)));
    }
  };

  return (
    <div className="todoapp">
      <Header
        todos={todos}
        processingIds={processingIds}
        handleAddTodo={handleAddTodo}
        handleToggleAll={handleToggleAll}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newTodoField={newTodoField}
        isCreatingTodo={isCreatingTodo}
      />

      <TodoList
        todos={todos}
        processingIds={processingIds}
        getFilteredTodos={getFilteredTodos}
        handleToggleTodo={handleToggleTodo}
        handleRemoveTodo={handleRemoveTodo}
        tempTodo={tempTodo}
        isCreatingTodo={isCreatingTodo}
        isLoading={isLoading}
      />

      <Footer
        todos={todos}
        status={status}
        setStatus={setStatus}
        handleClearCompleted={handleClearCompleted}
      />

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
