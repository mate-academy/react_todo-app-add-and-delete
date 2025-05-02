/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './component/Header/Header';
import { TodoList } from './component/TodoList/TodoList';
import { Footer } from './component/Footer/Footer';
import { TodoItem } from './component/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('all');
  const [todo, setTodo] = useState<Todo>();

  useEffect(() => {
    // setLoading(true);
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        // setLoading(false);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    let fltrdTodos: Todo[] | undefined = todos;

    switch (status) {
      case 'all':
        fltrdTodos = todos;
        break;
      case 'active':
        fltrdTodos = todos?.filter(td => td.completed === false);
        break;
      case 'completed':
        fltrdTodos = todos?.filter(td => td.completed === true);
        break;
    }

    return fltrdTodos;
  }, [status, todos]);

  const handleClick = (event: React.MouseEvent) => {
    setStatus(event.currentTarget.innerHTML.toLowerCase());
  };

  //CHANGE IF
  if (error) {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  function addTodo({ userId, title, completed }: Todo) {
    setLoading([userId]);

    return todosService
      .createTodo({ userId, title, completed })
      .then(newTodo => {
        //fix current Todos
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(e => {
        setError('Unable to add a todo');
        throw e;
      })
      .finally(() => {
        setLoading([]);
        setTodo(undefined);
      });
  }

  function deleteTodo(todoId: number[]) {
    setLoading(todoId);
    setTodos(currentTodo => currentTodo?.filter(td => !todoId.includes(td.id)));
    const todoToDelete = [];

    for (const trrr of todoId) {
      todoToDelete.push(todosService.deleteTodos(trrr));
    }

    return Promise.all(todoToDelete)
      .catch(e => {
        setTodos(todos);
        setError('Unable to delete a todo');
        throw e;
      })
      .finally(() => setLoading([]));
  }

  // function updateTodo(updateTodo: Todo) {
  //   setTodos(currentTodo => {
  //     const newTodo = [...currentTodo];
  //     const index = newTodo.findIndex(td => td.id === updateTodo.id);

  //     newTodo.splice(index, 1, updateTodo);

  //     return newTodo;
  //   });
  // }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setError={setError}
          setTodo={setTodo}
          onSubmit={addTodo}
        />

        {todos && todos.length > 0 && (
          <TodoList todos={filteredTodos} removeTodo={deleteTodo} />
        )}
        {todo && (
          <TodoItem todo={todo} removeTodo={deleteTodo} loading={loading[0]} />
        )}

        {todos && todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            handleClick={handleClick}
            deleteTodos={deleteTodo}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {/* move this component to ErrorComponent */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setError('');
          }}
        />
        {/* show only one message at a time */}
        {error}
        {/* <br />
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
