import React, { useEffect } from 'react';
import { getTodos } from '../../api/todos';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoList } from '../TodoList/TodoList';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { ErrorNotification } from '../ErrorNotification/ErrorNotification';
import { Errors } from '../../enums/Errors';
import { useTodosContext } from '../../helpers/useTodoContext';
import { getErrors } from '../../helpers/getErorrs';

export const TodoApp: React.FC = () => {
  const { todos, setTodos, setErrorMessage, preparedTodos } = useTodosContext();

  useEffect(() => {
    setErrorMessage(null);
    getTodos()
      .then(setTodos)
      .catch(() => {
        getErrors(Errors.LoadTodos, setErrorMessage);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm />

        <TodoList todos={preparedTodos} />

        {todos.length > 0 && <TodoFooter />}
      </div>

      <ErrorNotification />
    </div>
  );
};
