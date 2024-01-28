/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import * as PostServise from './api/todos';
import { Error } from './types/Error';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

const USER_ID = 12126;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(Filter.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadClear, setLoadClear] = useState(false);

  const completedTodo = todos.filter(todo => todo.completed);
  const uncompletedTodo = todos.filter(todo => !todo.completed);

  useEffect(() => {
    setErrorMessage('');

    PostServise.getTodos(USER_ID)
      .then((todoTask) => {
        setTodos(todoTask);
        setIsLoading(true);
      })
      .catch(() => setErrorMessage(Error.get))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFilterChange = (filter: Filter) => setFilterBy(filter);

  const filterTodos = () => {
    switch (filterBy) {
      case Filter.active:
        return todos.filter(todo => !todo.completed);
      case Filter.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const visibleTodos = filterTodos();

  const addTodo = (title: string) => {
    setErrorMessage('');
    setIsLoading(true);
    setSelectedId(0);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    const request = PostServise.createTodo({
      userId: USER_ID,
      title,
      completed: false,
    })
      .then(newTodo => {
        setTodos(currentTodo => [...currentTodo, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(Error.post);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setSelectedId(-1);
      });

    return request;
  };

  const deleteTodos = (postId: number) => {
    setErrorMessage('');
    setIsLoading(true);
    setSelectedId(postId);

    return PostServise.deleteTodos(postId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== postId));
      })
      .catch((error) => {
        setErrorMessage(Error.delete);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
        setSelectedId(-1);
      });
  };

  const clearCompleted = () => {
    setErrorMessage('');
    setLoadClear(true);

    const deletePromises = completedTodo
      .map((todo) => PostServise.deleteTodos(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
      })
      .catch((error) => {
        setErrorMessage(Error.delete);
        throw error;
      })
      .finally(() => {
        setLoadClear(false);
      });
  };

  return (
    <>
      {USER_ID ? (
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header
              todos={todos}
              addTodo={addTodo}
              error={errorMessage}
              setError={setErrorMessage}
              loading={isLoading}
            />

            <TodoList
              todos={visibleTodos}
              onDelete={deleteTodos}
              selectedId={selectedId}
              tempTodo={tempTodo}
              loadClear={loadClear}

            />

            {todos.length > 0 && (
              <Footer
                filterBy={filterBy}
                changeFilter={handleFilterChange}
                completedTodos={completedTodo}
                uncompletedTodos={uncompletedTodo}
                clearCompleted={clearCompleted}
              />
            )}
          </div>

          <ErrorMessage
            error={errorMessage}
            setError={setErrorMessage}
          />
        </div>
      ) : (
        <UserWarning />
      )}
    </>

  );
};
