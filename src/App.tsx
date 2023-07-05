/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodos, deleteTodo, getTodos } from './api/todos';
import { Error } from './components/Error/Error';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Todolist } from './components/Todolist/Todolist';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoStatus } from './types/TodoStatus';

const USER_ID = 10890;

export const App: React.FC = () => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoStatus>(TodoStatus.all);
  const [errorMessage, setErrorMessage]
  = useState<ErrorMessage>(ErrorMessage.noError);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setVisibleTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.loadError);
      });
  }, []);

  const handleCloseError = () => {
    setErrorMessage(ErrorMessage.noError);
  };

  const filteredTodos = useCallback(() => {
    switch (filter) {
      case TodoStatus.completed:
        return visibleTodos.filter(todo => todo.completed);

      case TodoStatus.active:
        return visibleTodos.filter(todo => !todo.completed);

      default:
        return visibleTodos;
    }
  }, [filter, visibleTodos]);

  const completedTodos = filteredTodos().filter(todo => todo.completed);
  const activeTodos = filteredTodos().filter(todo => !todo.completed);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setTempTodo({
      id: 0,
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    });

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorMessage.titleError);
      setIsLoading(false);
      setTempTodo(null);

      return;
    }

    addTodos(USER_ID, {
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    })
      .then((result) => {
        setVisibleTodos((prevTodos) => {
          return [result, ...prevTodos];
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.addError);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setNewTodoTitle('');
      });
  };

  const removeTodo = (todoId: number) => {
    setDeletedTodoId((prevState) => [...prevState, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setVisibleTodos(
          visibleTodos.filter(todo => (
            todo.id !== todoId
          )),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.deleteError);
      })
      .finally(() => {
        setDeletedTodoId([0]);
      });
  };

  const handleRemoveCompleted = () => {
    const todoToRemove = completedTodos.map(todo => {
      setDeletedTodoId((prevState) => [...prevState, todo.id]);

      return deleteTodo(todo.id);
    });

    Promise.all(todoToRemove)
      .then(() => {
        setVisibleTodos(activeTodos);
        setDeletedTodoId([0]);
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
          activeTodos={activeTodos}
          handleSubmit={handleSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isLoading={isLoading}
        />
        <Todolist
          filteredTodos={filteredTodos()}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
          deletedTodoId={deletedTodoId}
        />

        {filteredTodos() && (
          <Footer
            activeTodos={activeTodos}
            filter={filter}
            setFilter={setFilter}
            completedTodos={completedTodos}
            handleRemoveCompleted={handleRemoveCompleted}
          />
        )}
      </div>

      {errorMessage && (
        <Error
          errorMessage={errorMessage}
          handleCloseError={handleCloseError}
        />
      )}
    </div>
  );
};
