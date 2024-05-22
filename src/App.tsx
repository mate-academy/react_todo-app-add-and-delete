import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, getDelete, getAdd } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';
import {Header} from "./components/Header/Header";
import {ErrorType} from "./types/Error";
import {Status} from "./types/Status";
import {todoFilter} from "./utils/todoFilter";
import {TodoList} from "./components/TodoList/TodoList";
import {Footer} from "./components/Footer/Footer";
import {ErrorMessage} from "./components/ErrorNotification/ErrorNotification";

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [titleNew, setTitleNew] = useState('');
  const [loadTodo, setLoadTodo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [sortField, setSortField] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeInput = useRef<HTMLInputElement>(null);

  const setErrorWithSetTimeout = (error: ErrorType) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
        .then(setTodos)
        .catch(() => {
          setErrorWithSetTimeout(ErrorType.UnableLoad);
        });
  }, []);

  useEffect(() => {
    activeInput.current?.focus();
  }, [todos, errorMessage]);

  const sortedTodos = todoFilter(todos, sortField);

  const onDelete = (todoId: number) => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(false);

    getDelete(todoId)
        .then(() => {
          setTodos(currentTodos =>
              currentTodos.filter(todo => todo.id !== todoId),
          );
        })
        .catch(() => {
          setErrorWithSetTimeout(ErrorType.UnableDelete);
        })
        .finally(() => {
          setIsDeleting(false);
        });
  };

  const createNewTodo = () => {
    if (!titleNew.trim()) {
      setErrorWithSetTimeout(ErrorType.EmptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      title: titleNew.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
      setLoadTodo(true);

    getAdd(newTodo)
        .then(created => {
          setTodos(currentTodos => [...currentTodos, created]);
          setTitleNew('');
        })
        .catch(() => {
          setErrorWithSetTimeout(ErrorType.UnableAdd);
        })
        .finally(() => {
          setTempTodo(null);
            setLoadTodo(false);
        });
  };

  const clearCompleted = () => {
    return todos.filter(todo => todo.completed).map(todo => onDelete(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <Header
              titleNew={titleNew}
              setTitleNew={setTitleNew}
              createNewTodo={createNewTodo}
              activeInput={activeInput}
              loadTodo={loadTodo}
          />

          <TodoList
              todos={sortedTodos}
              onDelete={isDeleting ? () => {} : onDelete}
          />

          {tempTodo && (
              <TodoItem todo={tempTodo} onDelete={onDelete} isTemp={true} />
          )}

          {todos.length > 0 && (
              <Footer
                  todos={todos}
                  sortField={sortField}
                  setSortField={setSortField}
                  clearCompleted={clearCompleted}
              />
          )}
        </div>

        <ErrorMessage
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
        />
      </div>
  );
};
