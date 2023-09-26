/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Filter, Todo, ErrorMessageEnum } from './types/Todo';
import { client } from './utils/fetchClient';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorBin } from './components/ErrorBin/ErrorBin';
import { getTodos } from './api/todos';

const USER_ID = 11572;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [refreshTodos, setRefreshTodos] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('All');
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editIsLoading, setEditIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage('');
        setErrorMessage(ErrorMessageEnum.noTodos);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, [refreshTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const displayedTodos = () => {
    let filteredTodos = [...todos];

    filteredTodos = filteredTodos.filter(todo => {
      if (filter === 'Active' && todo.completed) {
        return false;
      }

      if (filter === 'Completed' && !todo.completed) {
        return false;
      }

      return true;
    });

    return filteredTodos;
  };

  const handleDoubleClick = (todo: Todo) => {
    setEditTodo(todo);
    setEditTitle(todo.title);
  };

  const handleCompletedStatus = (todo: Todo) => {
    const url = `/todos/${todo.id}`;
    const updatedData = { completed: !todo.completed };

    setEditIsLoading(true);

    client.patch(url, updatedData)
      .then(() => {

      })
      .catch(() => {
        setErrorMessage('');
        setErrorMessage(ErrorMessageEnum.noUpdateTodo);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setEditIsLoading(false);
        setRefreshTodos(prev => !prev);
      });
  };

  const handleToggleAll = () => {
    if (todos.some(todo => !todo.completed)) {
      todos.forEach(
        (todo) => {
          const url = `/todos/${todo.id}`;

          client.patch(url, { completed: true })
            .then(() => {
              setEditIsLoading(true);
            })
            .catch(() => {
              setErrorMessage('');
              setErrorMessage(ErrorMessageEnum.noUpdateTodo);

              setTimeout(() => {
                setErrorMessage('');
              }, 3000);
            })
            .finally(() => {
              setEditIsLoading(false);
              setRefreshTodos(prev => !prev);
            });
        },
      );
    } else {
      todos.forEach(handleCompletedStatus);
    }
  };

  const handleDelete = (todo: Todo) => {
    const url = `/todos/${todo.id}`;

    client.delete(url).then(() => {
    })
      .catch(() => {
        setErrorMessage('');
        setErrorMessage(ErrorMessageEnum.noDeleteTodo);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }).finally(() => setRefreshTodos(prev => !prev));
  };

  const handleEditTodo: React.ChangeEventHandler<HTMLInputElement>
  = (event) => {
    setEditTitle(event.target.value);
  };

  const handleFormSubmitEdited
  = (event: React.FormEvent<HTMLFormElement>, todo: Todo) => {
    event.preventDefault();
    const url = `/todos/${todo.id}`;
    const updatedData = { title: editTitle.trim() };

    setEditIsLoading(true);

    if (!editTitle.trim()) {
      handleDelete(todo);
    }

    client.patch(url, updatedData)
      .then(() => {
      })
      .catch(() => {
        setErrorMessage('');
        setErrorMessage(ErrorMessageEnum.noUpdateTodo);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setRefreshTodos(prev => !prev);
        setEditIsLoading(false);
      });

    setEditTodo(null);
  };

  const handleNewTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage('');
      setErrorMessage(ErrorMessageEnum.emptyTitle);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    client.post('/todos', newTodo).then(() => {
      setNewTodoTitle('');
    })
      .catch(() => {
        setErrorMessage('');
        setErrorMessage(ErrorMessageEnum.noPostTodo);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }).finally(() => setRefreshTodos(prev => !prev));
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed === true).forEach(todo => {
      const url = `/todos/${todo.id}`;

      return (client.delete(url).then(() => {
      }).catch(() => {
        setErrorMessage('');
        setErrorMessage(ErrorMessageEnum.noDeleteTodo);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      ).finally(() => setRefreshTodos(prev => !prev));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleToggleAll={handleToggleAll}
          handleNewTodoSubmit={handleNewTodoSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
        />

        {todos.length > 0 && (
          <TodoList
            displayedTodos={displayedTodos}
            editTodo={editTodo}
            editIsLoading={editIsLoading}
            editTitle={editTitle}
            handleDoubleClick={handleDoubleClick}
            handleDelete={handleDelete}
            handleCompletedStatus={handleCompletedStatus}
            handleFormSubmitEdited={handleFormSubmitEdited}
            handleEditTodo={handleEditTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorBin
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />

    </div>

  // <section className="section container">
  //   <p className="title is-4">
  //     Copy all you need from the prev task:
  //     <br />
  //     <a href="https://github.com/mate-academy/react_todo-app-loading-todos#react-todo-app-load-todos">React Todo App - Load Todos</a>
  //   </p>

  //   <p className="subtitle">Styles are already copied</p>
  // </section>
  );
};
