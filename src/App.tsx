/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodoItems,
} from './api/todos';
import { Error } from './components/Error';
import { ErrorType } from './types/ErrorType';
import { Status } from './types/Status';

const USER_ID = 11966;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Status>(Status.All);

  const clearCompletedTodos = () => {
    const updatedTodos = todos.filter(todo => !todo.completed);

    setTodos(updatedTodos);
  };

  const clearError = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(clearError, [error]);

  const loadTodos = () => {
    setError(null);
    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch(() => {
        setError(ErrorType.LoadError);
      });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = () => {
    setTempTodo({
      userId: USER_ID,
      title: query.trim(),
      completed: false,
      id: 0,
    });

    createTodo({ userId: USER_ID, title: query.trim(), completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setError(ErrorType.AddError);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodoItem = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorType.DeleteError);
      });
  };

  const handleToggleAll = async () => {
    try {
      const newTodos = todos.map(async (todo) => {
        const completedValue = todos.some(item => !item.completed);
        const updatedTodo = { ...todo, completed: completedValue };

        await updateTodoItems(updatedTodo);

        return updatedTodo;
      });

      const updatedTodos = await Promise.all(newTodos);

      setTodos(updatedTodos);
    } catch (errorN) {
      setError(ErrorType.UpdateError);
    }
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const handlerFilterChange = (filterValue: Status) => {
    setFilter(filterValue);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          onSubmit={addTodo}
          setError={setError}
          USER_ID={USER_ID}
          query={query}
          setQuery={setQuery}
          tempTodo={tempTodo}
          handleToggleAll={handleToggleAll}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodoItem}
          setTodos={setTodos}
          USER_ID={USER_ID}
        />

        <Footer
          todos={todos}
          filter={filter}
          filterChange={handlerFilterChange}
          setTodos={setTodos}
          clearCompletedTodos={clearCompletedTodos}
          setError={setError}
        />

      </div>
      <Error error={error} />

    </div>
  );
};
