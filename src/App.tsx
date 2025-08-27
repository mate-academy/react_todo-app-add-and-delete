/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  deleteTodo,
  USER_ID,
  updateTodo,
} from './api/todos';
import { NotificationType } from './types/NotificationType';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Filter } from './components/Filter/Filter';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
// eslint-disable-next-line max-len
import { NotificationMessage } from './components/Notification/NotificationMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>('all');
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleErrorMessage = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const visibleTodos = useCallback(
    (todosArr: Todo[]) => {
      let filteredTodos = todosArr;

      switch (status) {
        case 'active':
          filteredTodos = filteredTodos.filter(todo => !todo.completed);
          break;
        case 'completed':
          filteredTodos = filteredTodos.filter(todo => todo.completed);
          break;

        default:
          break;
      }

      setTodos(filteredTodos);
    },
    [status],
  );

  useEffect(() => {
    getTodos()
      .then(todosResponse => {
        // setTodos(todos);
        if (todosResponse.length === 0) {
          handleErrorMessage(NotificationType.LOAD_TODOS);
        }

        visibleTodos(todosResponse);
      })
      .catch(err => {
        handleErrorMessage(NotificationType.LOAD_TODOS);

        throw err;
      });
  }, [status, visibleTodos]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function onAddNewTodo(todo: Todo) {
    setLoading(true);
    setTempTodo(todo);

    return addTodo(todo)
      .then(newTodoResponse => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodoResponse];
        });
      })
      .catch(err => {
        handleErrorMessage(NotificationType.ADD_TODO);
        inputRef?.current?.focus();
        throw err;
      })
      .finally(() => {
        setTempTodo(undefined);
        setLoading(false);
        inputRef?.current?.focus();
      });
  }

  function onToggleCompleted(todoId: number, completed: boolean) {
    setLoading(true);

    return updateTodo(todoId, { completed })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? { ...todo, completed } : todo,
          ),
        );
      })
      .catch(err => {
        handleErrorMessage(NotificationType.UPDATE_TODO);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoading(true);

    const deleteCompleted = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
          );
        })
        .catch(err => {
          handleErrorMessage(NotificationType.DELETE_TODO);

          throw err;
        }),
    );

    Promise.all(deleteCompleted)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
      })
      .finally(() => {
        setLoading(false);
        inputRef.current?.focus();
      });
  }

  const onDeleteTodo = (todoId: number) => {
    setLoading(true);

    inputRef.current?.focus();

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(err => {
        setTodos(todos);
        handleErrorMessage(NotificationType.DELETE_TODO);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={onAddNewTodo}
          userID={USER_ID}
          setError={handleErrorMessage}
          inputRef={inputRef}
        />

        <TodoList
          todos={todos}
          onDelete={onDeleteTodo}
          tempTodo={tempTodo}
          loader={loading}
          onToggleCompleted={onToggleCompleted}
        />

        {/* Show the list only if there are todos */}
        {/* <section className="todoapp__main" data-cy="TodoList">

        {/* This is a placeholder for more todos */}
        {/* This todo is an active todo */}

        {/* This is a completed todo */}
        {/* <div data-cy="Todo" className="todo completed">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Completed Todo
            </span> */}

        {/* Remove button appears only on hover */}
        {/* <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button> */}

        {/* overlay will cover the todo while it is being deleted or updated */}
        {/* <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
          This todo is being edited
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
        {/* This todo is in loadind state */}
        {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button> */}

        {/* 'is-active' class puts this modal on top of the todo */}
        {/* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
        {/* </section> */}

        {todos.length !== 0 && (
          <Filter
            todos={todos}
            status={status}
            setStatus={setStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <NotificationMessage error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
