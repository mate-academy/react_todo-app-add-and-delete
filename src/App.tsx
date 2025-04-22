/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { NotifyComponent } from './components/notification/notify.component';
import { text } from './constants/text';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { Statuses } from './types/Statuses';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [customError, setCustomError] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<Statuses>(Statuses.All);
  const [loadingId, setLoadingId] = useState<{ [key: number]: boolean }>({});
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCustomError('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setCustomError(text.unableToLoadTodos);
        const timerId = setTimeout(() => setCustomError(''), 3000);

        return () => clearTimeout(timerId);
      });
  }, []);

  const sortedTodoByStatus = useMemo(() => {
    return todos.filter(todo => {
      if (selectedStatus === Statuses.Completed) {
        return todo.completed;
      }

      if (selectedStatus === Statuses.Active) {
        return !todo.completed;
      }

      return todo;
    });
  }, [selectedStatus, todos]);

  const handleSelectTodo = (action: Statuses) => {
    setSelectedStatus(action);
  };

  const closeModal = () => {
    setCustomError('');
  };

  const handleLoaderId = (todo: Todo) => {
    setLoadingId(prevState => {
      const newState = { ...prevState };

      if (!newState[todo.id]) {
        newState[todo.id] = true;
      } else {
        delete newState[todo.id];
      }

      return newState;
    });
  };

  const handleDeleteCompletedTodo = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoIds = completedTodos.map(todo => {
      handleLoaderId(todo);

      return todo.id;
    });

    const promises = completedTodoIds.map(id =>
      deleteTodo(id)
        .then(() => ({ id, success: true }))
        .catch(() => ({ id, success: false })),
    );

    Promise.all(promises)
      .then(results => {
        completedTodos.forEach(todo => {
          handleLoaderId(todo);
        });
        setTodos(prevState =>
          prevState.filter(todo => {
            const result = results.find(r => r.id === todo.id);

            return !result || !result.success;
          }),
        );
        if (results.some(result => !result.success)) {
          setCustomError(text.unableToDeleteTodo);
        }

        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }
        }, 0);
      })
      .catch(err => {
        setCustomError(text.unableToDeleteTodo);
        completedTodos.forEach(todo => {
          handleLoaderId(todo);
        });
        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }
        }, 0);
        throw err;
      });
  };

  const isHaveOneCompleted = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">{text.todos}</h1>
      <HeaderComponent
        titleField={titleField}
        handleLoaderId={handleLoaderId}
        setCustomError={setCustomError}
        customError={customError}
        setTodos={setTodos}
      />

      <div className="todoapp__content">
        <TodoListComponent
          titleField={titleField}
          loadingId={loadingId}
          handleLoaderId={handleLoaderId}
          setTodos={setTodos}
          todos={sortedTodoByStatus}
          customError={customError}
          setCustomError={setCustomError}
        />
        <FooterComponent
          isHaveOneCompleted={isHaveOneCompleted}
          todos={todos}
          handleSelectTodo={handleSelectTodo}
          selectedStatus={selectedStatus}
          handleDeleteCompletedTodo={handleDeleteCompletedTodo}
        />
      </div>

      <NotifyComponent errorMessage={customError} closeModal={closeModal} />
    </div>
  );
};
