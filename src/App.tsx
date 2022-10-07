import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { FilterTodos } from './components/FilterTodos/FilterTodos';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { Errors } from './types/Errors';
import { GroupBy } from './types/GroupBy';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState(todos);
  const [error, setError] = useState<Errors>(Errors.NONE);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTodos = async () => {
    try {
      setTodos(await getTodos(user?.id || 0));
    } catch {
      setError(Errors.URL);
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, [isAdding]);

  const filterTodos = useCallback((groupBy: string) => {
    setVisibleTodos(
      todos.filter(todo => {
        switch (groupBy) {
          case GroupBy.Active:
            return !todo.completed;
          case GroupBy.Completed:
            return todo.completed;

          default:
            return true;
        }
      }),
    );
  }, [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed)
  ), [todos]);

  const leftTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  const addTodo = async (todoTitle: string) => {
    setIsAdding(true);

    try {
      setTodos([...todos, await createTodo(user?.id || 0, todoTitle)]);
    } catch {
      setError(Errors.ADD);
    } finally {
      setIsAdding(false);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
    } catch {
      setError(Errors.DELETE);
      throw new Error('Unable to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const removeCompletedTodos = async () => {
    setIsDeleting(true);
    try {
      completedTodos.forEach(({ id }) => removeTodo(id));
    } catch {
      setError(Errors.DELETE);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          todos={todos}
          isAdding={isAdding}
          leftTodosLength={leftTodos.length}
          setError={setError}
          onAdd={addTodo}
        />

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={visibleTodos}
              removeTodo={removeTodo}
              isAdding={isAdding}
              isDeleting={isDeleting}
            />
            <FilterTodos
              filterTodos={filterTodos}
              todos={todos}
              completedTodosLength={completedTodos.length}
              leftTodosLength={leftTodos.length}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      {error !== Errors.NONE
        && <ErrorNotification error={error} setError={setError} />}
    </div>
  );
};
