import React, {
  FormEvent, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { NewTodo } from './components/NewTodo/NewTodo';
import { AuthContext } from './components/Auth/AuthContext';
import { TodosFilter } from './components/TodosFilter/TodosFilter';
import { TodosList } from './components/TodosList/TodosList';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/Enums';
import { ErrorNotification } from './components/ErrorNotification';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterStatus.All:
          return todo;

        case FilterStatus.Active:
          return !todo.completed;

        case FilterStatus.Completed:
          return todo.completed;

        default:
          return null;
      }
    });
  }, [filterType, todos]);

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setIsError(true);
      setErrorMessage(ErrorMessage.TITLE);

      return;
    }

    setIsAdding(true);

    try {
      const newTodo = await createTodo(user?.id || 0, title);

      setTodos(state => [...state, newTodo]);
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessage.ADDING);
    } finally {
      setTitle('');
      setIsAdding(false);
    }
  }, [todos]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const fetchData = async () => {
      const todosFromServer = await getTodos(user?.id || 0);

      setTodos(todosFromServer);
    };

    try {
      fetchData();
    } catch {
      setErrorMessage(ErrorMessage.LOADING);
    }
  }, [todos]);

  const loadTodos = useCallback(async () => {
    try {
      setTodos(await getTodos(user?.id || 0));
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessage.LOADING);
    }
  }, [todos]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const handleRemove = useCallback(async (todoId: number) => {
    setSelectedTodos(state => [...state, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(todos.filter(({ id }) => id !== todoId));
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessage.DELETING);
    } finally {
      setSelectedTodos([]);
    }
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const deleteComplitedTodos = useCallback(async () => {
    setSelectedTodos(completedTodos.map(todo => todo.id));

    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessage.DELETING);
      setSelectedTodos([]);
    }
  }, [completedTodos]);

  const handleTodoUpdate = useCallback(async (
    todoId: number,
    data: Partial<Todo>,
  ) => {
    setSelectedTodos(state => [...state, todoId]);

    try {
      const newTodo = await updateTodo(todoId, data);

      setTodos(todos.map(todo => (
        todo.id === todoId
          ? newTodo
          : todo
      )));
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessage.UPDATING);
    }

    setSelectedTodos([]);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          todos={todos}
          newTodoField={newTodoField}
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          isAdding={isAdding}
        />

        <TodosList
          todos={filteredTodos}
          isAdding={isAdding}
          title={title}
          removeTodo={handleRemove}
          setSelectedTodos={setSelectedTodos}
          selectedTodos={selectedTodos}
          onUpdate={handleTodoUpdate}
        />

        <TodosFilter
          todos={todos}
          setFilterType={setFilterType}
          filterType={filterType}
          onRemove={deleteComplitedTodos}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        isError={isError}
        setIsError={setIsError}
      />
    </div>
  );
};
