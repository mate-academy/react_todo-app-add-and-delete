import React, { useEffect, useState } from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  // const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [deletedTodoId, setDeletedTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.loadError);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filterTodosByStatus = () => {
    switch (filterStatus) {
      case Status.Active:
        return todos.filter((todo: Todo) => !todo.completed);
      case Status.Completed:
        return todos.filter((todo: Todo) => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = filterTodosByStatus();

  const createTempTodo = (tempTitle: string): Todo => {
    return {
      id: 0,
      userId: USER_ID,
      title: tempTitle,
      completed: false,
    };
  };

  const addNewTodo = (newTitle: string) => {
    const trimedTitle = newTitle.trim();

    setTempTodo(createTempTodo(newTitle));
    setIsLoading(true);

    if (trimedTitle) {
      addTodo(trimedTitle)
        .then(newTodo => {
          setTodos([...todos, newTodo]);
          setTempTodo(null);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.addError);
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
        });
    } else {
      setTempTodo(null);
      setIsLoading(false);
      setErrorMessage(ErrorMessage.titleError);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const deleteSelectTodo = (todoId: number): Promise<void> => {
    setDeletedTodoId(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos: Todo[]) =>
          currentTodos.filter((todo: Todo) => todo.id !== todoId),
        );
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.deleteError);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setDeletedTodoId(null);
      });
  };

  const handleClearComplete = async () => {
    const completedTodos = todos.filter((todo: Todo) => todo.completed);

    const deletePromises = completedTodos.map((completedTodo: Todo) => {
      return deleteTodo(completedTodo.id);
    });

    await Promise.allSettled(deletePromises)
      .then(results => {
        const successfulDeletes = completedTodos.filter(
          (_, index) => results[index].status === 'fulfilled',
        );

        setTodos(currentTodos =>
          currentTodos.filter(
            (todo: Todo) => !successfulDeletes.includes(todo),
          ),
        );

        const hasError = results.find(result => result.status === 'rejected');

        if (hasError) {
          setErrorMessage(ErrorMessage.deleteError);
        }
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.deleteError);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addNewTodo={addNewTodo}
          title={title}
          setTitle={setTitle}
          todos={todos}
          errorMessage={errorMessage}
          isLoading={isLoading}
        />

        <TodoList
          todos={filteredTodos}
          deleteSelectTodo={deleteSelectTodo}
          // isLoading={isLoading}
          deletedTodoId={deletedTodoId}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
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
