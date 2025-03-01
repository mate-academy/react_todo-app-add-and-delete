/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './components/Error/Error';
import { Footer } from './components/Footer/Footer';
import { Todos } from './components/Todos/Todos';
import { AddTodos } from './components/AddToDo/AddToDo';
import { DoAllTodosComplete } from './components/DoUnDoAll/DoUnDoAll';
import { FakeToDo } from './types/fakeTodo';
import { TodoItem } from './components/TodoItem/TodoItem';
import { handleFiltering } from './utils/handleFiltering';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMesage, setErrorMesage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [fakeTodo, setFakeTodo] = useState<FakeToDo | null>(null);
  const [loader, setLoader] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState(Status.All);

  useEffect(() => {
    setTimeout(() => {
      getTodos()
        .then(setTodos)
        .catch(() => {
          setErrorMesage('Unable to load todos');
          setTimeout(() => {
            setErrorMesage('');
          }, 300);
        });
    }, 300);
  }, []);

  const handleAutofocus = (isEnabled: boolean) => {
    if (!isEnabled) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }

    setDisabled(isEnabled);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = handleFiltering(activeFilter, todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <DoAllTodosComplete todos={todos} setTodos={setTodos} />

          <AddTodos
            inputRef={inputRef}
            setErrorMesage={setErrorMesage}
            setTodos={setTodos}
            disabled={disabled}
            handleAutofocus={handleAutofocus}
            setFakeTodo={setFakeTodo}
            setLoader={setLoader}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => {
            return (
              <Todos
                key={todo.id}
                todo={todo}
                setTodos={setTodos}
                setErrorMesage={setErrorMesage}
                handleAutofocus={handleAutofocus}
                loader={loader}
                setLoader={setLoader}
              />
            );
          })}
          {fakeTodo && (
            <TodoItem title={fakeTodo.title} id={fakeTodo.id} loader={loader} />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            activeFilter={activeFilter}
            setTodos={setTodos}
            todos={todos}
            setActiveFilter={setActiveFilter}
            handleAutofocus={handleAutofocus}
            setErrorMesage={setErrorMesage}
          />
        )}
      </div>

      <Error setErrorMesage={setErrorMesage} errorMesage={errorMesage} />
    </div>
  );
};
