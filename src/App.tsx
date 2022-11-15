/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState, useMemo, ChangeEvent,
} from 'react';
import { AuthContext } from './components/Authorization/AuthContext';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [isSelected, setIsSelected] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [idsDeletedTodos, setIdsDeletedTodos] = useState<number[]>([]);

  const loadTodos = async () => {
    setHasError(false);

    try {
      const todosFromServer = user && await getTodos(user.id);

      if (todosFromServer) {
        setTodos(todosFromServer);
      }
    } catch (error) {
      setHasError(true);
      throw new Error('There are not todos for this user');
    }
  };

  const visibleTodos = useMemo(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterType) {
        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return todos;
      }
    });

    return filteredTodos;
  }, [todos, filterType]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  useEffect(() => {
    if (hasError) {
      setTimeout(() => {
        setHasError(false);
      }, 3000);
    }
  });

  const handleChangeFilterButton = (event:
  React.MouseEvent<HTMLAnchorElement>) => {
    setIsSelected(event.currentTarget.text);

    switch (event.currentTarget.text) {
      case 'Active':
        return setFilterType(FilterType.ACTIVE);

      case 'Completed':
        return setFilterType(FilterType.COMPLETED);

      default:
        return setFilterType(FilterType.ALL);
    }
  };

  const setCurrentTodos = (todo: Todo) => {
    if (!todos.some(todoFromServer => todo.id === todoFromServer.id)) {
      setTodos((prevTodos) => [...prevTodos, todo]);
    }
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.value);
  };

  const addNewTodo = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAdding(true);

    try {
      if (fieldValue.length === 0) {
        setHasError(true);
        setErrorText('Title cannot be empty');

        return;
      }

      if (user) {
        const newTodo = await addTodo(fieldValue, user.id);

        setCurrentTodos(newTodo);
      }
    } catch (error) {
      setHasError(true);
      setErrorText('Unable to add a todo');
      throw new Error(errorText);
    } finally {
      setFieldValue('');
      setIsLoading(false);
      setIsAdding(false);
    }
  };

  const deleteTodo = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    setActiveTodoId(+event.currentTarget.value);

    try {
      await removeTodo(+event.currentTarget.value);
      loadTodos();
    } catch (error) {
      setHasError(true);
      setErrorText('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCompletedTodos = async () => {
    setIsLoading(true);

    try {
      const completedTodos = todos.filter(todo => todo.completed);

      setIdsDeletedTodos(completedTodos.map(todo => todo.id));

      await Promise.all(completedTodos.map(async (todo) => {
        await removeTodo(todo.id);
      }));
      loadTodos();
    } catch (error) {
      setHasError(true);
      setErrorText('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputValue={fieldValue}
          newTodoField={newTodoField}
          isExist={todos.length > 0}
          inputDisabled={isAdding}
          handleInputChange={handleInputChange}
          handleAddTodo={addNewTodo}
        />

        <TodoList
          todos={visibleTodos}
          todoTitle={fieldValue}
          onDeleteTodo={deleteTodo}
          isAdding={isAdding}
          isLoading={isLoading}
          deletedTodoIds={idsDeletedTodos}
          deleteTodoId={activeTodoId}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            isSelected={isSelected}
            handleFilterButton={handleChangeFilterButton}
            clearCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        hideError={() => setHasError(false)}
        errorMessage={errorText}
      />
    </div>
  );
};
