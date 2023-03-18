/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoNotification } from './components/TodoNotification';
import { getTodos, filterTodos, postTodo, deleteTodo } from './api/todos';
import { Error, Filter, Todo, ErrorType } from './types';

const initialError: Error = {
  state: false,
  type: ErrorType.None,
};

const USER_ID = 6657;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(Filter.All);
  const [error, setError] = useState(initialError);
  const [removedTodoId, setRemovedTodoId] = useState<number | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch(() => setError({
        state: true,
        type: ErrorType.Update,
      }));
  }, []);

  const addTodo = (title: string) => {
    if (!title) {
      setError({
        state: true,
        type: ErrorType.EmptyTitle,
      });

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    postTodo(USER_ID, {
      userId: USER_ID,
      title,
      completed: false,
    }).then(r => {
      setTodos(prev => (
        [
          ...prev as Todo [],
          r as Todo,
        ]
      ));
    })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const removeTodo = (id: number) => {
    setRemovedTodoId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(t => t.id !== id));
      })
      .catch(() => {
        setError({
          state: true,
          type: ErrorType.Delete,
        });
      })
      .finally(() => {
        setRemovedTodoId(null);
      });
  };

  const removeCompletedTodos = () => {
    const completed = todos.filter(todo => todo.completed);
    const uncompleted = todos.filter(todo => !todo.completed);

    completed.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(uncompleted);
        })
        .catch(() => {
          setError({
            state: true,
            type: ErrorType.Delete,
          });
        });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos(todos, filterType)}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              removedTodoId={removedTodoId}
            />
            <Footer
              todos={todos}
              setFilter={setFilterType}
              filter={filterType}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      {error.state && (
        <TodoNotification
          setError={setError}
          errorText={error.type}
        />
      )}
    </div>
  );
};
