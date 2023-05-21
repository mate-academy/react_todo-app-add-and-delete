import {
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { SortTypes } from './types/SortTypes';
import { TodoError } from './types/TodoError';
import { USER_ID } from './consts/consts';
import { Loader } from './components/Loader';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter] = useState<SortTypes>(SortTypes.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [isEditedTodo] = useState(false);
  const [todoId, setTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleError = (message: TodoError) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const loadTodos = useCallback(async () => {
    setIsloading(true);
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error: unknown) {
      handleError(TodoError.LOAD);
    }

    setIsloading(false);
  }, []);

  const addTodo = useCallback(async (todoData: Todo) => {
    setTodoId(0);
    setTempTodo(todoData);

    try {
      const newTodo = await createTodo({
        title: todoData.title,
        completed: false,
        userId: USER_ID,
      });

      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch {
      handleError(TodoError.LOAD);
    }

    setTempTodo(null);
    setTodoId(null);
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await removeTodo(id);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch {
      handleError(TodoError.DELETE);
    }
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    try {
      const completedTodos = todos.filter(({ completed }) => completed);

      await Promise.all(completedTodos.map(({ id }) => removeTodo(
        id,
      )));

      setTodos((prevTodos) => prevTodos.filter(({ completed }) => !completed));
    } catch {
      handleError(TodoError.DELETE);
    }
  }, []);

  const vissibleTodos = todos.filter((todo) => {
    switch (activeFilter) {
      case SortTypes.Active:
        return !todo.completed;

      case SortTypes.Completed:
        return todo.completed;

      case SortTypes.All:
        return true;

      default: return true;
    }
  });

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          handleError={handleError}
          onAddTodo={addTodo}
        />

        {isLoading && !todos.length && <Loader />}
        <TodoList
          todos={vissibleTodos}
          isEdited={isEditedTodo}
          todoId={todoId}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
          setTodoId={setTodoId}
        />

        {/* {todos.length > 0 && ( */}
        <Footer
          todos={todos}
          onChangeFilter={setActiveFilter}
          activeFilter={activeFilter}
          onClearCompletedTodos={clearCompletedTodos}
        />
        {/* )} */}
      </div>

      {errorMessage && (
        <Notification
          message={errorMessage}
        />
      )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
