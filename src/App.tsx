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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditedTodo, setIsEditet] = useState(false);
  const [todoId, setTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleError = (message: TodoError) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const loadTodos = useCallback(async () => {
    try {
      setIsloading(true);
      const response = await getTodos(USER_ID);

      setTodos(response);
      setIsloading(false);
    } catch (error: unknown) {
      handleError(TodoError.LOAD);
    }
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
    const completedTodos = todos.filter((todo) => todo.completed);

    try {
      await Promise.all(completedTodos.map((todo) => removeTodo(
        todo.id,
      )));

      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    } catch {
      handleError(TodoError.DELETE);
    }
  }, []);

  const vissibleTodos = todos.filter((todo) => {
    switch (activeFilter) {
      case SortTypes.Active:
      case SortTypes.AllCompleted:
        return !todo.completed;

      case SortTypes.Completed:
        return todo.completed;

      default: return true;
    }
  });

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          onAddTodo={addTodo}
          onError={handleError}
        />

        {isLoading && <Loader />}
        <TodoList
          todos={vissibleTodos}
          isEdited={isEditedTodo}
          onDelete={deleteTodo}
          todoId={todoId}
          setTodoId={setTodoId}
          tempTodo={tempTodo}
        />

        <Footer
          todos={vissibleTodos}
          onChangeFilter={setActiveFilter}
          activeFilter={activeFilter}
          onClearCompletedTodos={clearCompletedTodos}
        />
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
