import {
  FC, useContext, useEffect, useRef, useState, useMemo,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

export const App: FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorNotification, setErrorNotification] = useState('');
  const [filterBy, setFilterBy] = useState<TodosFilter>(TodosFilter.None);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });

  const activeTodos = useMemo(() => (
    todos.filter(({ completed }) => completed === false)
  ), [todos]);

  const handleTodosFilter = (filter: TodosFilter) => {
    switch (filter) {
      case TodosFilter.Completed:
        setVisibleTodos(todos.filter(({ completed }) => completed === true));
        break;
      case TodosFilter.Active:
        setVisibleTodos(activeTodos);
        break;

      default:
        setVisibleTodos(todos);
    }
  };

  const getAllTodos = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
        setVisibleTodos(todosFromServer);
      }
    } catch (error) {
      setIsError(true);
    }
  };

  const addTodoToServer = async (todoTitle: string) => {
    if (user) {
      try {
        setTempTodo(currTodo => ({
          ...currTodo,
          userId: user.id,
          title: todoTitle,
        }));
        setIsAdding(true);

        await addTodo(user.id, todoTitle);
        await getAllTodos();
      } catch (error) {
        setIsError(true);
        setErrorNotification('Unable to add a todo');
      } finally {
        setIsAdding(false);
      }
    }
  };

  const deleteTodosFromServer = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      getAllTodos();
    } catch (error) {
      setIsError(true);
      setErrorNotification('Unable to delete a todo');
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getAllTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => setIsError(false), 3000);
  }, [isError]);

  const handleErrorChange = () => {
    setIsError(currError => !currError);
  };

  const handleErrorNotification = (str: string) => {
    setErrorNotification(str);
  };

  const handleFilterChange = (filter: TodosFilter) => {
    handleTodosFilter(filter);
    setFilterBy(filter);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isAdding={isAdding}
          addTodoToServer={addTodoToServer}
          errorChange={handleErrorChange}
          ErrorNotification={handleErrorNotification}
        />

        {todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              deleteTodo={deleteTodosFromServer}
              isAdding={isAdding}
              tempTodo={tempTodo}

            />

            <Footer
              numberOfActive={activeTodos.length}
              handleFilter={handleFilterChange}
              filterBy={filterBy}

            />
          </>
        )}
      </div>

      {isError && (
        <ErrorMessage
          errorNotification={errorNotification}
          errorChange={handleErrorChange}
        />
      )}
    </div>
  );
};
