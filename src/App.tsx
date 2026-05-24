import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';

import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

import { Todo } from './types/Todo';
import { Errors } from './types/ErrorType';
import { Filters } from './types/FilterStatus';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [statuses, setStatuses] = useState<Filters>(Filters.All);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const field = useRef<HTMLInputElement>(null);

  const onAddTodo = useCallback(async (title: string) => {
    const tempTodoId = { id: 0, title, completed: false, userId: USER_ID };

    setTempTodo(tempTodoId);

    try {
      const createdTodo = await addTodo({ title, completed: false });

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setNewTitle('');
    } catch (error) {
      setErrorMessage(Errors.UnadleToAdd);
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const onRemoveTodo = useCallback(async (todoId: number) => {
    setLoading(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(Errors.UnableToDelete);
    }

    setLoading(prev => prev.filter(id => id !== todoId));
    field.current?.focus();
  }, []);

  const onRemoveAllCompleted = useCallback(async () => {
    const allTodosCompleted = todos.filter(todo => todo.completed);

    allTodosCompleted.forEach(todo => onRemoveTodo(todo.id));
  }, [todos, onRemoveTodo]);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(Errors.UnableToLoad);
        setTimeout(() => setErrorMessage(null), 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos?.filter(todo => {
    switch (statuses) {
      case Filters.Active:
        return todo.completed === false;

      case Filters.Completed:
        return todo.completed === true;

      default:
        return true;
    }
  });

  const countActiveTodos = todos?.filter(
    todo => todo.completed === false,
  ).length;

  const countCompletedTodos = todos?.filter(
    todo => todo.completed === true,
  ).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          setErrorMessage={setErrorMessage}
          onAddTodo={onAddTodo}
          field={field}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onRemoveTodo={onRemoveTodo}
              loading={loading}
              tempTodo={tempTodo}
            />
            <Footer
              statuses={statuses}
              setStatuses={setStatuses}
              countActiveTodos={countActiveTodos}
              countCompletedTodos={countCompletedTodos}
              onRemoveAllCompleted={onRemoveAllCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
