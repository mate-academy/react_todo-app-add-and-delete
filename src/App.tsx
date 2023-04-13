import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/Filter';
import { ErrorType } from './types/Error';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ToDoList } from './components/ToDoList';

const USER_ID = 6701;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(0);

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => {
        setTodos(res);
      })
      .catch(() => {
        setError(ErrorType.Loading);
        setTodos([]);
      });
  }, []);

  const addTodo = (title:string) => {
    if (!title) {
      setError(ErrorType.EmptyTitle);

      return;
    }

    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    postTodo(newTodo)
      .then(res => {
        setTodos(oldTodos => ([...oldTodos, res]));
      })
      .catch(() => {
        setError(ErrorType.Post);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const filterTodos = (filter: FilterType) => {
    switch (filter) {
      case FilterType.Active:
        return (todos.filter(todo => !todo.completed));

      case FilterType.Completed:
        return (todos.filter(todo => todo.completed));

      default:
        return [...todos];
    }
  };

  const visibleTodos:Todo[] = useMemo(
    () => filterTodos(statusFilter), [statusFilter, todos],
  );

  const handleClickFilter = (filter: FilterType) => {
    setStatusFilter(filter);
  };

  const handleDeleteNotification = () => {
    setError(ErrorType.None);
  };

  const numActiveTodos = filterTodos(FilterType.Active).length;
  const numCompletedTodos = filterTodos(FilterType.Completed).length;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(input);
    setInput('');
  };

  const handleDelete = (todoId: number) => {
    setIsLoading(true);
    setDeleting(todoId);
    deleteTodo(todoId)
      .then(() => {
        setTodos(oldTodos => (
          oldTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => {
        setError(ErrorType.Delete);
      })
      .finally(() => {
        setIsLoading(false);
        setDeleting(0);
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
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
          input={input}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />

        <ToDoList
          visibleTodos={visibleTodos}
          handleDelete={handleDelete}
          isLoading={isLoading}
          deleting={deleting}
          tempTodo={tempTodo}
        />

        <Footer
          numActiveTodos={numActiveTodos}
          numCompletedTodos={numCompletedTodos}
          statusFilter={statusFilter}
          todos={todos}
          handleClickFilter={handleClickFilter}
          handleClearCompleted={handleClearCompleted}
        />
      </div>

      <ErrorNotification
        error={error}
        handleDeleteNotification={handleDeleteNotification}
      />
    </div>
  );
};
