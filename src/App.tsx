import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useError } from './controllers/useError';
import { addTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedFilter, setCompletedFilter] = useState(FilterType.All);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const [showError, closeErroreMessage, errorMessages] = useError();

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
        .catch(() => showError('Unable to load a todos'));
    }
  }, [user]);

  const onAddTodo = useCallback(async (fieldsToCreate: Omit<Todo, 'id'>) => {
    setIsAddingTodo(true);

    try {
      const newTodo = await addTodo(fieldsToCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      showError('Unable to add a todo');

      throw Error('Error while adding todo');
    } finally {
      setIsAddingTodo(false);
    }
  }, [showError]);

  const visibleFiltredTodos = useMemo(() => {
    switch (completedFilter) {
      case FilterType.Active:
        return todos.filter(todo => (
          !todo.completed
        ));

      case FilterType.Completed:
        return todos.filter(todo => (
          todo.completed
        ));

      default:
        return todos;
    }
  }, [completedFilter, todos]);

  const ActiveTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed)).length, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          showError={showError}
          isAddingTodo={isAddingTodo}
          onAddTodo={onAddTodo}
        />

        {todos.length > 0
          && (
            <>
              <TodoList todos={visibleFiltredTodos} />
              <Footer
                activeTodosCount={ActiveTodosCount}
                completedFilter={completedFilter}
                setCompletedFilter={setCompletedFilter}
              />
            </>
          )}
      </div>

      {
        errorMessages.length > 0 && (
          <ErrorNotification
            messages={errorMessages}
            close={closeErroreMessage}
          />
        )
      }
    </div>
  );
};
