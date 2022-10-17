/* eslint-disable no-console */
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer/Footer';
import { FilterValues } from './types/FilterValues';
import { Errors } from './components/Errors';
import { ErrorMessages } from './types/Error';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState(FilterValues.All);
  const [countActive, setCountActive] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: ErrorMessages.None,
  });

  const handleError = (isError: boolean, message: ErrorMessages) => {
    setError({ isError, message });

    if (message) {
      setTimeout(() => {
        setError({ isError: false, message: ErrorMessages.None });
      }, 3000);
    }
  };

  async function loadTodos() {
    try {
      const getTodos
        = await client.get<Todo[]>(`/todos?userId=${user?.id}`);

      setTodos(getTodos);
      setCountActive(
        (getTodos.filter(todo => !todo.completed)).length,
      );
    } catch (e) {
      handleError(true, ErrorMessages.ErrorLoadTodos);
    }
  }

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const countActiveTodos = () => {
    const count = todos.filter(todo => !todo.completed).length;

    setCountActive(count);
  };

  useMemo(() => countActiveTodos(), [todos]);

  const filterTodos = (value: string) => {
    const { All, Active, Completed } = FilterValues;
    const filteredTodos = [...todos];

    switch (value) {
      case Active:
        setFilterValue(Active);

        return filteredTodos.filter(todo => !todo.completed);

      case Completed:
        setFilterValue(Completed);

        return filteredTodos.filter(todo => todo.completed);
      default:
        setFilterValue(All);

        return filteredTodos;
    }
  };

  const visibleTodos = useMemo(
    () => filterTodos(filterValue),
    [todos, filterValue],
  );

  const addTodo = async (value: string) => {
    if (!user) {
      return;
    }

    const data = {
      userId: user.id,
      title: value,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...data,
    });

    try {
      const todoData = await client.post<Todo>('/todos', data);

      setTodos(state => (
        [
          ...state,
          todoData,
        ]
      ));
      setCountActive(countActive + 1);
    } catch (e) {
      handleError(true, ErrorMessages.ErrorAddTodo);
    }

    setTempTodo(null);
  };

  const deleteTodo = async (id: number) => {
    setIsDeleting(true);
    try {
      await client.delete(`/todos/${id}`);

      setTodos(state => (
        state.filter(todo => todo.id !== id)
      ));
    } catch (e) {
      handleError(true, ErrorMessages.ErrorRemove);
    }

    setIsDeleting(false);
  };

  const clearCompleted = async () => {
    const removeTodos = todos.filter(todo => todo.completed);

    if (removeTodos.length === 0) {
      return;
    }

    removeTodos.forEach(todo => deleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoField={newTodoField}
          addTodo={addTodo}
          handleError={handleError}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          isDeleting={isDeleting}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterTodos={filterTodos}
            countActive={countActive}
            filterValue={filterValue}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <Errors
        error={error}
        handleError={handleError}
      />
    </div>
  );
};
