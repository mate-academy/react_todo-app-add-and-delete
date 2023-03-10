/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { ErrorMsg } from './Components/ErrorMsg';
import { FilterFooter } from './Components/FilterFooter';
import { Header } from './Components/Header';
import { Todos } from './Components/Todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

import { createTodo, deleteTodos, getTodos } from './api/todos';

const USER_ID = 6502;

export const App: React.FC = () => {
  const [error] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodo, setFilterTodo] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getTodos(USER_ID).then((data) => setTodos(data));
    // .catch(() => setError('Unable to load todos'))
    // finally(() => setLoaded('Loading...'));
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    getTodos(USER_ID).then((data) => setFilterTodo(data));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDeleteTodo = (id: number) => {
    deleteTodos(id).then(() => {
      setFilterTodo(filterTodo.filter((todo) => todo.id !== id));
    });
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      title,
      id: filterTodo.length + 1,
      completed: false,
      userId: USER_ID,
    };

    createTodo(newTodo).then((data) => {
      setFilterTodo([...filterTodo, data]);
    });

    setTitle('');
  };

  const updateTodo = (updatedTodo: Todo) => {
    setFilterTodo(
      filterTodo.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTitle={handleTitleChange}
          title={title}
          handleAddTodo={handleAddTodo}
        />
        <Todos
          filterTodo={filterTodo}
          handleDeleteTodo={handleDeleteTodo}
          updateTodo={updateTodo}
        />

        {todos.length !== 0 && (
          <FilterFooter
            setFilterTodo={setFilterTodo}
            filterTodo={filterTodo}
            todos={todos}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {error && <ErrorMsg />}
    </div>
  );
};
