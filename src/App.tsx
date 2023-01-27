/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { createTodo, getTodos } from './api/todos';
import { ErrorOccured } from './components/ErrorOccured/ErrorOccured';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredStatus, setFilteredStatus] = useState(FilterStatus.ALL);
  const [isError, setIsError] = useState('');
  // const [loader, setLoader] = useState<number>(0);
  // const [loaderDeleting, setLoaderDeleting] = useState<number[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const showError = (text: string) => {
    setIsError(text);
    setTimeout(() => {
      setIsError('');
    }, 2000);
  };

  // const addTodo = async () => {
  //   if (newTodoTitle.trim().length === 0) {
  //     showError('Title can\'t be empty');

  //     return;
  //   }

  //   try {
  //     const newTodo = await createTodo(user?.id, newTodoTitle);

  //     setLoader(newTodo.id);

  //     setTodos((prevState) => {
  //       return [...prevState, newTodo];
  //     });
  //   } catch (error) {
  //     showError('Unable to add a todo');
  //   } finally {
  //     setTimeout(() => {
  //       setLoader(0);
  //     }, 1000);
  //   }
  // };

  const onAddTodo = useCallback(async (fieldsForCreate: Omit<Todo, 'id'>) => {
    setIsAddingTodo(true);

    try {
      const newTodo = await createTodo(fieldsForCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      showError('Unable to add a todo')

      throw Error('Error while adding todo')
    } finally {
      setIsAddingTodo(false);
    }
  }, [showError]);

  // const removeTodo = useCallback(async (todoId: number) => {
  //   setLoaderDeleting((prevState) => [...prevState, todoId]);

  //   try {
  //     await deleteTodo(todoId);
  //     setTodos(prev => prev.filter((x) => x.id !== todoId));
  //   } catch (error) {
  //     showError('Unable to delete a todo');
  //   }
  // }, []);

  // useEffect(() => {
  //   const loadTodos = async () => {
  //     try {
  //       const todosFromServer = await getTodos(user?.id);

  //       setTodos(todosFromServer);
  //     } catch {
  //       setIsError('Unable to load a todo');
  //     }
  //   };

  //   loadTodos();
  // }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setIsError('Something went wrong...'));
    }
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filteredStatus) {
        case FilterStatus.COMPLETED: {
          return todo.completed;
        }

        case FilterStatus.ACTIVE: {
          return !todo.completed;
        }

        default:
          return todo;
      }
    });
  }, [todos, filteredStatus]);

  const activeTodoQuantity = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   addTodo();
  //   setNewTodoTitle('');
  // };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={onAddTodo}
          isAddingTodo={isAddingTodo}
          showError={showError}
          newTodoField={newTodoField}
        />

        {todos.length > 0 && (
          <>
            <TodoList todos={filteredTodos} />

            <Footer
              activeTodoQuantity={activeTodoQuantity}
              filterType={filteredStatus}
              setFilteredStatus={setFilteredStatus}
            />
          </>
        )}
      </div>
      {isError && (
        <ErrorOccured
          error={isError}
          setIsError={setIsError}
        />
      )}
    </div>
  );
};
