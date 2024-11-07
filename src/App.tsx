import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import classNames from 'classnames';
import { ErrorNotification } from './types/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [deletedTodoId, setDeletedTodoId] = useState<number | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorNotification.loadingError);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filterTodosByStatus = useCallback(() => {
    let filtered;

    switch (filter) {
      case FilterStatus.Active:
        filtered = todos.filter(todo => !todo.completed);
        break;
      case FilterStatus.Completed:
        filtered = todos.filter(todo => todo.completed);
        break;
      default:
        filtered = todos;
    }

    setFilteredTodos(filtered);
  }, [todos, filter]);

  useEffect(() => {
    filterTodosByStatus();
  }, [todos, filter, filterTodosByStatus]);

  const createTempTodo = (tempTitle: string): Todo => {
    return {
      title: tempTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
    };
  };

  const handleAddTodo = (newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    setTempTodo(createTempTodo(newTitle));
    setLoading(true);

    if (trimmedTitle) {
      createTodo(trimmedTitle)
        .then(newTodoResponse => {
          setTodos(prevTodos => [...prevTodos, newTodoResponse]);
          setTempTodo(null);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage(ErrorNotification.addError);
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => {
          setTempTodo(null);
          setLoading(false);
        });
    } else {
      setTempTodo(null);
      setLoading(false);
      setErrorMessage(ErrorNotification.titleError);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const deleteSelectedTodo = (todoId: number): Promise<void> => {
    setDeletedTodoId(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos: Todo[]) =>
          currentTodos.filter((todo: Todo) => todo.id !== todoId),
        );
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage(ErrorNotification.deleteError);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setDeletedTodoId(null);
      });
  };

  const handleClearComplete = () => {
    const completedTodos = todos.filter((todo: Todo) => todo.completed);

    const deletePromises = completedTodos.map((completedTodo: Todo) => {
      return deleteTodo(completedTodo.id);
    });

    Promise.allSettled(deletePromises)
      .then(results => {
        const successfulDeletes = completedTodos.filter(
          (_, index) => results[index].status === 'fulfilled',
        );

        setTodos(currentTodos =>
          currentTodos.filter(
            (todo: Todo) => !successfulDeletes.includes(todo),
          ),
        );

        const errorResponse = results.find(
          result => result.status === 'rejected',
        );

        if (errorResponse) {
          setErrorMessage(ErrorNotification.deleteError);
        }
      })
      .catch(() => {
        setErrorMessage(ErrorNotification.deleteError);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={handleAddTodo}
          title={title}
          setTitle={setTitle}
          todos={todos}
          errorMessage={errorMessage}
          isLoading={loading}
        />

        <TodoList
          todos={filteredTodos}
          deleteSelectTodo={deleteSelectedTodo}
          deletedTodoId={deletedTodoId}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            todos={todos}
            handleClearComplete={handleClearComplete}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
