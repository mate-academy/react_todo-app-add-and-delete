/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { NewTodoData, Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { FilterType } from './enum/FilterType';
import { USER_ID } from './utils/fetchClient';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoStatus, setTodoStatus] = useState<FilterType>(FilterType.All);
  const [hasErrorMessage, setHasErrorMessage] = useState(false);
  const [isLoadErrorMessage, setIsLoadErrorMessage] = useState(false);
  const [isAddErrorMessage, setIsAddErrorMessage] = useState(false);
  const [isDeleteErrorMessage, setIsDeleteErrorMessage] = useState(false);

  let timeout: ReturnType<typeof setTimeout>;

  const showError = useCallback(() => {
    setHasErrorMessage(true);
    timeout = setTimeout(() => {
      setHasErrorMessage(false);
    }, 3000);
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      showError();
      setIsLoadErrorMessage(true);
    }
  }, []);

  const addTodo = useCallback(async (newTodoData: NewTodoData) => {
    try {
      await createTodo(newTodoData);
    } catch {
      showError();
    }

    loadTodos();
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      await removeTodo(todoId);
    } catch {
      showError();
      setIsDeleteErrorMessage(true);
    }

    loadTodos();
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (todoStatus) {
        case FilterType.Active:
          return !completed;

        case FilterType.Completed:
          return completed;

        case FilterType.All:
        default:
          return todos;
      }
    });
  }, [todos, todoStatus]);

  const handleStatus = useCallback((filter: FilterType) => {
    setTodoStatus(filter);
  }, []);

  useEffect(() => {
    try {
      loadTodos();
    } catch {
      clearTimeout(timeout);
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          onTitleError={setIsAddErrorMessage}
          onError={showError}
        />

        <TodoList todos={filteredTodos} onDeleteTodo={deleteTodo} />

        <Footer
          todos={todos}
          onStatusSelect={handleStatus}
          todoStatus={todoStatus}
        />
      </div>

      {hasErrorMessage && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={() => setHasErrorMessage(false)}
          />

          {isLoadErrorMessage && <p>Unable to load data</p>}
          {isAddErrorMessage && <p>Unable to add empty todo</p>}
          {isDeleteErrorMessage && <p>Unable to delete todo</p>}
        </div>
      )}
    </div>
  );
};
