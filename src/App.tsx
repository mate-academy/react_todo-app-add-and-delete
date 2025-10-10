/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, deleteTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { OurErrors } from './components/OurErrors';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
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

  const inputRef = React.useRef<HTMLInputElement>(null);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onDelete = (todoId: number) => {
    setTodos(prevTodos =>
      prevTodos.map((todo: Todo) =>
        todo.id === todoId ? { ...todo, isDeleting: true } : todo,
      ),
    );

    deleteTodos(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        inputRef.current?.focus();
      })
      .catch(() => {
        setNotificationError('Unable to delete a todo');
        setTimeout(() => setNotificationError(null), 3000);
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? { ...todo, isDeleting: false } : todo,
          ),
        );
      });
  };

 const onDeleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => onDelete(todo.id));
  };
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          todos={todos}
          setTodos={setTodos}
          setNotificationError={setNotificationError}
          setTempTodo={setTempTodo}
        />
        <TodoList
          onDelete={onDelete}
          tempTodo={tempTodo}
          visibleTodos={visibleTodos}
          setTodos={setTodos}
          todos={todos}
        />
        {todos.length > 0 && (
          <Footer
            onDeleteCompleted={onDeleteCompleted}
            todos={todos}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>
      <OurErrors
        notificationError={notificationError}
        setNotificationError={setNotificationError}
      />
    </div>
  );
};
