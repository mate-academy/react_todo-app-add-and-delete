import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import {
  getCompletedTodoIds, getFilteredTodos,
} from './components/helper/helpers';
import { useError } from './controllers/useError';
import { todoApi } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [
    showError, closeErrorMessage, errorMessages,
  ] = useError();
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo]
    = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      todoApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Todos are not loaded'));
    }
  }, [user]);

  const onAddTodo = useCallback(async (fieldsForCreate: Omit<Todo, 'id'>) => {
    try {
      setIsAddingTodo(true);
      setTempTodo({
        ...fieldsForCreate,
        id: 0,
      });
      const newTodo = await todoApi.addTodo(fieldsForCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      showError('Unable to add a todo');

      throw Error('Error while addind todo');
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
    }
  }, [showError]);

  const onDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodoIds(prev => [...prev, todoId]);

      await todoApi.deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId))
    } catch {
      showError('Todo is not deleted');
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }, [showError]);

  const onDeleteCompleted = useCallback(async () => {
    const completedTodoIds = getCompletedTodoIds(todos);

    completedTodoIds.forEach(id => onDeleteTodo(id));
  }, [onDeleteTodo, todos]);

  const hasCompletedTodo = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const amountOfActiveTodo = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  const shouldRenderContent = todos.length > 0 || !!tempTodo;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          showError={showError}
          isAddingTodo={isAddingTodo}
          onAddTodo={onAddTodo}
        />

        {shouldRenderContent && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={onDeleteTodo}
              deletingTodoIds={deletingTodoIds}
            />

            <Footer
              activeTodosAmount={amountOfActiveTodo}
              hasCompletedTodos={hasCompletedTodo}
              filterType={filterType}
              setFilterType={setFilterType}
              onDeleteCompleted={onDeleteCompleted}
            />
          </>
        )}
      </div>

      {errorMessages.length > 0 && (
        <ErrorNotification
          messages={errorMessages}
          close={closeErrorMessage}
        />
      )}
    </div>
  );
};
