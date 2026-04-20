/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { FilterStatus } from './types/FilterStatus';
import { Footer } from './components/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { USER_ID } from './types/UserId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [titleInput, setTitleInput] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');

  const [isDetetingIdTodos, setIsDetetingIdTodos] = useState<number[]>([]);

  const [disabledHeaderInput, setDisabledHeaderInput] = useState(false);

  const headerInputRef = useRef<HTMLInputElement | null>(null);

  const headerFocus = useCallback(() => {
    headerInputRef.current?.focus();
  }, []);

  useEffect(() => {
    headerFocus();
  }, [headerFocus]);

  useEffect(() => {
    if (!disabledHeaderInput) {
      headerInputRef.current?.focus();
    }
  }, [disabledHeaderInput]);

  const timerId = useRef(0);

  const handleSetError = (newError: string) => {
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setError('');
    }, 3000);

    setError(newError);
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setIsDetetingIdTodos((currentIsDeleting: number[]) => [
        ...currentIsDeleting,
        todoId,
      ]);
      await todoService.deleteTodo(todoId);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
    } catch {
      handleSetError('Unable to delete a todo');
      throw new Error('Unable to delete a todo');
    } finally {
      headerFocus();
    }
  };

  const clearCompletedTodos = async () => {
    try {
      const idsComplited = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setIsDetetingIdTodos((currentIsDeleting: number[]) => [
        ...currentIsDeleting,
        ...idsComplited,
      ]);

      const promiseDeletingTodos = await Promise.allSettled(
        idsComplited.map(id => todoService.deleteTodo(id)),
      );

      const succeeded = promiseDeletingTodos
        .map((r, i) => (r.status === 'fulfilled' ? idsComplited[i] : null))
        .filter(Boolean) as number[];

      setTodos(prev => prev.filter(t => !succeeded.includes(t.id)));

      if (promiseDeletingTodos.some(r => r.status === 'rejected')) {
        handleSetError('Unable to delete a todo');
      }

      setIsDetetingIdTodos((currentIsDeleting: number[]) =>
        currentIsDeleting.filter(id => !idsComplited.includes(id)),
      );

      headerFocus();
    } catch {
      handleSetError('Unable to delete a todo');
    }
  };

  const addTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      handleSetError('Title should not be empty');

      return;
    }

    setDisabledHeaderInput(true);

    setTempTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    } as Todo);

    try {
      const newTodo = await todoService.createTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTitleInput('');
      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch {
      handleSetError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setDisabledHeaderInput(false);
    }
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(todo => {
        window.clearTimeout(timerId.current);
        setTodos(todo);
      })
      .catch(() => {
        handleSetError('Unable to load todos');
      });
  }, []);

  const filteredTodos: Todo[] = useMemo(() => {
    if (filter === FilterStatus.All) {
      return todos;
    }

    return todos.filter(todo =>
      filter === FilterStatus.Active ? !todo.completed : todo.completed,
    );
  }, [todos, filter]);

  const hasCompletedTodo: boolean = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const isEveryCompletedTodo: boolean = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const itemsLeft: number = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isEveryCompletedTodo={isEveryCompletedTodo}
          headerInputRef={headerInputRef}
          title={titleInput}
          setTitle={setTitleInput}
          addTodo={addTodo}
          disabledInput={disabledHeaderInput}
        />

        <TodosList
          todos={filteredTodos}
          onDelete={deleteTodo}
          tempTodo={tempTodo}
          isDetetingIdTodos={isDetetingIdTodos}
        />

        {todos.length !== 0 && (
          <Footer
            itemsLeft={itemsLeft}
            setFilter={setFilter}
            filter={filter}
            hasCompletedTodo={hasCompletedTodo}
            onClearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
