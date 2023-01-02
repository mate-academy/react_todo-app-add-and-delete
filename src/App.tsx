/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Errors } from './types/Errors';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { getTodos, addTodo, removeTodo } from './api/todos';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.none);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.ALL);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTemp, setTodoTemp] = useState<Todo | null>(null);
  const [todosFiltered, setTodosFiltered] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTodoID, setActiveTodoID] = useState(-1);

  const closeError = () => setIsError(false);

  const showError = (message: Errors) => {
    setIsError(true);
    setErrorMessage(message);
    setTimeout(closeError, 3000);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (user) {
          await getTodos(user.id)
            .then(data => setTodos(data));
        }
      } catch (e) {
        showError(Errors.none);
      }
    })();

    const todosVisable = todos.filter(todo => {
      switch (filterBy) {
        case Filter.ACTIVE:
          return !todo.completed;

        case Filter.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });

    setTodosFiltered(todosVisable);
  }, [todos, filterBy]);

  const addNewTodo = async (title: string) => {
    try {
      if (user) {
        const tempTodo: Todo = {
          id: 0,
          userId: user.id,
          completed: false,
          title: `TEMPTODO ${title}`,
        };

        const newTodo: Todo = {
          id: todos.length,
          userId: user.id,
          completed: false,
          title,
        };

        setTodoTemp(tempTodo);

        setActiveTodoID(newTodo.id);
        await addTodo(newTodo);
        await setIsAdding(true);
        setActiveTodoID(-1);
      }
    } catch (e) {
      showError(Errors.load);
    } finally {
      setIsAdding(false);
      setTodoTemp(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setActiveTodoID(todoId);
      await removeTodo(todoId);
      setActiveTodoID(-1);
    } catch (e) {
      showError(Errors.delete);
    }
  };

  const clearTodo = async () => {
    try {
      const completedTodos: Todo[] = await todos.filter(todo => todo.completed);

      await completedTodos.map(async (todo: Todo) => {
        setActiveTodoID(todo.id);
        await deleteTodo(todo.id);
        setActiveTodoID(-1);
      });
    } catch (e) {
      showError(Errors.delete);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isAdding={isAdding}
          addNewTodo={addNewTodo}
          showError={showError}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todosFiltered}
              todoTemp={todoTemp}
              isAdding={isAdding}
              onDelete={deleteTodo}
              activeTodoID={activeTodoID}
            />
            <Footer
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              onDelete={clearTodo}
            />
          </>
        )}

        {isError && (
          <ErrorNotification
            isError={isError}
            error={errorMessage}
            onClose={closeError}
          />
        )}
      </div>
    </div>
  );
};
