import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { ErrorNotification } from './components/ErrorNotification';
import { filterTodos } from './utils/filterTodos';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorTodos, setErrorTodos] = useState<ErrorType>(ErrorType.Empty);
  const [currentFilter, setCurrentFilter] = useState<Filters>(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const filtered = useMemo(
    () => filterTodos(todos, currentFilter),
    [todos, currentFilter],
  );

  const onAddTodo = async (todoTitle: string) => {
    setErrorTodos(ErrorType.Empty);
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodos({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setErrorTodos(ErrorType.AddTodo);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    setErrorTodos(ErrorType.Empty);
    setLoadingTodosIds(prev => [...prev, todoId]);
    try {
      await deleteTodos(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorTodos(ErrorType.DeleteTodo);
    } finally {
      setLoadingTodosIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    setErrorTodos(ErrorType.Empty);
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      onDeleteTodo(todo.id);
    });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorTodos(ErrorType.LoadTodo));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={onAddTodo}
          setErrorTodos={setErrorTodos}
          isTempTodo={!!tempTodo}
          todosLength={todos.length}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filtered}
              onDeleteTodos={onDeleteTodo}
              loadingTodosIds={loadingTodosIds}
              tempTodo={tempTodo}
            />
            <TodoFooter
              todos={todos}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>
      <ErrorNotification error={errorTodos} setError={setErrorTodos} />
    </div>
  );
};
