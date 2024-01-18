import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todosService from './api/todos';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { Error } from './components/Error/Error';

const USER_ID = 11984;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
  const [selectedFilter, setSelectedFilter] = useState(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingClearCompleted, setLoadingClearCompleted] = useState(false);

  const completedTodos = todos.filter(todo => todo.completed);
  const unComletedTodos = todos.filter(todo => !todo.completed);

  useEffect(() => {
    setErrorMessage('');

    todosService.getTodos(USER_ID)
      .then((tacks) => {
        setTodos(tacks);
        setLoading(true);
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableToLoad))
      .finally(() => setLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleFilterChange = (filter: FilterType) => setSelectedFilter(filter);

  const filterTodos = () => {
    switch (selectedFilter) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const visibleTodos = filterTodos();

  const addTodo = (title: string) => {
    setErrorMessage('');
    setLoading(true);
    setSelectedId(0);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    const request = todosService.createTodo({
      userId: USER_ID,
      title,
      completed: false,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UnableToAdd);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
        setSelectedId(-1);
      });

    return request;
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    setLoading(true);
    setSelectedId(todoId);

    return todosService.deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo
          .filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UnableToDelete);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setSelectedId(-1);
      });
  };

  const clearCompleted = () => {
    setErrorMessage('');
    setLoadingClearCompleted(true);

    const deletePromises = completedTodos
      .map((todo) => todosService.deleteTodos(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos(currentTodo => currentTodo
          .filter((todo) => !todo.completed));
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UnableToDelete);
        throw error;
      })
      .finally(() => {
        setLoadingClearCompleted(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onSubmit={addTodo}
          error={errorMessage}
          setError={setErrorMessage}
          loading={loading}
        />
        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          selectedId={selectedId}
          loading={loading}
          onDelete={deleteTodo}
          completedTodos={completedTodos}
          loadingClearCompleted={loadingClearCompleted}
        />

        {todos.length > 0 && (
          <Footer
            filterBy={selectedFilter}
            changeFilter={handleFilterChange}
            completedTodos={completedTodos}
            unComletedTodos={unComletedTodos}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <Error
        error={errorMessage}
        setError={setErrorMessage}
      />
    </div>
  );
};
