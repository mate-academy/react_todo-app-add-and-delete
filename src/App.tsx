/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, deleteTodos } from './api/todos';
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
    const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(save => setTodos(save))
      .catch(() => {
        setNotificationError('Unable to load todos');
        setTimeout(() => setNotificationError(null), 3000);
      });
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

  const inputRef = React.useRef<HTMLInputElement>(null);

const onDelete = (todoId: number) => {
  setTodos(prevTodos =>
    prevTodos.map((todo: Todo) =>
      todo.id === todoId ? { ...todo, isDeleting: true } : todo
    )
  );

  deleteTodos(todoId)
  .then(() => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId))
    inputRef.current?.focus()
  })
  .catch(() => {
    setNotificationError('Unable to delete a todo');
    setTimeout(() => setNotificationError(null), 3000);
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, isDeleting: false } : todo
      )
    )
  })
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
        inputRef={inputRef}
        todos={todos}
        setTodos={setTodos}
        setNotificationError={setNotificationError}
        setTempTodo={setTempTodo}/>

        <TodoList
          onDelete={onDelete}
          tempTodo={tempTodo}
          visibleTodos={visibleTodos}
          setTodos={setTodos}
          todos={todos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            onDelete={onDelete}
            todos={todos}
            filter={filter}
            setFilter={setFilter}
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
