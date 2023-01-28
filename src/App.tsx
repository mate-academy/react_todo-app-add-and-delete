/* eslint-disable jsx-a11y/control-has-associated-label */
// eslint-disable-next-line object-curly-newline
import React, { useEffect, useRef, useState } from 'react';
import { getTodos, createTodo } from './api/todos';
import { filterTotos } from './api/filter';
import { useAuthContext } from './components/Auth/useAuthContext';
import {
  ErrorNotification,
  Header,
  TodoList,
  Footer,
} from './components';
import { Todo, Filter, Error } from './types';

export const App: React.FC = () => {
  const user = useAuthContext();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [typeFilter, setTypeFilter] = useState(Filter.all);
  const [error, setError] = useState('');
  const [isHiddenErrorNote, setIsHiddenErrorNote] = useState(true);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then((loadedTodos) => setTodos(loadedTodos))
        .catch(() => {
          setError(Error.loading);
          setIsHiddenErrorNote(false);
          setTimeout(() => {
            setIsHiddenErrorNote(true);
          }, 3000);
        });
    }
  }, []);

  const handleAddToto = (titleTodo: string) => {
    if (!user) {
      return;
    }

    const todo: Todo = {
      title: titleTodo,
      userId: user?.id,
      completed: false,
      id: user?.id,
    };

    createTodo(todo)
      .then((res) => setTodos((prevTodos) => [...prevTodos, res]))
      .catch(() => {
        setError(Error.add);
        setIsHiddenErrorNote(false);
        setTimeout(() => {
          setIsHiddenErrorNote(true);
        }, 3000);
      })
      .finally(() => setTitle(''));
  };

  const visibleTodos = filterTotos(todos, typeFilter);
  const itemsLeftCount = filterTotos(todos, Filter.active).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          title={title}
          setTitle={setTitle}
          handleAddToto={handleAddToto}
        />
        <TodoList todos={visibleTodos} />
        {!!todos.length && (
          <Footer
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            itemsLeftCount={itemsLeftCount}
          />
        )}
      </div>
      <ErrorNotification
        isHidden={isHiddenErrorNote}
        setIsHidden={setIsHiddenErrorNote}
        error={error}
      />
    </div>
  );
};
