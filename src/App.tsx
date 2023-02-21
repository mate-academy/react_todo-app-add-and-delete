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
import { FilterTodos } from './types/FIlterTodos';

const USER_ID = 6336;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [creatingTodo, setCreatingTodo] = useState<Todo | null>(null);
  const [todosInProcessed, setTodosInProcessed] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectFilter, setSelectFilter] = useState<FilterTodos>(FilterTodos.ALL);

  const activeTodos = todos.filter(({ completed }) => !completed);

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setTitle(value);
  };

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim().length) {
      setErrorMessage('Title can\'t be empty');
      warningTimer(setErrorMessage, '', 3000);
      setTitle('');

      return;
    }

    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setCreatingTodo(newTodo);

      const addedTodo = await createTodo(USER_ID, newTodo);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      warningTimer(setErrorMessage, '', 3000);
    } finally {
      setCreatingTodo(null);
      setTitle('');
    }
  };

  const onRemoveTodo = async (removeTodo: Todo) => {
    try {
      setTodosInProcessed(currentTodos => [...currentTodos, removeTodo]);
      await deleteTodo(USER_ID, removeTodo.id);

      setTodos(prevTodos => prevTodos
        .filter(({ id }) => id !== removeTodo.id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      warningTimer(setErrorMessage, '', 3000);
    } finally {
      setTodosInProcessed(currentTodos => currentTodos
        .filter(({ id }) => id !== removeTodo.id));
    }
  };

  const allCompleted = todos.filter(({ completed }) => completed);

  const isAllCompleted = allCompleted.length === todos.length;

  const clearCompleted = useCallback(() => {
    allCompleted.forEach(todo => deleteTodo(USER_ID, todo.id));
    setTodos(prevTodos => prevTodos.filter(({ completed }) => !completed));
  }, [todos]);

  const changeTodos = (todoChange: Todo) => {
    setTodos(currentTodos => currentTodos.map(todo => {
      return todo.id === todoChange.id
        ? todoChange
        : todo;
    }));
  };

  const onToogleTodo = async (todoTogle: Todo) => {
    try {
      setTodosInProcessed(currentTodos => [...currentTodos, todoTogle]);
      const todoChangeStatus = await toogleTodo(USER_ID, todoTogle.id, !todoTogle.completed);

      changeTodos(todoChangeStatus);
    } catch (error) {
      setErrorMessage('Unable to change completed');
      warningTimer(setErrorMessage, '', 3000);
    } finally {
      setTodosInProcessed(currentTodos => currentTodos
        .filter(({ id }) => id !== todoTogle.id));
    }
  };

  const toogleAllTodo = () => {
    const toogleAll = (isCheck: boolean) => {
      todos.map(async (todoToogle) => {
        try {
          setTodosInProcessed(currentTodos => [...currentTodos, todoToogle]);
          const todoChangeStatus = await toogleTodo(USER_ID, todoToogle.id, isCheck);

          changeTodos(todoChangeStatus);
        } catch (error) {
          setErrorMessage('Unable to change completed');
          warningTimer(setErrorMessage, '', 3000);
        } finally {
          setTodosInProcessed(currentTodos => currentTodos
            .filter(({ id }) => id !== todoToogle.id));
        }
      });
    };

    if (isAllCompleted) {
      toogleAll(false);
    } else {
      toogleAll(true);
    }
  };

  const handleUpdateTodo = useCallback(async (todoToUpdate: Todo) => {
    try {
      setTodosInProcessed(currentTodos => [...currentTodos, todoToUpdate]);

      const updatedTodo = await updateTodo(USER_ID, todoToUpdate);

      changeTodos(updatedTodo);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      warningTimer(setErrorMessage, '', 3000);
    } finally {
      setTodosInProcessed(currentTodos => (
        currentTodos.filter(({ id }) => id !== todoToUpdate.id)
      ));
    }
  }, []);

  const filterTodosCompleted = () => {
    return todos.filter(({ completed }) => completed);
  };

  const filterTodosActive = () => {
    return todos.filter(({ completed }) => !completed);
  };

  const getFilteredTodos = useCallback((
    todosByFilter: Todo[],
    filterTodos: FilterTodos,
  ) => {
    switch (filterTodos) {
      case FilterTodos.ALL:
        return todosByFilter;
      case FilterTodos.ACTIVE:
        return filterTodosActive();
      case FilterTodos.COMPLETED:
        return filterTodosCompleted();
      default:
        return todosByFilter;
    }
  }, [selectFilter]);

  const visibleTodos = useMemo(() => (
    getFilteredTodos(todos, selectFilter)
  ), [todos, selectFilter]);

  useEffect(() => {
    const onLoadGetTodos = async () => {
      try {
        const todosData = await getTodos(USER_ID);

        setTodos(todosData);
      } catch (error) {
        setErrorMessage('Unable to load todos');
        warningTimer(setErrorMessage, '', 3000);
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
          onSubmit={handleAddTodo}
          title={title}
          onEventChange={handleEventChange}
        />

        <TodoList
          todos={visibleTodos}
          creatingTodo={creatingTodo}
          onRemoveTodo={onRemoveTodo}
          onToogleTodo={onToogleTodo}
          todosLoadingState={todosInProcessed}
          onHandleUpdate={handleUpdateTodo}
        />

        {todos.length !== 0 ? (
          <Footer
            itemsLeft={activeTodos}
            selectFilter={selectFilter}
            setSelectFilter={setSelectFilter}
            allCompleted={allCompleted}
            onClearCompleted={clearCompleted}
          />
        ) : ''}
      </div>

      <Notification
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
