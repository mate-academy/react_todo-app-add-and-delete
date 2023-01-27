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
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodoById } from './api/todos';
import { FilterType } from './types/FilterType';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodo, setFilterTodo] = useState(FilterType.all);
  const [error, setError] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setError('Unable to load a todos'));
    }
  }, []);

  const addNewTodo = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle) {
      setError('Title can\'t be empty');

      return;
    }

    const newTodoAdding = async () => {
      setIsAdding(true);

      if (user) {
        setTempTodo({
          id: 0,
          userId: user?.id,
          title: newTitle,
          completed: false,
        });

        try {
          const newTodo = await addTodo({
            userId: user.id,
            title: newTitle,
            completed: false,
          });

          setTempTodo(null);

          setTodos(currentTodos => [...currentTodos, newTodo]);

          setNewTitle('');
        } catch (e) {
          setError('Unable to add a todo');
        } finally {
          setIsAdding(false);
        }
      }
    };

    newTodoAdding();
  }, [newTitle]);

  const deleteTodo = useCallback(async (todoId: number) => {
    setDeletingTodosIds(prev => [...prev, todoId]);
    try {
      await deleteTodoById(todoId);

      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch (e) {
      setError('Unable to delete a todo');
    } finally {
      setDeletingTodosIds(prev => {
        return prev.filter(deletingId => deletingId !== todoId);
      });
    }
  }, []);

  const clearCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  const filteredTodos = useMemo(() => {
    switch (filterTodo) {
      case FilterType.active:
        return todos.filter(todo => !todo.completed);

      case FilterType.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filterTodo]);

  const activeTodosQuantity = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const completedTodosQuantity = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          newTodoField={newTodoField}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onAddNewTodo={addNewTodo}
          isAdding={isAdding}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              onTodoDelete={deleteTodo}
              deletingTodosIds={deletingTodosIds}
            />
            {tempTodo && (
              <TodoItem todo={tempTodo} />
            )}
            <Footer
              activeTodosQuantity={activeTodosQuantity}
              completedTodosQuantity={completedTodosQuantity}
              filterType={filterTodo}
              handleFilterChange={setFilterTodo}
              onDeleteComplited={clearCompletedTodos}
            />

          </>
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
          onChangeErrorMessage={setError}
        />
      )}
    </div>
  );
};
