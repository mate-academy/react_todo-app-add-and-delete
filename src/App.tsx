/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getpreparedTodos } from './utils/PreparedTodos';
import { TodosFilter } from './types/TodoFilter';
import { addTodos, deleteTodos, getTodos } from './api.ts/todos';
import { TodoApp } from './components/TodoFilter/TodoApp';
import { TodoFilter } from './components/TodoApp/TodoFilter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

const USER_ID = 11528;

export const App: React.FC = () => {
  const [todos, setTodo] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodosFilter>(TodosFilter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const activeTodosCount = todos
    .filter(({ completed }) => completed === false).length;

  const completedTodosCount = todos
    .filter(({ completed }) => completed === true).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodo)
      .catch((error) => {
        setErrorMessage('Unable to load todos');
        // eslint-disable-next-line no-console
        console.warn(error);
      });
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 4000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  function handleAddTodos({ title, completed, userId }: Todo) {
    setIsLoading(true);
    const addNewTodo = {
      id: 0,
      userId,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(addNewTodo);
    if (title.trim() !== '') {
      addTodos({ title, completed, userId })
        .then((newTodo) => {
          setTodo((currentTodo) => [...currentTodo, newTodo]);
          setTempTodo(null);
          setIsLoading(false);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
        });
    } else {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }

  function handleDelete(todoId: number) {
    setIsModalVisible(true);
    deleteTodos(todoId)
      .then(() => {
        setTodo(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        setErrorMessage('Unable to delete todo');
        console.warn(error);
      });
  }

  const filteredTodos = useMemo((
  ) => getpreparedTodos(todos, filter), [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeTodosCount={activeTodosCount}
          // eslint-disable-next-line react/jsx-no-bind
          onSubmit={handleAddTodos}
          todo={filteredTodos.length > 0 ? filteredTodos[0] : null}
          userId={USER_ID}
          tempTodo={tempTodo}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoApp
                todo={todo}
                key={todo.id}
                // eslint-disable-next-line react/jsx-no-bind
                onDelete={handleDelete}
                isModalVisible={isModalVisible}
              />
            ))
          ) : (
            <p>No todos to display.</p>
          )}
        </section>

        {todos.length !== 0 && (
          <TodoFilter
            filter={filter}
            setFilter={setFilter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}

      />
    </div>
  );
};

// {/* <section className="section container">
//       <p className="title is-4">
//         Copy all you need from the prev task:
//         <br />
//         <a href="https://github.com/mate-academy/react_todo-app-loading-todos#react-todo-app-load-todos">React Todo App - Load Todos</a>
//       </p>

//       <p className="subtitle">Styles are already copied</p>
//     </section> */}
