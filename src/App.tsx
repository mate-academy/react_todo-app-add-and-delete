import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos, createTodo, destroyTodo } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { FilterStatus } from './types/FilterStatus';
import { Error } from './components/ErrorBlock/Error';

const USER_ID = 10266;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(FilterStatus.ALL);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisable, setIsInputDisable] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isClearCompletedClicked, setIsClearCompletedClicked] = useState(false);

  const hasCompletedTodos = todos.some((todo) => todo.completed);
  const hasActiveTodos = todos.some((todo) => !todo.completed);
  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosId = todos
    .filter((todo) => todo.completed)
    .map((todo) => todo.id);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      setError('Title can`t be empty');

      return;
    }

    try {
      setError(null);
      setIsInputDisable(true);
      setIsLoaderVisible(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: inputValue,
        completed: false,
      });

      const response = await createTodo(USER_ID, {
        userId: USER_ID,
        id: 0,
        title: inputValue.trim(),
        completed: false,
      });

      setTodos((prevTodos) => [...prevTodos, response]);
      setInputValue('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setIsInputDisable(false);
      setTempTodo(null);
      setIsLoaderVisible(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setError(null);
      setSelectedTodoId(id);
      setIsLoaderVisible(true);

      await destroyTodo(id);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsLoaderVisible(false);
      setSelectedTodoId(null);
    }
  };

  const handleDeleteComplitedTodos = async () => {
    try {
      setError(null);
      setIsClearCompletedClicked(true);
      setIsLoaderVisible(true);

      await Promise.all(
        completedTodosId.map((id: number) => destroyTodo(id)),
      );
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    } catch {
      setError('Unable to delete completed todos');
    } finally {
      setIsLoaderVisible(false);
      setIsClearCompletedClicked(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case FilterStatus.ACTIVE:
        return !todo.completed;
      case FilterStatus.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    async function fetchTodos() {
      try {
        setError(null);
        const response = await getTodos(USER_ID);

        setTodos(response);
      } catch {
        setError('Unable to load todos');
      }
    }

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">

      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasActiveTodos={hasActiveTodos}
          onInputChange={handleInputChange}
          inputValue={inputValue}
          onSubmit={handleSubmit}
          inputDisabled={isInputDisable}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isLoading={isLoaderVisible}
              onDeleteTodo={handleDeleteTodo}
              selectedTodoId={selectedTodoId}
              completedTodosId={completedTodosId}
              isClearCompleted={isClearCompletedClicked}
            />
            <Footer
              hasCompletedTodos={hasCompletedTodos}
              activeTodosCount={activeTodosCount}
              filter={filter}
              setFilter={setFilter}
              onDeleteCompletedTodos={handleDeleteComplitedTodos}
            />
          </>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {error && (
        <Error
          onClose={handleCloseError}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
