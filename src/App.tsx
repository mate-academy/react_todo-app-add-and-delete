/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Errors } from './types/Error';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { filterTodos } from './helpers/helpers';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.None);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage(Errors.LoadError));
    }
  }, [user]);

  const visibleTodos = useMemo(() => filterTodos(todos, filterType),
    [filterType, todos]);

  const uncompletedTodosAmount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const onAddTodo = useCallback(async (data: Omit<Todo, 'id'>) => {
    setIsAdding(true);

    try {
      setTempTodo({
        id: 0,
        ...data,
      });

      const newTodo = await addTodo(data);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      setErrorMessage(Errors.AddError);

      throw Error(Errors.AddError);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  }, []);

  const onDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodoIds(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(Errors.DeleteError);
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const onDeleteCompletedTodos = useCallback(async () => {
    const completedTodosIds = completedTodos.map(todo => todo.id);

    completedTodosIds.forEach(id => onDeleteTodo(id));
  }, [completedTodos, onDeleteTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          isAdding={isAdding}
          onAddTodo={onAddTodo}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={onDeleteTodo}
              deletingTodoIds={deletingTodoIds}
            />

            <Footer
              uncompletedTodosAmount={uncompletedTodosAmount}
              filterType={filterType}
              setFilterType={setFilterType}
              completedTodos={completedTodos}
              onDeleteCompletedTodos={onDeleteCompletedTodos}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
