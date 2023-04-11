import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { TodoFilter } from './components/TodoFilter';
import { Loader } from './components/Loader';
import { Error } from './components/Error';
import { TodoForm } from './components/TodoForm';

const USER_ID = 6925;

export const App: React.FC = () => {
  const [errorMessage, setErrorMesage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isDisabledInput, setIsDisableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const setError = (message: string) => {
    setErrorMesage(message);
    setHasError(true);
    setTimeout(() => setHasError(false), 3000);
  };

  const loadTodos = async () => {
    setIsloading(true);
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setError('Unable to load todos');
    } finally {
      setIsloading(false);
    }
  };

  const sendTodo = async (todo: Omit<Todo, 'id'>) => {
    setIsDisableInput(true);
    try {
      const todoToServer: Todo = await postTodo(USER_ID, todo);

      setTodos([...todos, todoToServer]);
    } catch (error) {
      setError('Unable to add a todo');
    } finally {
      setIsDisableInput(false);
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    setLoadingIds(loadingIdList => [...loadingIdList, todoId]);
    try {
      await deleteTodo(USER_ID, todoId);
      setTodos(todoList => todoList.filter(({ id }) => id !== todoId));
    } catch (error) {
      setError('Unable to delete a todo');
    } finally {
      setLoadingIds(loadingIdList => loadingIdList.filter(id => id !== todoId));
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    setHasError(false);
    switch (filterType) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filterType, todos]);

  const activeTodosCount = todos.reduce((count, todo) => (
    todo.completed ? count : (count + 1)
  ), 0);

  const handleTodoAdding = (title: string) => {
    setHasError(false);
    if (!title) {
      setError('Title can not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title,
      completed: false,
      userId: USER_ID,
    };

    sendTodo(newTodo);

    setTempTodo({ ...newTodo, id: 0 });
  };

  const handleDeleteTodo = (id: number) => {
    setHasError(false);
    removeTodo(id);
  };

  const handleClearCompleted = () => {
    setHasError(false);
    todos.forEach(({ completed, id }) => {
      if (completed) {
        removeTodo(id);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="toggle"
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: activeTodosCount === 0,
            })}
          />

          <TodoForm
            onSubmit={handleTodoAdding}
            disabled={isDisabledInput}
          />
        </header>

        {todos && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            loadingIds={loadingIds}
          />
        )}

        {isLoading && <Loader />}

        {todos.length > 0 && (
          <TodoFilter
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            activeTodosCount={activeTodosCount}
            onClearCompleted={handleClearCompleted}
          />
        )}

      </div>

      <Error
        errorMessage={errorMessage}
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
