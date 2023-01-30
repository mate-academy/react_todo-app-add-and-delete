/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Todo } from './types/Todo';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { Filters, Footer } from './components/Footer/Footer';
import { Errors } from './components/Error/Error';
import { TodoList } from './components/TodoList/TodoList';
import { filteredTodos, getCompletedTodoIds } from './helpers/helpers';
import { todoApi } from './api/todos';

// email to check jklajsdf@adsf.com

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>({
    id: 0, completed: false, userId: 0, title: 'temptodo',
  });
  const [errorMessage, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState(Filters.ALL);
  const [isAddingTodo, setIsEddingTodo] = useState(false);
  const [delitingTodoIds, setDelitingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      todoApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => setError('Unable to load a todos'));
    }
  }, []);

  const activeTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const visibleTodos = useMemo(() => (
    filteredTodos(todos, filterStatus)
  ), [todos, filterStatus]);

  const onAddTodo = useCallback(async (fieldsForCreate: Omit<Todo, 'id'>) => {
    try {
      setIsEddingTodo(true);
      setTempTodo({
        ...fieldsForCreate,
        id: 0,
      });

      const newTodo = await todoApi.addTodo(fieldsForCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      setError('Unable to add a todo');

      throw Error('Error on adding todo');
    } finally {
      setTempTodo(null);
      setIsEddingTodo(false);
    }
  }, []);

  const onDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setDelitingTodoIds(prev => [...prev, todoId]);

      await todoApi.deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setDelitingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const onDeleteCompleted = useCallback(async () => {
    const completedTodoIds = getCompletedTodoIds(todos);

    completedTodoIds.forEach(id => onDeleteTodo(id), [onDeleteTodo, todos]);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          showError={() => setError('Title is required')}
          isAddingTodo={isAddingTodo}
          onAddTodo={onAddTodo}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={onDeleteTodo}
              delitingTodoIds={delitingTodoIds}
            />
            <Footer
              activeTodos={activeTodosCount}
              filter={filterStatus}
              onChange={setFilterStatus}
              onDeleteCompleted={onDeleteCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <Errors
          message={errorMessage}
          onHideError={setError}
        />
      )}
    </div>
  );
};
