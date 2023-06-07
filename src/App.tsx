/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  MutableRefObject,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { Footer } from './components/Footer';
import { FilterValues } from './types/FilterValues';
import { ErrorValues } from './types/ErrorValues';
import { Notification } from './components/Notification';
import { ErrorContext } from './context/ErrorContextProvider';

const USER_ID = 10544;

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState(FilterValues.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedTodosID, setCompletedTodosID] = useState<number[]>([]);
  const [todosForDeleting, setTodosForDeleting] = useState<number[]>([]);
  const errorContext = useContext(ErrorContext);
  const inputHeaderRef = useRef() as MutableRefObject<HTMLInputElement>;
  const leftTodosCount
    = todosFromServer?.filter(todo => !todo.completed).length || 0;

  const filteredTodos = (todos: Todo[], value: FilterValues) => {
    return todos.filter(todo => {
      switch (value as FilterValues) {
        case FilterValues.Completed:
          return todo.completed;
        case FilterValues.Active:
          return !todo.completed;
        case FilterValues.All:
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => {
        setTodosFromServer(res);
      })
      .catch(() => {
        errorContext.setErrorMessage(ErrorValues.Loading);
      });
  }, []);

  useEffect(() => {
    setCompletedTodosID(todosFromServer
      .filter(todo => todo.completed)
      .map(todo => todo.id));
  }, [todosFromServer]);

  const todosAfterFilter = useMemo(() => {
    return filteredTodos(todosFromServer, filterValue);
  }, [todosFromServer, filterValue]);

  const handleAddingTodos = (inputValue: string) => {
    const newTodo = {
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    addTodo(USER_ID, newTodo)
      .then(res => setTodosFromServer(prevTodos => [...prevTodos, res]))
      .catch(() => errorContext.setErrorMessage(ErrorValues.Adding))
      .finally(() => {
        inputHeaderRef.current.disabled = false;
        inputHeaderRef.current.focus();
        setTempTodo(null);
      });
  };

  const handleDeletingTodo = (id: number) => {
    setTempTodo({
      id,
      userId: 0,
      title: '',
      completed: false,
    });
    removeTodo(USER_ID, id)
      .then(() => setTodosFromServer(prevTodos => prevTodos
        .filter(todo => todo.id !== id)))
      .catch(() => errorContext.setErrorMessage(ErrorValues.Deleting))
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeletingCompletedTodos = (idsForDeleting: number[]) => {
    setTodosForDeleting([...idsForDeleting]);
    idsForDeleting.forEach(id => handleDeletingTodo(id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          leftTodosCount={leftTodosCount}
          handleAddingTodos={handleAddingTodos}
          inputHeaderRef={inputHeaderRef}
        />
        {todosAfterFilter && (
          <>
            <TodoList
              todosAfterFilter={todosAfterFilter}
              handleDeletingTodo={handleDeletingTodo}
              tempTodo={tempTodo}
              todosForDeleting={todosForDeleting}
            />

            <Footer
              leftTodosCount={leftTodosCount}
              setFilterValue={setFilterValue}
              handleDeletingCompletedTodos={handleDeletingCompletedTodos}
              completedTodosID={completedTodosID}
            />
          </>
        )}
      </div>
      <Notification />
    </div>
  );
};
