/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { OurErrors } from './components/OurErrors';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [notificationError, setNotificationError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    getTodos()
      .then(save => setTodos(save))
      .catch(() => setNotificationError('Unable to load todos'));
    setTimeout(() => {
      setNotificationError(null);
    }, 3000);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} setTodos={setTodos} />

        <TodoList
          visibleTodos={visibleTodos}
          setTodos={setTodos}
          todos={todos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            setTodos={setTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <OurErrors
        notificationError={notificationError}
        setNotificationError={setNotificationError}
      />
    </div>
  );
};
