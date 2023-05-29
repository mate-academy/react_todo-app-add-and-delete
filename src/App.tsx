/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';

import { Todo } from './types/Todo';
import { FilterBy } from './types/Filter';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { client } from './utils/fetchClient';
import { RequestTodo } from './types/RequestTodo';

const USER_ID = 10552;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(false);
  const [querySearch, setQuerySearch] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getTodosServer();
  }, []);

  const addTodo = async () => {
    const newTodo: RequestTodo = {
      userId: USER_ID,
      completed: false,
      title: querySearch,
    };

    try {
      await createTodo(USER_ID, newTodo);
      await getTodosServer();
    } catch {
      // ErrorMessage('Unable to add a todo');
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      await getTodosServer();
    } catch {
      // ErrorMessage('Unable to delete a todo');
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
      }
    } catch {
      // throw ErrorMessage('There is an issue.');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          querySearch={querySearch}
          setQuerySearch={setQuerySearch}
          handleAddTodo={addTodo}
        />

        <TodoList
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
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
          />

          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo
        </div>
      )}
    </div>
  );
};
