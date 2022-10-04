/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import ErrorNotification from './components/ErrorNotification';
import TodoFooter from './components/Todos/TodoFooter';
import TodoHeader from './components/Todos/TodoHeader';
import TodoList from './components/Todos/TodoList';
import { ErrorTypes } from './types/ErrorTypes';
import { FilterTypes } from './types/FilterTypes';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.All);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([]);

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const changeError = (value: ErrorTypes | null) => {
    setError(value);
  };

  const addTodoToState = (todo: Todo) => {
    setTodos([todo, ...todos]);
  };

  const deleteTodoFromState = (todoId: number) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  const deleteAllCompletedTodos = () => {
    const inProcess = todos.filter(
      todo => todo.completed,
    ).map(todo => todo.id);

    setTodosInProcess(inProcess);

    Promise.all(todos.map(async (todo) => {
      if (todo.completed) {
        await deleteTodo(todo.id);
      }
    }))
      .then(() => {
        setTodos(todos.filter(todo => !inProcess.includes(todo.id)));
      })
      .catch(() => setError(ErrorTypes.Delete))
      .finally(() => setTodosInProcess([]));
  };

  const changeFilterType = (value: FilterTypes) => {
    setFilterType(value);
  };

  const changeIsAdding = (value: boolean) => {
    setIsAdding(value);
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterTypes.All:
          return true;
        case FilterTypes.Active:
          return !todo.completed;
        case FilterTypes.Completed:
          return todo.completed;
        default:
          return null;
      }
    });
  }, [todos, filterType]);

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
      .then(setTodos)
      .catch(() => setError(ErrorTypes.Server));
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          changeError={changeError}
          isAdding={isAdding}
          changeIsAdding={changeIsAdding}
          user={user}
          add={addTodoToState}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              deleteTodoToState={deleteTodoFromState}
              changeError={changeError}
              todosInProcess={todosInProcess}
            />
            <TodoFooter
              filterType={filterType}
              change={changeFilterType}
              deleteAllCompletedTodos={deleteAllCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} changeError={changeError} />

    </div>
  );
};
