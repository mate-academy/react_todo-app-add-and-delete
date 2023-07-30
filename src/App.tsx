/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Form } from './components/Form';
import { Footer } from './components/Footer';
import { Notifications } from './components/Notifications';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { FilterType } from './types/FilterType';
import { getFilteredTodos } from './utils/TodoFilter';
import { NOTIFICATION } from './types/Notification';
import { USER_ID } from './constants/USER_ID';
import { completedTodos } from './utils/CompletedTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [notification, setNotification] = useState(NOTIFICATION.CLEAR);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
        setTempTodo(null);
      }).catch(() => setNotification(NOTIFICATION.LOAD));
  }, []);

  const addTodo = (newTodo: Todo) => {
    setLoading(true);
    setTempTodo(newTodo);

    todoService.createTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos!, todo]);
        if (titleField.current) {
          // eslint-disable-next-line no-console
          console.log(titleField.current);

          titleField.current.focus();
        }
      })
      .catch((error) => {
        setNotification(NOTIFICATION.ADD);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos: Todo[]) => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch((error) => {
        setNotification(NOTIFICATION.DELETE);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteCompletedTodo = () => {
    setLoading(true);

    const completedTodosList = completedTodos(todos);

    if (!completedTodosList || completedTodosList.length === 0) {
      setNotification(NOTIFICATION.NO_COMPLETED);
      setLoading(false);

      return;
    }

    const deletePromises = completedTodosList.map(todo => deleteTodo(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos((currentTodos: Todo[]) => {
          return currentTodos.filter(todo => !todo.completed);
        });
      })
      .catch((error) => {
        setNotification(NOTIFICATION.DELETE_COMPLETED);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setFilterType(FilterType.ALL);
      });
  };

  //   setTimeout(() => {
  //     if (deleteCompletedTodo) {
  //       setTodos(listOfCompletedTodos);

  //       todos.map((todo) => {
  //         if (todo.completed === true) {
  //           todoService.deleteTodo(todo.id)
  //             .catch((error) => {
  //               setTodos(todos);
  //               setNotification(NOTIFICATION.DELETE_COMPLETED);
  //               throw error;
  //             })
  //             .finally(() => setLoading(false));
  //         }

  //         return todo;
  //       });
  //     }
  //   }, 1000);

  //   setTimeout(() => {
  //     if (todoIdForDelete) {
  //       setTodos(deleteTodo(todos));

  //       todoService.deleteTodo(todoIdForDelete)
  //         .catch((error) => {
  //           setTodos(todos);
  //           setNotification(NOTIFICATION.DELETE);
  //           throw error;
  //         })
  //         .finally(() => setLoading(false));
  //     }
  //   }, 1000);
  // }, [todoIdForDelete, deleteCompletedTodo]);

  const filteredTodos: Todo[] = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <Form
            loading={loading}
            todos={filteredTodos}
            addTodo={(newTodo) => addTodo(newTodo)}
            titleField={titleField}
          />
        </header>

        <TodoList
          loading={loading}
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
        />

        {todos.length !== 0
          && (
            <Footer
              todos={todos}
              filterType={filterType}
              setFilterType={setFilterType}
              removeCompleted={deleteCompletedTodo}
            />
          )}
      </div>

      {notification !== NOTIFICATION.CLEAR
        && (
          <Notifications
            notification={notification}
          />
        )}
    </div>
  );
};
