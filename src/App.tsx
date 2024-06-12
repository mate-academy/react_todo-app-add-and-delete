/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';
import cn from 'classnames';
import { ErrorTypes } from './types/ErrorTypes';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [listOfTodos, setListOfTodos] = useState<Todo[]>([]);
  const [selectedValue, setSelectedValue] = useState(Status.all);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);
  const [query, setQuery] = useState('');
  const [isResponding, setisResponding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setListOfTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.UnableToLoad);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const getFilteredTodos = listOfTodos.filter(todo => {
    switch (selectedValue) {
      case Status.active:
        return !todo.completed;
      case Status.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleCompleted = (n: number) => {
    const updatedTodos = listOfTodos?.map(todo =>
      todo.id === n ? { ...todo, completed: !todo.completed } : todo,
    );

    setListOfTodos(updatedTodos);
  };

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setErrorMessage(null);
    setTempTodo({ id: 0, userId, title, completed });
    setisResponding(true);

    return todoService
      .addTodo({ userId, title, completed })
      .then(newTodo => {
        setListOfTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(err => {
        setErrorMessage(ErrorTypes.UnableToAdd);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        throw err;
      })
      .finally(() => {
        setisResponding(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (id: number) => {
    setisResponding(true);
    setLoadingTodoId(carrent => [...carrent, id]);
    todoService
      .deleteTodo(id)
      .then(() => {
        setListOfTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== id),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.UnableToDelete);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setisResponding(false);
        setLoadingTodoId([]);
      });
  };

  const completedTodos = listOfTodos.filter(todo => todo.completed);
  const todosLeft = listOfTodos.length - completedTodos.length;
  const allCompleted = listOfTodos.every(todo => todo.completed);

  const deleteAllCompleted = () => {
    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setQuery={setQuery}
          title={query}
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          isResponding={isResponding}
          allCompleted={allCompleted}
        />

        {!!listOfTodos.length && (
          <TodoList
            mainTodoList={getFilteredTodos}
            handleCompleted={handleCompleted}
            deleteTodo={deleteTodo}
            tempTodo={tempTodo}
            loadingTodoId={loadingTodoId}
          />
        )}

        {!!listOfTodos.length && (
          <Footer
            todosLeft={todosLeft}
            setSelectedValue={setSelectedValue}
            selectedValue={selectedValue}
            completedTodos={completedTodos}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
