/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import * as todoService from './api/todos';
import { Error } from './components/Error/Error';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 11850;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hiddenClass, setHiddenClass] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setHiddenClass(false);
        setError('Unable to load todos');
        setTimeout(() => setHiddenClass(true), 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return todo;
      }
    })
  ), [todos, filter]);

  const addTodo = (title: string, setTitle: (v: string) => void) => {
    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setIsLoading(true);

    todoService.addTodo(newTodo)
      .then((todoRes) => {
        setTodos(prevTodos => [...prevTodos, todoRes]);
        setTitle('');
      })
      .catch(() => {
        setHiddenClass(false);
        setError('Unable to add a todo');
        setTimeout(() => setHiddenClass(true), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const deleteTodo = (id: number) => {
    todoService.deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setHiddenClass(false);
        setError('Unable to delete a todo');
        setTimeout(() => setHiddenClass(true), 3000);
      })
      .finally(() => {
        setIsLoading(false);
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
          onSetError={setError}
          onSetHiddenClass={setHiddenClass}
          onSubmitForm={addTodo}
          isDisabledWhileLoading={isLoading}
        />

        <Main
          todos={filteredTodos}
          onDelete={deleteTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            onSetFilter={setFilter}
            filter={filter}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {!isLoading
        && (
          <Error
            error={error}
            hiddenClass={hiddenClass}
            onSetHiddenClass={setHiddenClass}
          />
        )}
    </div>
  );
};
