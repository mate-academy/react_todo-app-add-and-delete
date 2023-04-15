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
  const [errorType, setErrorType] = useState<string>('');
  const [sortBy, setSortBy] = useState<Sort>(Sort.all);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState([0]);
  const isError = !!errorType || errorType !== '';

  async function fetchTodos() {
    setErrorType('');
    try {
      const todosData = await getTodos(USER_ID);

      setTodos(todosData);
    } catch {
      setErrorType('Error loading data');
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const sortedTodos = useSort(todos, sortBy);

  const addTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorType('Title can\'t be empty');

      return;
    }

    setIsInputDisabled(true);

    try {
      const newTodo = await createTodo(USER_ID, {
        title,
        userId: USER_ID,
        completed: true,
      });

      setTempTodo({ ...newTodo, id: 0 });

      setTodos([...todos, newTodo]);
      setTempTodo(null);
    } catch {
      setErrorType('Unable to add a todo');
    } finally {
      setIsInputDisabled(false);
      // setTempTodo(null);
    }
  };

  const removeTodo = async (selectedTodoId: number) => {
    setErrorType('');

    try {
      setLoadingTodo(prevTodo => [...prevTodo, selectedTodoId]);
      await deleteTodo(selectedTodoId);
      setTodos(todos.filter(elem => elem.id !== selectedTodoId));
    } catch {
      setErrorType('Unable to delete a todo');
    } finally {
      setLoadingTodo([0]);
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
        {sortedTodos.length > 0 && (
          <TodoList
            todos={sortedTodos}
            removeTodo={removeTodo}
            tempTodo={tempTodo}
            loadingTodo={loadingTodo}
          />
        )}
        <Footer
          todos={todos}
          setSort={setSortBy}
          sort={sortBy}
          handleRemoveCompletedTodos={handleRemoveCompletedTodos}
        />
      </div>

      {isError && (
        <Error
          isError={isError}
          errorType={errorType}
          setErrorType={setErrorType}
        />
      )}
    </div>
  );
};
