/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Notification } from './components/Notification/Notification';

import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { client } from './utils/fetchClient';
import { RequestTodos } from './types/RequestTodos';

const USER_ID = 10630;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.ACTIVE:
          return !todo.completed;
        case FilterBy.COMPLETED:
          return todo.completed;
        case FilterBy.ALL:
          return true;
        default:
          return todo;
      }
    });
  }, [filterBy, todos]);

  const getTodosServer = async () => {
    try {
      const arrayTodos = await getTodos(USER_ID);

      setTodos(arrayTodos);
      setError(false);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    getTodosServer();
  }, []);

  const addTodo = async () => {
    const newTodo: RequestTodos = {
      userId: USER_ID,
      completed: false,
      title: search,
    };

    await createTodo(USER_ID, newTodo);
    await getTodosServer();
    setError(false);
    setErrorMessage('');
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      await getTodosServer();
      setError(false);
      setErrorMessage('');
    } catch {
      setError(true);
      setErrorMessage('Unable to delete a todo');
    }
  };

  const deleteTodoCompleted = async () => {
    todos.filter(todo => todo.completed)
      .map(todo => handleDeleteTodo(todo.id));
  };

  const onUpdate = async (id: number) => {
    const updatedTodo = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;
    });

    setTodos(updatedTodo);
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);

      if (todoToUpdate) {
        await client.patch(`/todos/${id}`, {
          completed: !todoToUpdate.completed,
          title: todoToUpdate.title,
          userId: USER_ID,
          id,
        });

        setError(false);
        setErrorMessage('');
      }
    } catch {
      setError(true);
      setErrorMessage('Unable to update a todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          search={search}
          setSearch={setSearch}
          handleAddTodo={addTodo}
          setError={setError}
          setErrorMessage={setErrorMessage}
        />

        <Main
          todos={filteredTodos}
          deleteTodo={handleDeleteTodo}
          onUpdate={onUpdate}
        />
        {todos.length > 0 && (
          <Footer
            todosShow={filteredTodos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteTodoCompleted={deleteTodoCompleted}
          />
        )}
      </div>

      {error && (
        <Notification
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
