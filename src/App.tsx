import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoInfo } from './components/Todo/TodoInfo';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Errors/Errors';
import { Header } from './components/Header/Header';
import { TodoFilter } from './types/TodoFelter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setError={setError}
        />

        {filteredTodos.map(todo => (
          <TodoInfo
            todo={todo}
            setTodos={setTodos}
            setError={setError}
            key={todo.id}
          />
        ))}

        {tempTodo && (
          <TodoInfo
            todo={tempTodo}
            setTodos={setTodos}
            setError={setError}
            key={tempTodo.id}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            filter={filter}
            setFilter={setFilter}
            setError={setError}
          />
        )}
      </div>

      <Errors error={error} setError={setError} />
    </div>
  );
};
