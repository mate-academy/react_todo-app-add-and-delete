/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { getTodos, getActiveTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './components/Filter/Filter';
import { NewTodo } from './components/NewTodo/NewTodo';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [getErrorStatus, setGetErrorStatus] = useState(false);
  const [postErrorStatus, setPostErrorStatus] = useState(false);
  const [activeTodos, setActiveTodos] = useState<Todo[] | null>(null);
  const [allTodos, setAllTodos] = useState<Todo[] | null>(null);
  const [visibleTodos, setVisibleTodos] = useState<Todo[] | null>(null);
  const [emptyTitleError, setEmptyTitleError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(0);
  const [deleteErrorStatus, setDeleteErrorStatus] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const setErrorStatus = (errorType: (boolean: boolean) => void) => {
    errorType(true);
    setTimeout(() => errorType(false), 3000);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(userTodos => {
          setVisibleTodos(userTodos);
          setAllTodos(userTodos);
        })
        .catch(() => setErrorStatus(setGetErrorStatus));

      getActiveTodos(user.id)
        .then(userTodos => setActiveTodos(userTodos));
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          activeTodos={activeTodos}
          allTodos={allTodos}
          setEmptyTitleError={setEmptyTitleError}
          setErrorStatus={setErrorStatus}
          setVisibleTodos={setVisibleTodos}
          setIsAdding={setIsAdding}
          isAdding={isAdding}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          setPostErrorStatus={setPostErrorStatus}

        />
        <TodoList
          visibleTodos={visibleTodos}
          isAdding={isAdding}
          currentInput={currentInput}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          setVisibleTodos={setVisibleTodos}
          setDeleteErrorStatus={setDeleteErrorStatus}
          setErrorStatus={setErrorStatus}
        />

        <Filter
          allTodos={allTodos}
          activeTodos={activeTodos}
          setVisibleTodos={setVisibleTodos}
          visibleTodos={visibleTodos}
        />
      </div>

      <ErrorNotification
        postErrorStatus={postErrorStatus}
        setPostErrorStatus={setPostErrorStatus}
        getErrorStatus={getErrorStatus}
        setGetErrorStatus={setGetErrorStatus}
        emptyTitleError={emptyTitleError}
        setEmptyTitleError={setEmptyTitleError}
        deleteErrorStatus={deleteErrorStatus}
        setDeleteErrorStatus={setDeleteErrorStatus}
      />
    </div>
  );
};
