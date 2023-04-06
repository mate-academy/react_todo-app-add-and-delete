import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { useSort } from './utils/useSort';
import { Sort } from './types/Sort';

const USER_ID = 6771;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<string>('');
  const [sortBy, setSortBy] = useState<Sort>(Sort.all);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  async function fetchTodos() {
    setIsError(false);
    try {
      const todosData = await getTodos(USER_ID);

      setTodos(todosData);
    } catch {
      setIsError(true);
      setErrorType('Error loading data');
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const sortedTodos = useSort(todos, sortBy);

  const addTodo = async (title: string) => {
    if (!title.trim()) {
      setIsError(true);
      setErrorType('Title can\'t be empty');

      return;
    }

    setIsLoading(true);
    setIsError(false);
    setIsInputDisabled(true);

    try {
      const newTodo = await createTodo(USER_ID, {
        title,
        userId: USER_ID,
        completed: false,
      });

      setTempTodo({ ...newTodo, id: 0 });

      setTodos([...todos, newTodo]);
    } catch {
      setIsError(true);
      setErrorType('Unable to add a todo');
    } finally {
      setIsLoading(false);
      setIsInputDisabled(false);
      setTempTodo(null);
    }
  };

  const removeTodo = async (selectedTodoId: number) => {
    setIsError(false);
    setIsLoading(true);

    try {
      await deleteTodo(selectedTodoId);
      setTodos(todos.filter(elem => elem.id !== selectedTodoId));
      setIsLoading(false);
    } catch {
      setIsError(true);
      setErrorType('Unable to delete a todo');
      setIsLoading(false);
    }
  };

  const handleRemoveCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const activeTodos = todos.filter(todo => !todo.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
    setTodos(activeTodos);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          isInputDisabled={isInputDisabled}
        />
        {sortedTodos.length > 0
        && (
          <TodoList
            todos={sortedTodos}
            removeTodo={removeTodo}
            isLoading={isLoading}
            tempTodo={tempTodo}
          />
        )}
        <Footer
          todos={todos}
          setSort={setSortBy}
          sort={sortBy}
          handleRemoveCompletedTodos={handleRemoveCompletedTodos}
        />
      </div>

      {isError
        && (
          <Error
            setIsError={setIsError}
            isError={isError}
            errorType={errorType}
          />
        )}
    </div>
  );
};
