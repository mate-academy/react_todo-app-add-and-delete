import React, { FormEvent, useEffect } from 'react';
import { getTodos } from '../../api/todos';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoList } from '../TodoList/TodoList';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { ErrorNotification } from '../ErrorNotification/ErrorNotification';
import { Errors } from '../../enums/Errors';
import { useTodosContext } from '../../helpers/useTodoContext';

export const TodoApp: React.FC = () => {
  const { todos, setTodos, setErrorMessage, preparedTodos } = useTodosContext();

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const showError = (error: Errors) => {
    setErrorMessage(error);

    setTimeout(() => {
      clearErrorMessage();
    }, 3000);
  };

  useEffect(() => {
    clearErrorMessage();
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(Errors.LoadTodos);
      });
  }, []);

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm addTodo={addTodo} />

        <TodoList todos={preparedTodos} />

        {todos.length > 0 && <TodoFooter />}
      </div>

      <ErrorNotification clearErrorMessage={clearErrorMessage} />
    </div>
  );
};
