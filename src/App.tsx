import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { ErrorsType } from './types/Error';
import { Filter } from './types/Filter';
import { createTodo, getTodos, removeTodo, USER_ID } from './api/todos';
import { UserWarning } from './UserWarning';
import { getPreparedTodos } from './utils/GetPreparedTodos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoNotification } from './components/TodoNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorsType | null>(null);
  const [filterBy, setFilterBy] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputAddRef = useRef<HTMLInputElement>(null);
  const completedTodos = todos.filter(todo => todo.completed).length;

  const loadTodos = useCallback(async () => {
    try {
      const response = await getTodos();

      setTodos(response);
    } catch (error) {
      setErrorMessage(ErrorsType.LoadTodos);
    }
  }, []);

  const addTodo = async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });

    try {
      const newTodo = await createTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setErrorMessage(ErrorsType.AddTodo);
      inputAddRef.current?.focus();
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    try {
      await removeTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setErrorMessage(ErrorsType.DeleteTodo);
      inputAddRef.current?.focus();
      throw err;
    } finally {
      setLoadingIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const clearCompleted = async () => {
    const IsCompletedTodos = todos.filter(todo => todo.completed);

    const deletePromises = IsCompletedTodos.map(todo =>
      removeTodo(todo.id)
        .then(() => todo.id)
        .catch(() => {
          setErrorMessage(ErrorsType.DeleteTodo);

          return null;
        }),
    );

    const deletedIds = (await Promise.all(deletePromises)).filter(
      id => id !== null,
    ) as number[];

    setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));
  };

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const prepared = getPreparedTodos(todos, filterBy);
  const activeTodos = todos.filter(todo => !todo.completed).length;

  const todosCount = todos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          inputRef={inputAddRef}
          todosLength={todosCount}
          isInputDisabled={!!tempTodo}
          onAddTodo={addTodo}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          preparedTodos={prepared}
          onRemoveTodo={deleteTodo}
          loading={loadingIds}
          tempTodo={tempTodo}
        />

        {todosCount > 0 && (
          <TodoFooter
            filter={filterBy}
            setFilter={setFilterBy}
            todos={activeTodos}
            todosCompleted={completedTodos}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <TodoNotification
        errorMessage={errorMessage}
        onSetError={setErrorMessage}
      />
    </div>
  );
};
