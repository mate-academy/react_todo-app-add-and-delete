import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { addTodo, getTodos, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodosSelection } from './components/TodosSelection';
import { Todo } from './types/Todo';
import { TodosStatus } from './types/TodosStatus';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosStatus, setTodosStatus] = useState<TodosStatus>(TodosStatus.All);
  const [isAdding, setIsAdding] = useState(false);
  const [todoIdsToRemove, setTodoIdsToRemove] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });

  const filteredTodos = useMemo(() => (
    todos.filter(todo => {
      switch (todosStatus) {
        case TodosStatus.Active:
          return !todo.completed;

        case TodosStatus.Completed:
          return todo.completed;

        default:
          return todo;
      }
    })
  ), [todos, todosStatus]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const closeErrorNotification = useCallback(() => (
    setHasError(false)
  ), []);

  const getTodosFromServer = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to get todos');
    }
  };

  const addTodoToServer = async (todoTitle: string) => {
    if (user) {
      try {
        setIsAdding(true);
        setTempTodo(currentTemp => ({
          ...currentTemp,
          title: todoTitle,
          userId: user.id,
        }));

        const addedTodo = await addTodo({
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        setIsAdding(false);
        setTodos(currentTodos => [...currentTodos, addedTodo]);
      } catch (error) {
        setHasError(true);
        setErrorMessage('Unable to add a todo');
      }
    }
  };

  const removeTodoFromServer = async (todoId: number) => {
    try {
      setTodoIdsToRemove(currentIds => [...currentIds, todoId]);

      await removeTodo(todoId);

      setTodos(currentTodos => (
        currentTodos.filter(({ id }) => id !== todoId)
      ));

      setTodoIdsToRemove(currentIds => (
        currentIds.filter(id => id !== todoId)
      ));
    } catch (error) {
      setHasError(true);
      setErrorMessage(`Unable to remove todo ${todoId}`);
    }
  };

  const removeAllCompletedTodos = async () => {
    try {
      await Promise.all(completedTodos.map(({ id }) => (
        removeTodoFromServer(id)
      )));
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to remove all completed todos');
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
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          newTodoField={newTodoField}
          isAdding={isAdding}
          setHasError={setHasError}
          setErrorMessage={setErrorMessage}
          addTodoToServer={addTodoToServer}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              isAdding={isAdding}
              tempTodo={tempTodo}
              todoIdsToRemove={todoIdsToRemove}
              removeTodoFromServer={removeTodoFromServer}
            />

            <TodosSelection
              todosStatus={todosStatus}
              setTodosStatus={setTodosStatus}
              todosLength={todos.length}
              completedTodosLength={completedTodos.length}
              removeAllCompletedTodos={removeAllCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        errorMessage={errorMessage}
        closeErrorNotification={closeErrorNotification}
      />
    </div>
  );
};
