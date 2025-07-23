/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as TodoAPI from './api/todos';
import { Todo } from './types/Todo';
import { FilterOption } from './types/FilterOption';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoForm } from './components/TodoForm';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | ''>('');
  const [filter, setFilter] = useState<FilterOption>('All');
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [todoLoading, setTodoLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | undefined>(undefined);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  //#region FETCHING_TODOS
  const fetchTodos = async () => {
    setLoading(true);
    setError('');

    try {
      const todosData = await TodoAPI.getTodos();

      setTodos(todosData);
    } catch {
      setError(ErrorMessage.LoadTodos);
    } finally {
      setLoading(false);

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  useEffect(() => {
    if (!TodoAPI.USER_ID) {
      return;
    }

    fetchTodos();
  }, []);
  //#endregion

  //#region ADDING_TODOS
  const addNewTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    setError('');
    setTodoLoading(true);

    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: TodoAPI.USER_ID,
      completed: false,
    });

    try {
      const responseTodo = await TodoAPI.addTodo({
        title: trimmedTitle,
        userId: TodoAPI.USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, responseTodo]);

      setTodoTitle('');
    } catch {
      setError(ErrorMessage.AddTodo);
    } finally {
      setTodoLoading(false);

      setTempTodo(undefined);
    }
  };
  //#endregion

  //#region DELETING_TODOS
  const deleteTodo = async (id: number) => {
    setLoadingIds(prev => new Set(prev).add(id));
    setError('');

    try {
      await TodoAPI.deleteTodo(id);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setError(ErrorMessage.DeleteTodo);
    } finally {
      setLoadingIds(prev => {
        const newSet = new Set(prev);

        newSet.delete(id);

        return newSet;
      });
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setTodoLoading(true);
    setError('');

    const results = await Promise.allSettled(
      completedTodos.map(todo => TodoAPI.deleteTodo(todo.id)),
    );

    const deletedIds = results
      .map((res, i) =>
        res.status === 'fulfilled' ? completedTodos[i].id : null,
      )
      .filter((id): id is number => id !== null);

    if (deletedIds.length < completedTodos.length) {
      setError(ErrorMessage.DeleteTodo);
    }

    setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));

    setTodoLoading(false);
  };
  //#endregion

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'Active':
        return todos.filter(t => !t.completed);
      case 'Completed':
        return todos.filter(t => t.completed);
      case 'All':
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const completedCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const allCompleted = useMemo(
    () => todos.length > 0 && todos.every(t => t.completed),
    [todos],
  );

  if (!TodoAPI.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">My todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todos={filteredTodos}
          newNoteTitle={todoTitle}
          onAdd={addNewTodo}
          onTyping={setTodoTitle}
          disabled={todoLoading}
          allCompleted={allCompleted}
        />

        {loading ? (
          <div className="todoapp__loader" data-cy="Loader"></div>
        ) : (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              onDelete={deleteTodo}
              todoLoading={todoLoading}
              loadingIds={loadingIds}
            />
            <Footer
              todos={todos}
              filter={filter}
              onFilterChange={setFilter}
              activeCount={activeCount}
              completedCount={completedCount}
              onClear={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification message={error} onClear={() => setError('')} />
    </div>
  );
};
