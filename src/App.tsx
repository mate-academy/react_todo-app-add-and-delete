import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { getTodos, addTodo, handleDeleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/Error/ErrorNotification';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Filter } from './types/Filter';
import './App.scss';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoStatus, setTodoStatus]
    = useState<Filter>(Filter.All);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [todoTemplate, setTodoTemplate] = useState({
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
      setErrorMessage('Error!');

      setTimeout(() => {
        setHasError(false);
        setErrorMessage('');
      }, 3000);
    }
  }, []);

  const addNewTodo = useCallback(async (todoTitle: string) => {
    try {
      setIsAdding(true);

      if (user) {
        setTodoTemplate(current => ({
          ...current,
          title: todoTitle,
          userId: user.id,
        }));

        const newTodo = await addTodo({
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        setIsAdding(false);
        setTodos(currentTodos => [...currentTodos, newTodo]);
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to add a todo');
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      setSelectedId(current => [...current, id]);
      await handleDeleteTodo(id);
      await getTodosFromServer();
      setSelectedId([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete a todo');
    }
  }, []);

  const removeAllCompleted = async () => {
    try {
      setSelectedId(todos
        .filter(todo => todo.completed)
        .map(todo => todo.id));

      await Promise.all(todos.map(post => {
        return post.completed ? deleteTodo(post.id) : null;
      }));

      setSelectedId([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete todos');
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  useEffect(() => {
    setVisibleTodos(todos.filter(todo => {
      switch (todoStatus) {
        case Filter.Completed:
          return todo.completed;
        case Filter.Active:
          return !todo.completed;
        default:
          return true;
      }
    }));
  }, [todos, todoStatus]);

  const handleErrorClose = useCallback(() => setHasError(false), []);
  const handleStatusSelect = useCallback((status: Filter) => {
    setTodoStatus(status);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoField
          newTodoField={newTodoField}
          isAdding={isAdding}
          addNewTodo={addNewTodo}
          setErrorMessage={setErrorMessage}
          setHasError={setHasError}
          todos={todos}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              todoTemplate={todoTemplate}
              isAdding={isAdding}
              handleDeleteTodo={deleteTodo}
              selectedId={selectedId}
            />
            <TodoFilter
              todos={todos}
              filter={todoStatus}
              handleStatusSelect={handleStatusSelect}
              removeCompleted={removeAllCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        setHasError={setHasError}
        handleErrorClose={handleErrorClose}
        errorMessage={errorMessage}
      />
    </div>
  );
};
