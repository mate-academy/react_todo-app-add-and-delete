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
  const [selectedFilter, setSelectedFilter] = useState(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
  const [loadingClearCompleted, setLoadingClearCompleted] = useState(false);

  useEffect(() => {
    setErrorMessage('');

    todosService.getTodos(USER_ID)
      .then((tacks) => {
        setTodos(tacks);
        setLoading(true);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

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

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
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
          onDelete={deleteTodo}
          loadingClearCompleted={loadingClearCompleted}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            onDelete={deleteTodo}
            filterBy={selectedFilter}
            changeFilter={handleFilterChange}
            loadingClearCompleted={loadingClearCompleted}
            setLoadingClearCompleted={setLoadingClearCompleted}

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
