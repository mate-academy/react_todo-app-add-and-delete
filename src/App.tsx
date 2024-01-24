/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { Notification } from './Components/Notiifcation';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { FilterType } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 13;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [errorMessege, setErrorMessege] = useState(ErrorMessage.NONE);
  const [selectedId, setSelectedId] = useState(-1);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => {
        setErrorMessege(ErrorMessage.CANNOT_LOAD_TODOS);
      });
  }, []);

  const addTodo = (title: string) => {
    setErrorMessege(ErrorMessage.NONE);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    client.post<Todo>('/todos', {
      userId: USER_ID,
      title,
      completed: false,
    })
      .then(newTodo => {
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessege(ErrorMessage.UNABLE_TO_ADD_A_TODO);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessege(ErrorMessage.NONE);
    setSelectedId(todoId);

    client.delete(`/todos/${todoId}`)
      .then(() => setTodos(todos.filter((todo) => todo.id !== todoId)))
      .catch(() => {
        setErrorMessege(ErrorMessage.UNABLE_TO_DELETE_A_TODO);
      })
      .finally(() => {
        setSelectedId(-1);
      });
  };

  const deleteAllCompleted = () => {
    setIsLoadingCompleted(true);

    const completedTodos = todos.filter((todo) => todo.completed);

    const deletePromises = completedTodos.map((todo) => client.delete(`/todos/${todo.id}`));

    Promise.all(deletePromises)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter((todo) => !todo.completed));
      })
      .catch((error) => {
        setErrorMessege(ErrorMessage.UNABLE_TO_DELETE_A_TODO);
        throw error;
      })
      .finally(() => {
        setIsLoadingCompleted(false);
      });
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case FilterType.ACTIVE:
        return !todo.completed;
      case FilterType.COMPLETED:
        return todo.completed;
      case FilterType.ALL:
      default:
        return true;
    }
  });

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  const closeErrorMsg = () => {
    setErrorMessege(ErrorMessage.NONE);
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
          addTodo={addTodo}
          setErrorMessege={setErrorMessege}
          isLoading={!!tempTodo}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          selectedId={selectedId}
          isLoadingCompleted={isLoadingCompleted}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            setFilter={setFilter}
            itemsLeft={itemsLeft}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification
        errorMessege={errorMessege}
        close={closeErrorMsg}
      />
    </div>
  );
};
