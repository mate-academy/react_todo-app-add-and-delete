import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { TodosSelection } from './components/TodosSelection/TodosSelection';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';

import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilter';
import { addTodo, getTodos, removeTodo } from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoIdsToRemove, setTodoIdsToRemove] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });
  const [
    statusToFilter,
    setStatusToFilter,
  ] = useState<TodosFilter>(TodosFilter.All);

  const closeNotification = useCallback(() => setHasError(false), []);

  const filtredTodos = useMemo(() => (
    todos.filter(({ completed }) => {
      switch (statusToFilter) {
        case TodosFilter.Active:
          return !completed;

        case TodosFilter.Completed:
          return completed;

        default:
          return true;
      }
    })
  ), [todos, statusToFilter]);

  const completedTodos = useMemo(() => (
    todos.filter((todo) => todo.completed)
  ), [todos]);

  const getTodosFromServer = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      setErrorMessage('Unable to show todos');
      setHasError(true);
    }
  };

  const addTodoToServer = async (todoTitle: string) => {
    if (user) {
      try {
        setIsAdding(true);
        setTempTodo(currTemp => ({
          ...currTemp,
          title: todoTitle,
          userId: user.id,
        }));

        const addedTodo = await addTodo({
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        setIsAdding(false);
        setTodos(currTodos => [...currTodos, addedTodo]);
      } catch (error) {
        setErrorMessage('Unable to add todo');
        setHasError(true);
      }
    }
  };

  const removeTodoFromServer = async (todoId: number) => {
    try {
      setTodoIdsToRemove(currIds => [...currIds, todoId]);

      await removeTodo(todoId);

      setTodos(currTodos => (
        currTodos.filter(({ id }) => id !== todoId)
      ));

      setTodoIdsToRemove(currIds => (
        currIds.filter((id) => id !== todoId)
      ));
    } catch (error) {
      setErrorMessage(`Unable to remove todo ${todoId}`);
      setHasError(true);
    }
  };

  const removeAllCompletedTodos = async () => {
    try {
      await Promise.all(completedTodos.map(({ id }) => (
        removeTodoFromServer(id)
      )));
    } catch (error) {
      setErrorMessage('Unable to remove all completed todo');
      setHasError(true);
    }
  };

  useEffect(() => {
    setTimeout(() => setHasError(false), 3000);
  }, [hasError]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        todos
      </h1>

      <div className="todoapp__content">
        <TodoForm
          newTodoField={newTodoField}
          addTodoToServer={addTodoToServer}
          isAdding={isAdding}
          setErrorMessage={setErrorMessage}
          setHasError={setHasError}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              filtredTodos={filtredTodos}
              isAdding={isAdding}
              tempTodo={tempTodo}
              todoIdsToRemove={todoIdsToRemove}
              removeTodoFromServer={removeTodoFromServer}
            />

            <TodosSelection
              completedTodosLength={completedTodos.length}
              todosLength={todos.length}
              statusToFilter={statusToFilter}
              setStatusToFilter={setStatusToFilter}
              removeAllCompletedTodos={removeAllCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        closeNotification={closeNotification}
      >
        {errorMessage}
      </ErrorNotification>
    </div>
  );
};
