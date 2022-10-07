/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Filters } from './components/Filters';

import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { NewTodo } from './components/NewTodo';
import { Error } from './types/Error';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<Error>();
  const [filterBy, setFilterBy] = useState<FilterStatus>(FilterStatus.All);
  const [isTodoLoaded, setIsTodoLoaded] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (!user?.id) {
      return;
    }

    getTodos(user.id).then(setTodos);

    const fetchData = async () => {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    };

    try {
      fetchData();
    } catch {
      setError(Error.Connect);
    }
  }, [todos]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setError(Error.Title);

      return;
    }

    setIsTodoLoaded(true);

    try {
      const newTodo = await createTodo(user?.id || 0, query);

      setTodos([...todos, newTodo]);
    } catch {
      setError(Error.Add);
    } finally {
      setQuery('');
      setIsTodoLoaded(false);
    }
  };

  const handleRemove = async (id: number) => {
    setSelectedTodos([...selectedTodos, id]);
    try {
      await deleteTodo(id);

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch {
      setError(Error.Delete);
    }
  };

  const completedTodos = useMemo(() => {
    return todos.filter((todo) => todo.completed);
  }, [todos]);

  const deleteCompletedTodos = useCallback(async () => {
    setSelectedTodos(completedTodos.map((todo) => todo.id));

    try {
      await Promise.all(completedTodos.map((todo) => deleteTodo(todo.id)));

      setTodos(todos.filter((todo) => !todo.completed));
    } catch {
      setError(Error.Delete);
      setSelectedTodos([]);
    }
  }, [completedTodos]);

  const filterTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterBy) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterBy]);

  const handleTodoUpdate = async (todoId: number, data: Partial<Todo>) => {
    setSelectedTodos([...selectedTodos, todoId]);

    try {
      const newTodo = await updateTodo(todoId, data);

      setTodos(todos.map((todo) => (todo.id === todoId ? newTodo : todo)));
    } catch {
      setError(Error.Update);
    }

    setSelectedTodos([]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          query={query}
          setQuery={setQuery}
          todos={todos}
          newTodoField={newTodoField}
          onAddTodo={handleSubmit}
          isTodoLoaded={isTodoLoaded}
        />

        {(isTodoLoaded || Boolean(todos.length)) && (
          <>
            <TodoList
              todos={filterTodos}
              onRemoveTodo={handleRemove}
              isTodoLoaded={isTodoLoaded}
              query={query}
              selectedTodos={selectedTodos}
              setSelectedTodos={setSelectedTodos}
              onUpdate={handleTodoUpdate}
            />

            <Filters
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      {error && <ErrorNotification setError={setError} error={error} />}
    </div>
  );
};
