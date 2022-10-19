import React, {
  useState, useContext, useEffect, useMemo, useCallback,
} from 'react';
import { getTodos, createTodo, deleteTodo } from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

import {
  getFilteredTodo,
  getNotCompletedTodoNumber,
  getCompletedTodoNumber,
} from './utils/FilteredTodo';

import { debounce } from './utils/debounce';

import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [debounceTodoTitle, setDebounceTodoTitle] = useState('');
  const [filteredType, setFilteredType] = useState(FilterType.All);
  const [errorAlert, setErrorAlert] = useState<ErrorType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(0);

  const visibleTodo = useMemo(() => (
    getFilteredTodo(todos, filteredType)
  ), [todos, filteredType]);

  const notCompletedTodoNumber = useMemo(() => (
    getNotCompletedTodoNumber(todos)
  ), [todos, filteredType]);

  const completedTodoNumber = useMemo(() => (
    getCompletedTodoNumber(todos)
  ), [todos, filteredType]);

  const applyTodoTitle = useCallback(
    debounce(setDebounceTodoTitle, 100),
    [],
  );

  const loadTodosFromServer = useCallback(
    async () => {
      try {
        if (user?.id) {
          const todosFromServer = await getTodos(user.id);

          setTodos(todosFromServer);
        }
      } catch {
        setErrorAlert(ErrorType.loadedError);
      } finally {
        setTodoTitle('');
      }

      setIsAdding(false);
    }, [],
  );

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  const loadTodoOnServer = useCallback(
    async () => {
      try {
        if (user?.id) {
          await createTodo(user.id, todoTitle);
          setDebounceTodoTitle('');
        }
      } catch (error) {
        setErrorAlert(ErrorType.addedError);
      } finally {
        loadTodosFromServer();
      }
    }, [debounceTodoTitle],
  );

  const deleteTodoFromServer = useCallback(
    async (idTodo: number) => {
      try {
        setIsRemoving(true);

        if (user?.id) {
          await deleteTodo(idTodo);

          setSelectedTodo(idTodo);
        }
      } catch (error) {
        setErrorAlert(ErrorType.deletedError);
      } finally {
        loadTodosFromServer();
      }

      setIsRemoving(false);
    }, [],
  );

  const handleClearCompletedTodos = () => {
    const selectedTodos = todos.filter(todo => todo.completed);

    selectedTodos.map(todo => deleteTodoFromServer(todo.id));
  };

  const handleLoadTodoOnServer = (eventSubmit: React.FormEvent) => {
    eventSubmit.preventDefault();
    setIsAdding(true);

    if (!todoTitle) {
      setErrorAlert(ErrorType.titleError);

      return;
    }

    loadTodoOnServer();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">

        <Header
          todoTitle={todoTitle}
          isAdding={isAdding}
          applyTodoTitle={applyTodoTitle}
          setTodoTitle={setTodoTitle}
          handleLoadTodoOnServer={handleLoadTodoOnServer}
        />

        {(isAdding || todos.length > 0) && (
          <TodoList
            visibleTodo={visibleTodo}
            isAdding={isAdding}
            todoTitle={todoTitle}
            selectedTodo={selectedTodo}
            deleteTodoFromServer={deleteTodoFromServer}
          />
        )}

        {todos.length > 0 && (
          <Footer
            filteredType={filteredType}
            notCompletedTodoNumber={notCompletedTodoNumber}
            completedTodoNumber={completedTodoNumber}
            setFilteredType={setFilteredType}
            handleClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      {errorAlert !== null && (
        <ErrorNotification
          errorAlert={errorAlert}
          setIsAdding={setIsAdding}
          setErrorAlert={setErrorAlert}
        />
      )}
    </div>
  );
};
