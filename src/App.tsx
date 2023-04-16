/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { addTodo, getTodos, deleteTodo } from './api/todos';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { Notification } from './Components/Notification';

const USER_ID = 7011;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status>(Status.All);
  const [isError, setIsError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isWaitingForDelete, setIsWaitingForDelete] = useState(0);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (selectedStatus) {
        case Status.Active:
          return !todo.completed;
        case Status.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [selectedStatus, todos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setIsError(true);
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      });
  }, []);

  const addNewTodo = (titleInput: string) => {
    if (!titleInput.trim()) {
      setIsError(true);
      setErrorMessage('Title can\'t be empty');
      setTimeout(() => {
        setIsError(false);
      }, 3000);

      return;
    }

    setIsDisabledInput(true);
    setTitle('');

    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo });

    addTodo(USER_ID, newTodo)
      .then(result => {
        setTodos(prev => ([...prev, result]));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo!');
      })
      .finally(() => {
        setIsDisabledInput(false);
        setTempTodo(null);
      });
  };

  const removeTodo = async (id: number) => {
    setIsWaitingForDelete(id);

    return deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsWaitingForDelete(0);
      });
  };

  const removeTodoCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const unCompleted = todos.filter(todo => !todo.completed);

    setIsDeletingCompleted(true);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(unCompleted);
        })
        .catch(() => {
          setErrorMessage('Unable to delete todos');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        })

        .finally(() => {
          setIsDeletingCompleted(false);
        });
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
          todos={todos}
          title={title}
          handleNewTitle={handleNewTitle}
          addNewTodo={addNewTodo}
          isDisabledInput={isDisabledInput}
        />
        <TodoList
          todosToShow={filteredTodos}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
          isWaitingForDelete={isWaitingForDelete}
          isDeletingCompleted={isDeletingCompleted}

        />
        {todos && (
          <Footer
            todosToShow={filteredTodos}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            removeTodoCompleted={removeTodoCompleted}
          />
        )}
      </div>
      {isError && (
        <Notification
          isError={isError}
          setIsError={setIsError}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
