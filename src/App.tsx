/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  createTodo,
  deleteTodo,
  toogleTodo,
  updateTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Notification } from './components/Notifications/Notifications';
import { warningTimer } from './utils/warningTimer';

const USER_ID = 6336;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosInProcessed, setTodosInProcessed] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectFilter, setSelectFilter] = useState('all');

  const itemsLeft = todos.filter(todo => todo.completed === false);

  const eventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setQuery(value);
  };

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query) {
      setHasError(true);
      setErrorMessage('Title can\'t be empty');
      warningTimer(setHasError, false, 3000);

      return;
    }

    const newTodo = {
      id: 0,
      title: query,
      userId: USER_ID,
      completed: false,
    };

    try {
      const addedTodo = await createTodo(USER_ID, newTodo);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
      setQuery('');
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to add a todo');
    }
  };

  const onRemoveTodo = async (removeTodo: Todo) => {
    try {
      setTodosInProcessed(currentTodos => [...currentTodos, removeTodo]);
      await deleteTodo(USER_ID, removeTodo.id);

      setTodos(prevTodos => prevTodos
        .filter(todo => todo.id !== removeTodo.id));
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete a todo');
      warningTimer(setHasError, false, 3000);
    }
  };

  const allCompleted = todos.filter(todo => todo.completed === true);

  const isAllCompleted = allCompleted.length === todos.length;

  const clearCompleted = () => {
    allCompleted.forEach(todo => deleteTodo(USER_ID, todo.id));
    setTodos(prevTodos => prevTodos.filter(todo => todo.completed === false));
  };

  const onToogleTodo = async (todoTogle: Todo) => {
    try {
      const todoChangeStatus = await toogleTodo(USER_ID, todoTogle.id, !todoTogle.completed);

      setTodos(currentTodos => currentTodos.map(todo => {
        return todo.id === todoChangeStatus.id
          ? todoChangeStatus
          : todo;
      }));
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to change completed');
      warningTimer(setHasError, false, 3000);
    }
  };

  const toogleAllTodo = () => {
    if (isAllCompleted) {
      todos.map(async (todoToogle) => {
        try {
          const todoChangeStatus = await toogleTodo(USER_ID, todoToogle.id, false);

          setTodos(currentTodos => currentTodos.map(todo => {
            return todo.id === todoChangeStatus.id
              ? todoChangeStatus
              : todo;
          }));
        } catch (error) {
          setHasError(true);
          setErrorMessage('Unable to change completed');
          warningTimer(setHasError, false, 3000);
        }
      });
    } else {
      todos.map(async todoToogle => {
        try {
          const todoChangeStatus = await toogleTodo(USER_ID, todoToogle.id, true);

          setTodos(currentTodos => currentTodos.map(todo => {
            return todo.id === todoChangeStatus.id
              ? todoChangeStatus
              : todo;
          }));
        } catch (error) {
          setHasError(true);
          setErrorMessage('Unable to change completed');
          warningTimer(setHasError, false, 3000);
        }
      });
    }
  };

  const handleUpdateTodo = useCallback(async (todoToUpdate: Todo) => {
    try {
      setTodosInProcessed(currentTodos => [...currentTodos, todoToUpdate]);

      const updatedTodo = await updateTodo(USER_ID, todoToUpdate);

      setTodos(currentTodos => currentTodos.map(todo => {
        return todo.id === updatedTodo.id
          ? updatedTodo
          : todo;
      }));
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete a todo');
      warningTimer(setHasError, false, 3000);
    }
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      const completedTodo = todo.completed;

      switch (selectFilter) {
        case 'all':
          return todo;
        case 'active':
          return !completedTodo;
        case 'completed':
          return completedTodo;
        default:
          return false;
      }
    });
  }, [todos, query, selectFilter]);

  useEffect(() => {
    const onLoadGetTodos = async () => {
      try {
        const todosData = await getTodos(USER_ID);

        setTodos(todosData);
      } catch (error) {
        setHasError(true);
        setErrorMessage('Unable to load todos');
        warningTimer(setHasError, false, 3000);
      }
    };

    onLoadGetTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          onToogleAllTodo={toogleAllTodo}
          handleSubmit={handleAddTodo}
          query={query}
          onEventChange={eventChange}
        />

        <TodoList
          todos={visibleTodos}
          onRemoveTodo={onRemoveTodo}
          onToogleTodo={onToogleTodo}
          todosLoadingState={todosInProcessed}
          onHandleUpdate={handleUpdateTodo}
        />

        {todos.length !== 0 ? (
          <Footer
            itemsLeft={itemsLeft}
            selectFilter={selectFilter}
            setSelectFilter={setSelectFilter}
            allCompleted={allCompleted}
            clearCompleted={clearCompleted}
          />
        ) : ''}
      </div>

      <Notification
        hasError={hasError}
        setHasError={setHasError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
