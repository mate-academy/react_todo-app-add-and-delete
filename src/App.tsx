/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoIDsForDeleting, setTodoIdsForDeleting] = useState<number[]>([]);

  const activeTodosQuantity = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const isAnyTodoCompleted = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterStatus) {
        case FilterStatus.Active:
          return !todo.completed;

        case FilterStatus.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filterStatus]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage('Something went wrong'));
    }
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorMessage('Title can\'t be empty');

        return;
      }

      const addNewTodo = async () => {
        setIsAdding(true);

        if (user) {
          try {
            setTempTodo({
              id: 0,
              userId: user.id,
              title,
              completed: false,
            });

            const newTodo = await addTodo({
              userId: user.id,
              title,
              completed: false,
            });

            setTitle('');

            setTodos(currentTodos => [...currentTodos, newTodo]);
          } catch (error) {
            setErrorMessage('Unable to add a todo');
          } finally {
            setIsAdding(false);
            setTempTodo(null);
          }
        }
      };

      addNewTodo();
    }, [title],
  );

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setTodoIdsForDeleting(currentTodoIds => (
        [...currentTodoIds, todoId]
      ));

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setTodoIdsForDeleting(currentTodoIds => (
        currentTodoIds.filter(id => id !== todoId)));
    }
  }, []);

  const clearAllCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          isAdding={isAdding}
          onChange={setTitle}
          onSubmit={handleSubmit}
          newTodoField={newTodoField}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              todoIDsForDeleting={todoIDsForDeleting}
              onRemoving={removeTodo}
            />

            {tempTodo
              && (
                <TodoItem
                  todo={tempTodo}
                  isAdding={isAdding}
                  onRemoving={removeTodo}
                />
              )}

            <Footer
              filterStatus={filterStatus}
              isAnyTodoCompleted={isAnyTodoCompleted}
              activeTodosQuantity={activeTodosQuantity}
              onClear={clearAllCompletedTodos}
              onFilterStatusChange={setFilterStatus}
            />
          </>
        )}

      </div>

      <ErrorNotification
        error={errorMessage}
        onClosingErrorMessage={setErrorMessage}
      />
    </div>
  );
};
