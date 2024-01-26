import React, { useContext, useEffect } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer/Footer';
import { Notification } from './components/Notification';

import { USER_ID } from './constants/user';
import { Todo } from './types/Todo';
import { DispatchContext, StateContext } from './State/State';
import { Filter } from './types/Filter';
import { getTodos } from './api/todos';

function getPreparedTodos(todos: Todo[], filterBy: Filter): Todo[] {
  switch (filterBy) {
    case Filter.active:
      return todos.filter(todo => !todo.completed);

    case Filter.completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, filterBy } = useContext(StateContext);

  const preparedTodos = getPreparedTodos(todos, filterBy);

  function loadTodoFromApi() {
    getTodos(USER_ID)
      .then(res => dispatch({
        type: 'saveTodos',
        payload: res,
      }))
      .catch(() => dispatch({
        type: 'setError',
        payload: 'Unable to load todos',
      }));
  }

  useEffect(loadTodoFromApi, [dispatch]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <main>
          <TodoList todos={preparedTodos} />
        </main>

        {!!todos.length && <Footer />}
      </div>

      <Notification />
    </div>
  );
};
