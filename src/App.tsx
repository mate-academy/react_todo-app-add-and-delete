/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Header } from './Components/Header';
import { Main } from './Components/Main';
import { Footer } from './Components/Footer';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';

const USER_ID = 10307;

export const App: React.FC = () => {
  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState<Errors | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState<number[]>([]);

  const addTodo = (todoTitle: string) => {
    const todo: Todo = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    });

    createTodo(todo)
      .then((value) => {
        setTodos([...todos, value]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrors({ posting: true });
        setTempTodo(null);
      });
  };

  const removeTodo = (id: number) => {
    setIsDeleting([id]);
    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
        setIsDeleting([]);
      })
      .catch(() => {
        setErrors({ deleting: true });
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosList) => {
        setTodos(todosList);
      })
      .catch(() => {
        setErrors({ loading: true });
      });
  }, []);

  const filterTodos = todos.filter((todo) => {
    switch (filter) {
      case Filter.All:
        return todo;

      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header addTodo={addTodo} setErrors={setErrors} tempTodo={tempTodo} />

        {todos.length > 0 && (
          <Main
            filteredTodos={filterTodos}
            tempTodo={tempTodo}
            removeTodo={removeTodo}
            isDeleting={isDeleting}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            filter={filter}
            filteredTodos={filterTodos}
            setTodos={setTodos}
            setFilter={setFilter}
            todos={todos}
            setErrors={setErrors}
            setDeleting={setIsDeleting}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {errors && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            onClick={() => setErrors(null)}
            className="delete"
          />
          {/* show only one message at a time */}
          {errors?.noTitle && 'Title cannot be empty'}
          {errors?.loading && 'Unable to load todos'}
          {errors?.posting && 'Unable to add a todo'}
          {errors?.editing && 'Unable to update a todo'}
          {errors?.deleting && 'Unable to delete a todo'}
        </div>
      )}
    </div>
  );
};
