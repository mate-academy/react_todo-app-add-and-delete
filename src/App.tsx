/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
// import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterBy } from './types/FilterBy';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Errors } from './types/Errors';
import { ErrorNotification } from './components/ErrorNotification';

function filterTodos(todos: Todo[], show: string) {
  if (show === FilterBy.All) {
    return todos;
  }

  switch (show) {
    case FilterBy.Active: {
      return todos.filter(todo => !todo.completed);
    }

    case FilterBy.Completed: {
      return todos.filter(todo => todo.completed);
    }

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(Errors.Default);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [isLoaded, setIsLoaded] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const timerId = useRef(0);

  const changeErrorMesssage = (newErrorMessage: Errors) => {
    window.clearTimeout(timerId.current);

    setErrorMessage(newErrorMessage);
    timerId.current = window.setTimeout(
      () => setErrorMessage(Errors.Default),
      3000,
    );
  };

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        changeErrorMesssage(Errors.Load);
      });
  }, []);

  const filteredTodos = filterTodos(todos, filterBy);

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        changeErrorMesssage(Errors.Delete);
      })
      .finally(() => {
        setIsLoaded((loading: number[]) => {
          const stilLoading = loading;

          stilLoading.pop();

          return stilLoading;
        });
      });
  };

  const handleDeleteCompletedTodo = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      setIsLoaded((alreadyLoad: number[]) => [...alreadyLoad, todo.id]);
      handleDeleteTodo(todo.id);
    });
  };

  const handleAddTodo = (todoTitle: string) => {
    const newTodoToAdd = {
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
      id: 0,
    };

    setTempTodo(newTodoToAdd);
    setErrorMessage(Errors.Default);

    return addTodo(newTodoToAdd)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        changeErrorMesssage(Errors.Add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={handleAddTodo}
          setNewError={changeErrorMesssage}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={handleDeleteTodo}
              isLoaded={isLoaded}
              setIsLoaded={setIsLoaded}
              tempTodo={tempTodo}
            />

            <Footer
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              deleteCompleted={handleDeleteCompletedTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        timerId={timerId}
      />
    </div>
  );
};
