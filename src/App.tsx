/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo, useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterBy } from './types/FilterBy';
import { warningTimer } from './utils/warningTimer';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';

const USER_ID = 6316;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [todosLoadingState, setTodosLoadingState] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const hasActiveTodos = todos.filter(todo => !todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  useEffect(() => {
    const onLoadGetTodos = async () => {
      try {
        const todosData = await getTodos(USER_ID);

        setTodos(todosData);
      } catch (error) {
        setHasError(true);
        setErrorMessage('Unable to load todos');
      }
    };

    onLoadGetTodos();
  }, []);

  useEffect(() => {
    if (hasError) {
      warningTimer(setHasError, false, 3000);
    }
  }, [hasError]);

  const handleAddTodo = async (title: string) => {
    if (!title) {
      setHasError(true);
      setErrorMessage('Title can\'t be empty');

      return;
    }

    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setIsInputDisabled(true);
      setTempTodo(newTodo);

      const addedTodo = await addTodo(USER_ID, newTodo);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }
  };

  const handleRemoveTodo = async (removingTodo: Todo) => {
    try {
      setTodosLoadingState(currentTodos => [...currentTodos, removingTodo]);
      await deleteTodo(USER_ID, removingTodo.id);

      setTodos(prevTodos => prevTodos
        .filter(todo => todo.id !== removingTodo.id));
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete a todo');
    } finally {
      setTodosLoadingState(currentTodos => currentTodos
        .filter(todo => todo.id !== removingTodo.id));
    }
  };

  const removeCompletedTodo = async () => {
    const compeletedTodos = todos.filter(todo => todo.completed);

    try {
      setTodosLoadingState(currentTodos => (
        [...currentTodos, ...compeletedTodos]
      ));
      await Promise.all(
        compeletedTodos.map(todo => deleteTodo(USER_ID, todo.id)),
      );

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete a todo');
    } finally {
      setTodosLoadingState(currentTodos => (
        currentTodos.filter(todo => !compeletedTodos
          .some(complTodo => complTodo.id === todo.id))
      ));
    }
  };

  const visibleTodos = useMemo(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.ACTIVE:
          return !todo.completed;
        case FilterBy.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });

    return filteredTodos;
  }, [todos, filterBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasActiveTodos={hasActiveTodos.length}
          isInputDisabled={isInputDisabled}
          onSubmitAddTodo={handleAddTodo}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          todosLoadingState={todosLoadingState}
          onClickRemoveTodo={handleRemoveTodo}
        />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            quantity={hasActiveTodos.length}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            hasCompletedTodos={hasCompletedTodos}
            onRemoveCompletedTodo={removeCompletedTodo}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      <Notification
        hasError={hasError}
        setHasError={setHasError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
