/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './components/UserWarning';
import { TodoInput } from './components/TodoInput';
import { TodosList } from './components/TodosList';
import { Todo } from './types/Todo';
import { TodosFilter } from './components/TodosFilter';
import { NotificationError } from './components/NotificationError';
import { Filter } from './types/Filter';
import { createTempTodo, filterTodos } from './utils/helpers';
import { deleteTodos, getTodos, postTodos } from './api/todos';
import { ErrorAction } from './types/ErrorAction';
import { TodoItem } from './components/TodoItem';

const USER_ID = 7017;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState(Filter.ALL);
  const [error, setError] = useState<ErrorAction | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const [clearIsPressed, setClearIsPressed] = useState<boolean>(false);
  const activeTodos = filterTodos(todos, Filter.ACTIVE);
  const completedTodos = filterTodos(todos, Filter.COMPLETED);
  const areAllTodosCompleted = todos.length === completedTodos.length;

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorAction.LOAD);
    }
  };

  const addTodo = async (title: string) => {
    try {
      setIsInProgress(true);
      setTempTodo(createTempTodo(title));
      const data = { userId: USER_ID, title, completed: false };
      const newTodo = await postTodos(data);

      setTodos(stateTodos => [...stateTodos, newTodo]);
    } catch {
      setError(ErrorAction.ADD);
    } finally {
      setTempTodo(null);
      setIsInProgress(false);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodos(todoId);

      const todosWithoutRemoved = todos.filter(todo => {
        return todo.id !== todoId;
      });

      setTodos(todosWithoutRemoved);
    } catch {
      setError(ErrorAction.DELETE);
    }
  };

  const removeCompletedTodos = async () => {
    setClearIsPressed(true);
    const todosToRemove = completedTodos.map(todo => deleteTodos(todo.id));

    await Promise.all(todosToRemove);

    setTodos(activeTodos);
    setClearIsPressed(false);
  };

  const visibleTodos = useMemo(
    () => filterTodos(todos, currentFilter),
    [currentFilter, todos],
  );

  useEffect(() => {
    loadTodos();
  }, []);

  const resetError = () => {
    setTimeout(() => {
      setError(null);
    }, 500);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput
          isButtonActive={areAllTodosCompleted}
          isInputDisabled={isInProgress}
          setError={setError}
          addTodo={addTodo}
        />

        <section className="todoapp__main">
          <TodosList
            todos={visibleTodos}
            clearIsPressed={clearIsPressed}
            removeTodo={removeTodo}
          />
          {tempTodo && (<TodoItem todo={tempTodo} isTempTodo />)}
        </section>

        {todos.length > 0 && (
          <TodosFilter
            itemsLeft={activeTodos.length}
            completedLeft={completedTodos.length}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            onClearCompleted={removeCompletedTodos}
          />
        )}
      </div>

      {error && (
        <NotificationError
          action={error}
          resetError={resetError}
        />
      )}
    </div>
  );
};
