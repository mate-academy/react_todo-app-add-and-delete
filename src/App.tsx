/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/footer/Footer';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos } from './api/todos';
import { Header } from './components/header/Header';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './types/TodoFelter';
import { ErrorNotification } from './components/ErrorNotification';
import { Error } from './types/Error';

const USER_ID = 11960;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter]
    = useState<TodoFilter>(TodoFilter.All);
  const [errorText, setErrorText] = useState<Error>(Error.Default);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorText(Error.CantLoad));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (currentFilter) {
      case TodoFilter.Active:
        return todos.filter(todo => !todo.completed);
      case TodoFilter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, currentFilter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleNewTodo = (todo: Todo) => {
    setTodos(current => [...current, todo]);
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .catch(() => setErrorText(Error.Delete))
      .finally(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      });
  };

  const handleDeleteCompleted = async (todosId: number[]) => {
    try {
      for (let i = 0; i < todosId.length; i += 1) {
        deleteTodo(todosId[i]);
      }
    } catch (error) {
      setErrorText(Error.Delete);
    } finally {
      setTodos(current => current.filter(todo => !todosId.includes(todo.id)));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodo={handleNewTodo}
          setTempTodo={setTempTodo}
          idUser={USER_ID}
          setErrorMessege={setErrorText}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={handleDeleteTodo}
              tempTodo={tempTodo}
            />
            <Footer
              todos={filteredTodos}
              setFilter={setCurrentFilter}
              filterType={currentFilter}
              cleanComplitedTodo={handleDeleteCompleted}
            />
          </>
        )}
      </div>
      <ErrorNotification errorText={errorText} key={errorText} />
    </div>
  );
};
