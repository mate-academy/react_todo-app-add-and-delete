import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { todoApi } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { filterTodosByCompleted, getCompletedTodoIds } from './helpers/helpers';
import { TodoErrors } from './types/Errors';
import { Todo } from './types/Todo';
import { useError } from './controllers/useError';
import { FilterStatus } from './types/Filterstatus';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [isAdding, setIsAdding] = useState(false);
  const completedTodos = todos.filter(todo => todo.completed === true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const [showError, closeError, errorMessages] = useError();

  const uncompletedTodosAmount = useMemo(() => {
    const uncompleted = todos.filter(todo => !todo.completed);

    return uncompleted.length;
  }, [todos]);

  useEffect(() => {
    if (user) {
      todoApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => showError(TodoErrors.UnableToLoad));
    }
  }, [user]);

  const onAddTodo = useCallback(async (fieldsForCreate: Omit<Todo, 'id'>) => {
    try {
      setIsAdding(true);
      setTempTodo({ ...fieldsForCreate, id: 0 });
      const newTodo = await todoApi.addTodo(fieldsForCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      showError(TodoErrors.UnableToAddTodo);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  }, [showError]);

  const onDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodoIds(prev => [...prev, todoId]);

      await todoApi.deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showError(TodoErrors.UnableToDeleteTodo);
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }, [showError]);

  const onDeleteCompleted = useCallback( async () => {
    const completedTodoIds = getCompletedTodoIds(todos);

    completedTodoIds.forEach(id => onDeleteTodo(id));
  }, [onDeleteTodo, todos]);

  const visibleTodos = useMemo(() => (
    filterTodosByCompleted(todos, filterStatus)
  ), [filterStatus, todos]);

  const shoultRenderContent = todos.length !== 0 || !!tempTodo;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          showError={showError}
          isAdding={isAdding}
          onAddTodo={onAddTodo}
        />

        {shoultRenderContent && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={onDeleteTodo}
              deletingTodoIds={deletingTodoIds}
            />
            <Footer
              completedTodos={completedTodos}
              uncompletedTodosAmount={uncompletedTodosAmount}
              setFilterStatus={setFilterStatus}
              filterStatus={filterStatus}
              onDeleteCompleted={onDeleteCompleted}
            />
          </>
        )}
      </div>
      {errorMessages.length > 0 && (
        <ErrorNotification
          errorMessages={errorMessages}
          closeError={closeError}
        />
      )}
    </div>
  );
};
