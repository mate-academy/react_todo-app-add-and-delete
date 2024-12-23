/* eslint-disable max-len */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { FilterStatus, Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [searchInput, setSearchInput] =
    useState<React.RefObject<HTMLInputElement> | null>(null);
  const [loadTodo, setLoadTodo] = useState<Todo | null>(null);
  const [todoQuery, setTodoQuery] = useState<string>('');
  const [todoError, setTodoError] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(todos => {
        setTodosFromServer(todos);
      })
      .catch(error => {
        setTodoError(error.message);
      });
  }, []);

  // useEffect(() => {
  //   if (loadedTodo) {
  //     if (loadedTodo.id === 0) {
  //       setTodosFromServer(prev => [...prev, loadedTodo]);
  //     }
  //   }
  // }, [loadedTodo]);

  const filteredTodos = todosFromServer.filter(todo => {
    if (filterStatus === FilterStatus.ACTIVE) {
      return !todo.completed;
    }

    if (filterStatus === FilterStatus.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const onRemoveTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    // setTodosFromServer(prev => [...prev.filter(todo => todo.id !== todoId)]);
    try {
      await deleteTodo(todoId);
      setTodosFromServer(prev => [...prev.filter(todo => todo.id !== todoId)]);
    } catch (err) {
      if (err instanceof Error) {
        setTodoError(err?.message);
      }

      throw err;
    } finally {
      if (searchInput) {
        searchInput.current?.focus();
      }

      setLoadTodo(null);
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todosFromServer.filter(todo => todo.completed);

    for (const completedTodo of completedTodos) {
      onRemoveTodo(completedTodo.id);
    }
  };

  const addNewTodo = async () => {
    try {
      setLoadTodo({
        id: 0,
        title: todoQuery.trim(),
        userId: USER_ID,
        completed: false,
      });
      const newTodo = await addTodo({ title: todoQuery.trim() });

      setTodosFromServer(prev => [...prev, newTodo]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setTodoError(err?.message);
      }

      throw err;
    } finally {
      setLoadTodo(null);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          query={todoQuery}
          changeQuery={setTodoQuery}
          setTodoError={setTodoError}
          addNewTodo={addNewTodo}
          setSearchInput={setSearchInput}
        />

        <TodoList
          filteredTodos={
            loadTodo ? [...filteredTodos, loadTodo] : filteredTodos
          }
          onRemoveTodo={onRemoveTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todosFromServer.length !== 0 && (
          <TodoFooter
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onClearCompleted={onClearCompleted}
            isClearButtonDisabled={
              !todosFromServer.some(todo => todo.completed)
            }
            todosLenght={todosFromServer.filter(todo => !todo.completed).length}
          />
        )}
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={todoError} setError={setTodoError} />
    </div>
  );
};
