/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Filter, Todo } from './types/Todo';
import * as todosService from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { TempTodo } from './components/TempTodo';

const USER_ID = 11641;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [filterBy, setFilterBy] = useState<Filter>(Filter.all);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [hideNotification, setHideNotification] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const filteredTodos = todos.filter((todo) => todo.completed);

    setQuantity(todos.length - filteredTodos.length);
  }, [todos]);

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage('');
    todosService.getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTodos = useMemo(() => {
    const filteredByTodos = todos.length
      ? todos.filter((todo) => {
        switch (filterBy) {
          case Filter.active:
            return !todo.completed;
          case Filter.completed:
            return todo.completed;
          default:
            return true;
        }
      })
      : [];

    return filteredByTodos;
  }, [filterBy, todos]);

  const deleteTodo = (todoId: number) => {
    setTodos((currentTodos) => currentTodos.filter(
      (todo) => todo.id !== todoId,
    ));
    setIsLoading(true);
    setErrorMessage('');

    return todosService.deleteTodo(todoId)
      .catch((error) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const createNewTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
    setIsLoading(true);
    setErrorMessage('');

    return todosService
      .addTodo({ title, completed, userId })
      .then((newTodo: Todo) => {
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const updateTodo = (updatedTodo: Todo) => {
    setIsLoading(true);
    setErrorMessage('');

    return todosService.updateTodo(updatedTodo)
      .then((todo) => {
        setTodos((currentTodos) => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            (post) => post.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const searchCompletedTodos = () => {
    const hasCompletedTodos = filteredTodos.some((todo) => todo.completed);

    setHasCompleted(hasCompletedTodos);
  };

  const deleteCompletedTodos = () => {
    if (hasCompleted) {
      const arrWithId = todos
        .filter((todo) => todo.completed)
        .map((id) => id.id);

      arrWithId.map(async (id) => {
        await todosService.deleteTodo(id).catch(() => {
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        });
      });

      const result = todos.filter((todo) => !todo.completed);

      setTodos(result);
    }

    return 0;
  };

  useEffect(() => {
    const hasCompletedTodos = filteredTodos.some((todo) => todo.completed);

    setHasCompleted(hasCompletedTodos);
  }, [filteredTodos, hasCompleted]);

  useEffect(() => {
    setHideNotification(!errorMessage.length);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <h2>{isLoading}</h2>
      <div className="todoapp__content">
        <Header
          setTitle={setTodoTitle}
          title={todoTitle}
          addTodo={createNewTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
        />

        {!!todos.length && (
          <TodoList
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            todos={filteredTodos}
            searchCompletedTodos={searchCompletedTodos}
          />
        )}
        {!!tempTodo && (
          <TempTodo tempTodo={tempTodo} />
        )}

        {!!todos.length && (
          <Footer
            setFilterBy={setFilterBy}
            hasCompleted={hasCompleted}
            quantity={quantity}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <Notification
        hideNotification={hideNotification}
        setHideNotification={setHideNotification}
        error={errorMessage}
      />
    </div>
  );
};
