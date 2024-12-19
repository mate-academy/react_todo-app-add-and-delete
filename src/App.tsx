/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Errors } from './types/ErrorType';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';
import { getTodos, addTodo, USER_ID, deleteTodo } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);

  const filteredTodos = todos?.filter(todo => {
    switch (status) {
      case FilterType.Completed:
        return todo.completed;
      case FilterType.Active:
        return !todo.completed;
      default:
        return true;
    }
  });

  const unCompletedTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const onAddTodo = async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setErrorMessage(Errors.AddTodo);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onRemoveTodo = async (todoId: number) => {
    setLoadingTodo(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(Errors.DeleteTodo);
      throw err;
    } finally {
      setLoadingTodo(prev => prev.filter(id => id !== todoId));
    }
  };

  const onClearCompleted = async () => {
    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => onRemoveTodo(todo.id));
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.UnableToLoad));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader onAddTodo={onAddTodo} setErrorMessage={setErrorMessage} />

        {!!todos.length && (
          <>
            <section className="todoapp_main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onRemoveTodo={onRemoveTodo}
                  isLoading={loadingTodo.includes(todo.id)}
                />
              ))}
              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  onRemoveTodo={onRemoveTodo}
                  isLoading
                />
              )}
            </section>
            <TodoFooter
              status={status}
              setStatus={setStatus}
              unCompletedTodos={unCompletedTodos}
              completedTodos={completedTodos}
              onClearCompleted={onClearCompleted}
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
