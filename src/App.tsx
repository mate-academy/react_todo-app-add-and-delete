/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { getTodos, postTodos } from './api/todos';
import { deleteTodos, USER_ID, patchTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { StatusType } from './types/Status';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<StatusType>(StatusType.All);
  const timerId = useRef<number | null>(null);
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  const [isClearing, setIsClearing] = useState(false);

  const [isTogglingAll, setIsTogglingAll] = useState(false);

  const showError = (message: string) => {
    setError(message);

    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      showError(ErrorMessages.UserNotRegistered);

      return;
    }

    setIsLoading(true);
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ErrorMessages.LoadTodos);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleFilterChange = (newStatus: StatusType) => {
    setStatus(newStatus);
  };

  const filteredTodos = todos.filter(todo => {
    if (status === StatusType.Active) {
      return !todo.completed;
    }

    if (status === StatusType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const handleAddTodo = async (title: string) => {
    setError('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessages.EmptyTitle);

      return false;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);
    setIsAdding(true);

    try {
      const newTodo = await postTodos({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(prev => [...prev, newTodo]);
      setTimeout(() => {
        newTodoInputRef.current?.focus();
      }, 0);

      return true;
    } catch {
      showError(ErrorMessages.AddTodo);
      setTimeout(() => {
        newTodoInputRef.current?.focus();
      }, 0);

      return false;
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleToggle = (id: number, completed: boolean) => {
    setLoadingTodoId(prev => [...prev, id]);

    patchTodo(id, { completed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        showError(ErrorMessages.UpdateTodo);
      })
      .finally(() => {
        setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleDelete = async (id: number) => {
    setLoadingTodoId(prev => [...prev, id]);

    try {
      await deleteTodos(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      setTimeout(() => {
        newTodoInputRef.current?.focus();
      }, 0);
    } catch {
      showError(ErrorMessages.DeleteTodo);
    } finally {
      setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsClearing(true);
    setLoadingTodoId(completedTodos.map(todo => todo.id));

    const result = await Promise.allSettled(
      completedTodos.map(todo => deleteTodos(todo.id)),
    );

    const deletedTodos = completedTodos
      .filter((_, index) => result[index].status === 'fulfilled')
      .map(todo => todo.id);

    setTodos(prev => prev.filter(todo => !deletedTodos.includes(todo.id)));

    if (result.some(r => r.status === 'rejected')) {
      showError(ErrorMessages.DeleteTodo);
    }

    setLoadingTodoId([]);
    setIsClearing(false);

    setTimeout(() => {
      newTodoInputRef.current?.focus();
    }, 0);
  };

  const handleToggleAll = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newCompleted = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newCompleted);

    setIsTogglingAll(true);

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          patchTodo(todo.id, { completed: newCompleted }),
        ),
      );

      setTodos(prev =>
        prev.map(todo => ({
          ...todo,
          completed: newCompleted,
        })),
      );
    } catch {
      showError(ErrorMessages.ToggleAll);
    } finally {
      setIsTogglingAll(false);
    }
  };

  const handleRename = async (id: number, title: string): Promise<boolean> => {
    setLoadingTodoId(prev => [...prev, id]);
    try {
      const todo = todos.find(t => t.id === id);

      if (!todo) {
        return false;
      }

      const updatedTodo = await patchTodo(id, {
        title,
        completed: todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));

      return true;
    } catch {
      showError(ErrorMessages.UpdateTodo);

      return false;
    } finally {
      setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          isAdding={isAdding}
          isLoading={isLoading}
          onToggleAll={handleToggleAll}
          isTogglingAll={isTogglingAll}
          todos={todos}
          newTodoInputRef={newTodoInputRef}
        />
        {isLoading ? (
          <div className="todoapp__loader">Loading...</div>
        ) : (
          (todos.length > 0 || tempTodo) && (
            <TodoList
              todos={[...filteredTodos, ...(tempTodo ? [tempTodo] : [])]}
              onToggle={handleToggle}
              loadingTodoId={loadingTodoId}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          )
        )}
        {!isLoading && todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            onFilterChange={handleFilterChange}
            onClearCompleted={handleClearCompleted}
            isClearing={isClearing}
          />
        )}
      </div>
      <Error error={error} setError={setError} />
    </div>
  );
};
