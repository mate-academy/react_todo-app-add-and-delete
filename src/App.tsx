import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoFilter } from './components/TodoFilter';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { ErrorMessages } from './components/ErrorMessages';
import { FilterType } from './types/FilterTypes';

const USER_ID = 6996;

const getFilteredTodo = (
  todos: Todo[],
  sortType: FilterType,
): Todo[] => {
  let filteredTodo: Todo[] = [...todos];

  if (sortType === FilterType.ACTIVE) {
    filteredTodo = todos.filter(todo => !todo.completed);
  }

  if (sortType === FilterType.COMPLETED) {
    filteredTodo = todos.filter(todo => todo.completed);
  }

  return filteredTodo;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLodingPage, setIsLoadingPage] = useState(false);
  const [selectedType, setSelectedType] = useState(FilterType.ALL);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [disabledInput, setdisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [hasLoadedTodos, setHasLoadedTodos] = useState<number[]>([]);

  const getError = (value: string) => {
    setShowError(true);
    setErrorMessage(value);
    setTimeout(() => (
      setShowError(false)
    ), 3000);
  };

  const getLoadedTodos = async () => {
    setIsLoadingPage(true);
    try {
      const loadTodos = await getTodos(USER_ID);

      setTodos(loadTodos);
    } catch {
      getError('Unable to load a todo');
    } finally {
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    getLoadedTodos();
  }, []);

  const getCreateTodos = async (todo: Omit<Todo, 'id'>) => {
    setdisabledInput(true);
    try {
      const todoToServer = await postTodo(USER_ID, todo);

      setTodos([todoToServer]);
    } catch (error) {
      getError('Unable to add a todo');
    } finally {
      setdisabledInput(false);
      setTempTodo(null);
    }
  };

  const handleAddTodos = (title: string) => {
    setShowError(false);

    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    getCreateTodos(newTodo);
    setTempTodo({ ...newTodo, id: 0 });
  };

  const removeTodo = async (todoId: number) => {
    setHasLoadedTodos(prevTodo => [...prevTodo, todoId]);
    try {
      await deleteTodo(USER_ID, todoId);
      setTodos(prevTodo => prevTodo.filter(({ id }) => id !== todoId));
    } catch {
      getError('Unable to delete a todo');
    } finally {
      setHasLoadedTodos(prevTodo => prevTodo.filter(id => id !== todoId));
    }
  };

  const handleRemoveTodo = (id: number) => {
    setShowError(false);
    removeTodo(id);
  };

  const handleClearCompleted = () => {
    setShowError(false);
    todos.forEach(({ completed, id }) => {
      if (completed) {
        removeTodo(id);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const getACompletedTodo = todos.filter(todo => !todo.completed);
  const getActiveTodo = getACompletedTodo.length !== 0;

  const visibleTodos = getFilteredTodo(todos, selectedType);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput
          getActiveTodo={getActiveTodo}
          disabledInput={disabledInput}
          onGetCreatTodos={handleAddTodos}
        />

        {todos && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            hasLoadedTodos={hasLoadedTodos}
            handleRemoveTodo={handleRemoveTodo}
          />
        )}

        {isLodingPage}

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <TodoFilter
              todos={visibleTodos}
              selectedType={selectedType}
              onSelectedType={setSelectedType}
              onClearCompleted={handleClearCompleted}
            />
          </footer>
        )}
      </div>

      <ErrorMessages
        errorMessage={errorMessage}
        showError={showError}
        onShowError={setShowError}
      />
    </div>
  );
};
