import { useEffect } from 'react';

import { useTodosContext } from '../../hooks/useTodosContext';
import { getTodos } from '../../api/todos';
import { Errors } from '../../enums/Errors';
import { filterTodos } from '../../helpers/filterTodos';

import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { ErrorNotification } from '../ErrorNotification';

export const TodoApp = () => {
  const { todos, setTodos, filter, showError, setIsFocusedInput } =
    useTodosContext();

  const preparedTodos = filterTodos(todos, filter);

  useEffect(() => {
    setIsFocusedInput(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(Errors.LoadTodos);
      });
  }, [setTodos, showError, setIsFocusedInput]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <>
            <TodoList todos={preparedTodos} />
            <Footer />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
