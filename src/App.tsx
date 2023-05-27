/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, getTodos, deleteTodo } from './api/todos';
import { Footer } from './components/footer_filter/footer_filter';
import { Header } from './components/header_input/header_input';
import { Main } from './components/main_todos-list/main_todos-list';

const USER_ID = 10548;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('all');
  const [addTodo, setAddTodo] = useState('');
  const [removeTodo, setRemoveTodo] = useState(0);

  async function loadedTodos(f: (USER_ID: number) => Promise<Todo[]>) {
    const result = await f(USER_ID);

    setTodos(result);
  }

  useEffect(() => {
    loadedTodos(getTodos);
  }, [!addTodo]);

  const handleChangeInput = (event : React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleStatus = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    setStatus(event.currentTarget.type);
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.trim().length > 0) {
      setAddTodo(input);
    }

    setInput('');
  };

  useEffect(() => {
    createTodo(USER_ID, {
      title: addTodo,
      userId: USER_ID,
      completed: false,
    });

    setAddTodo('');
  }, [!addTodo]);

  const handleRemoveTodo = (id: number) => {
    setRemoveTodo(id);
    // eslint-disable-next-line no-console
    console.log(removeTodo);
    deleteTodo(removeTodo);
  };

  useEffect(() => {
  }, [removeTodo]);

  const visibleTodos = todos.filter((todo) => {
    switch (status) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return !!todo.completed;

      case 'all':
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const itemsLeftCount = visibleTodos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          countActiveTodo={itemsLeftCount}
          inputValue={input}
          onHandleInput={handleChangeInput}
          onHandleAddTodo={handleAddTodo}
        />

        <Main visibleTodos={visibleTodos} onRemoveTodo={handleRemoveTodo} />

        {/* Hide the footer if there are no todos */}
        <Footer
          selectedStatus={status}
          onHandleStatus={handleStatus}
          itemsLeftCount={itemsLeftCount}
        />
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div className="notification is-danger is-light has-text-weight-normal">
        <button type="button" className="delete" />

        {/* show only one message at a time */}
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
