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
import { Errors } from './components/Errors';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [filterValue, setFilterValue] = useState('All');
  const [countActive, setCountActive] = useState(0);
  const [tempTodo, setTempTodo] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: '',
  });

  const handleError = (isError: boolean, message: string) => {
    setError({ isError, message });

    if (message) {
      setTimeout(() => {
        setError({ isError: false, message: '' });
      }, 3000);
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  (async function loadTodos() {
    try {
      const getTodos
        = await client.get<Todo[]>(`/todos?userId=${user?.id}`);

      setTodos(getTodos);
      setVisibleTodos(getTodos);
    } catch (e) {
      handleError(true, 'Unable to load todos');
    }
  }());

  const countActiveTodos = () => {
    const count = todos.filter(todo => !todo.completed).length;

    setCountActive(count);
  };

  useMemo(() => countActiveTodos(), [todos]);

  const filterTodos = (value: string) => {
    switch (value) {
      case 'All':
        setFilterValue('All');
        setVisibleTodos(todos);
        break;
      case 'Active':
        setFilterValue('Active');
        setVisibleTodos(todos.filter(todo => !todo.completed));
        break;
      case 'Completed':
        setFilterValue('Completed');
        setVisibleTodos(todos.filter(todo => todo.completed));
        break;
      default:
        break;
    }
  };

  useMemo(() => filterTodos(filterValue), [todos]);

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
      handleError(true, 'Unable to add todo');
    }

    setTempTodo({});
  };

  const deleteTodo = async (id: number) => {
    setIsDeleting(true);
    try {
      await client.delete(`/todos/${id}`);

      setTodos(state => (
        state.filter(todo => todo.id !== id)
      ));
    } catch (e) {
      handleError(true, 'Unable to remove todo');
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

        {todos.length > 0 && (
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
