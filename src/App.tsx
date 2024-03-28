/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { UpdatingStatus, Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter, Footer } from './components/Footer';
import { ErrorMessage, Notification } from './components/Notification';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterValue, setFilterValue] = useState<Filter>(Filter.all);
  const [updatingStatus, setUpdatingStatus] = useState(UpdatingStatus.success);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const timerId = useRef(0);

  function showError(message: ErrorMessage | null) {
    window.clearTimeout(timerId.current);

    setErrorMessage(message);

    if (!message) {
      return;
    }

    timerId.current = window.setTimeout(() => setErrorMessage(null), 3000);
  }

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        showError(ErrorMessage.load);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterValue) {
        case Filter.completed:
          return todo.completed;
        case Filter.active:
          return !todo.completed;
        default:
          return true;
      }
    });
  }, [filterValue, todos]);

  const onClearMessageHandler = () => {
    showError(null);
  };

  const onAddHendler = (value: string) => {
    const title = value.trim();

    if (!title) {
      showError(ErrorMessage.emptyTitle);

      return;
    }

    setUpdatingStatus(UpdatingStatus.inProgres);
    setTempTodo({ id: 0, title, userId: 0, completed: false });

    addTodo(title)
      .then(data => {
        setUpdatingStatus(UpdatingStatus.success);
        setTodos([...todos, data]);
      })
      .catch(() => {
        showError(ErrorMessage.add);
        setUpdatingStatus(UpdatingStatus.failed);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const onDeleteHandler = (id: number) => {
    setUpdatingStatus(UpdatingStatus.inProgres);
    setProcessingIds(prevIds => [...prevIds, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError(ErrorMessage.delete);
      })
      .finally(() => {
        setUpdatingStatus(UpdatingStatus.success);
        setProcessingIds(() => []);
      });
  };

  const onClearCompletedHandler = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        onDeleteHandler(todo.id);
      }
    });
  };

  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const completedItemsLeft = todos.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={onAddHendler} status={updatingStatus} />
        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              processingIds={processingIds}
              onDelete={onDeleteHandler}
            />
            <Footer
              value={filterValue}
              itemsLeft={itemsLeft}
              completedItemsLeft={completedItemsLeft}
              onFilter={setFilterValue}
              onClearCompleted={onClearCompletedHandler}
            />
          </>
        )}
      </div>

      <Notification
        message={errorMessage}
        onClearMessage={onClearMessageHandler}
      />
    </div>
  );
};
