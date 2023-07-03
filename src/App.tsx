import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { LoadError } from './types/LoadError';
import { FilterType } from './Enums/FilterType';
import { filterTodos } from './utils/filterTodos';
import { NewTodoForm } from './components/NewTodoForm';
import { PostTodo } from './types/PostTodo';

export const USER_ID = 10895;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [loadError, setError] = useState<LoadError>({
    status: false,
    message: '',
  });
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inLoadTodosID, setInLoadTodosID] = useState<number[]>([]);

  const preparedTodos = useMemo(() => (
    filterTodos(todos, filterType)
  ), [filterType, todos]);

  const isTodosExists = todos.length > 0;

  const fetchTodos = useCallback(async () => {
    try {
      const responce = await getTodos(USER_ID);

      setTodos(responce);
    } catch (error) {
      setError({
        status: true,
        message: 'Unable to load a todos, retry later',
      });
    }
  }, []);

  const addNewTodo = useCallback(async (title: string) => {
    const newTodo: PostTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    try {
      const newSuccesfulTodo = await postTodo(newTodo);

      setTempTodo(null);
      setTodos(currentTodos => ([
        ...currentTodos,
        newSuccesfulTodo,
      ]));

      return true;
    } catch (error) {
      setError({
        status: true,
        message: 'Failed to add new Todo, try again...',
      });
      setTempTodo(null);

      return false;
    }
  }, []);

  const removeTodos = useCallback(async (todoID: number[]) => {
    try {
      setInLoadTodosID(todoID);
      await Promise.all(
        todoID.map(async (deleteId) => {
          await deleteTodo(deleteId);
        }),
      );

      setTodos(current => (
        current.filter(todo => !todoID.includes(todo.id))
      ));
      setInLoadTodosID([]);
    } catch (error) {
      setInLoadTodosID([]);
      setError({
        status: true,
        message: 'Unable to delete todos',
      });
    }
  }, []);

  const deleteTodoByID = useCallback((id: number) => {
    removeTodos([id]);
  }, [removeTodos]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {isTodosExists && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              aria-label="Toggle all"
            />
          )}

          {/* Add a todo on form submit */}
          <NewTodoForm
            addNewTodo={addNewTodo}
            setError={setError}
          />
        </header>

        {isTodosExists && (
          <TodoList
            todos={preparedTodos}
            tempTodo={tempTodo}
            inLoadTodosID={inLoadTodosID}
            deleteTodoByID={deleteTodoByID}
          />
        )}

        {isTodosExists && (
          <Footer
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            removeTodos={removeTodos}
          />
        )}
      </div>

      <ErrorNotification
        loadError={loadError}
        setError={setError}
      />
    </div>
  );
};
