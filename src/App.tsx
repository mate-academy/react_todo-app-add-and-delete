import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoIdsToRemove, setTodoIdsToRemove] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });

  const getTodosFromServer = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Can`t download ToDos from server');
    }
  }, []);

  const addNewTodoToServer = useCallback(async (title: string) => {
    try {
      if (user) {
        setIsAdding(true);
        setTempTodo(prev => ({
          ...prev,
          title,
          userId: user.id,
        }));

        const addedTodo = await addTodo({
          title,
          userId: user.id,
          completed: false,
        });

        setTodos(prev => ([...prev, addedTodo]));
        setIsAdding(false);
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to add a todo');
    }
  }, []);

  const removeTodoFromServer = useCallback(async (todoId: number) => {
    try {
      if (user) {
        setTodoIdsToRemove(currIds => [...currIds, todoId]);

        await deleteTodo(todoId);

        setTodos(currTodos => (
          currTodos.filter(({ id }) => id !== todoId)
        ));

        setTodoIdsToRemove(currTodos => (
          currTodos.filter((id) => id !== todoId)
        ));
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to remove ToDo');
    }
  }, []);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed)
  ), [todos]);

  const removeAllCompletedTodos = useCallback(async () => {
    try {
      await Promise.all(completedTodos.map(async ({ id }) => (
        removeTodoFromServer(id)
      )));
    } catch (error) {
      setErrorMessage('Unable to remove all completed todo');
      setHasError(true);
    }
  }, [completedTodos]);

  const filteredTodos = useMemo(() => (
    todos.filter(({ completed }) => {
      switch (filterType) {
        case FilterType.Active:
          return !completed;

        case FilterType.Completed:
          return completed;

        default:
          return true;
      }
    })
  ), [todos, filterType]);

  const closeNotification = useCallback(() => setHasError(false), []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setHasError(false);
    }, 3000);
  }, [hasError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          setHasError={setHasError}
          setErrorMessage={setErrorMessage}
          addNewTodo={addNewTodoToServer}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          (
            <>
              <TodoList
                todos={filteredTodos}
                removeTodo={removeTodoFromServer}
                isAdding={isAdding}
                tempTodo={tempTodo}
                todoIdsToRemove={todoIdsToRemove}
              />

              <Footer
                filterType={filterType}
                setFilterType={setFilterType}
                todosLength={todos.length}
                completedTodos={completedTodos.length}
                onRemove={removeAllCompletedTodos}
              />
            </>
          )
        )}
      </div>

      <Error
        hasError={hasError}
        onClose={closeNotification}
      >
        {errorMessage}
      </Error>
    </div>
  );
};
