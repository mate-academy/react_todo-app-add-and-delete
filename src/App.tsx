import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Header } from './components/Auth/Header';
import { AuthContext } from './components/Auth/AuthContext';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/Auth/TodoList';
import { Footer } from './components/Auth/Footer';
import { ErrorMessage } from './components/Auth/ErrorMessage';
import { FilterType } from './utils/enums/FilterType';
import { ErrorType } from './utils/enums/ErrorType';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.None);
  const [deletingId, setDeletingId] = useState(0);

  const loadTodos = useCallback(async () => {
    try {
      const userId = user
        ? user.id
        : 0;

      const loadedTodos = await getTodos(userId);

      const filteredTodos = loadedTodos.filter(todo => {
        switch (filterType) {
          case FilterType.Active:
            return !todo.completed;

          case FilterType.Completed:
            return todo.completed;

          default: return true;
        }
      });

      setTodos(loadedTodos);
      setVisibleTodos(filteredTodos);
    } catch {
      setErrorType(ErrorType.Load);

      setTimeout(() => {
        setErrorType(ErrorType.None);
      }, 3000);
    }
  }, [filterType]);

  const handleTodoAdding = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsAdding(true);

    try {
      if (user && newTodoTitle.trim()) {
        await createTodo(newTodoTitle, user.id);
        await loadTodos();
      } else {
        throw new Error('Can\'t add todo');
      }
    } catch {
      setErrorType(() => {
        return newTodoTitle.trim()
          ? ErrorType.Add
          : ErrorType.Empty;
      });

      setTimeout(() => {
        setErrorType(ErrorType.None);
      }, 3000);
    }

    setIsAdding(false);
    setNewTodoTitle('');
  };

  const handleTodoDeleting = async (todoId: number) => {
    setDeletingId(todoId);

    try {
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      setErrorType(ErrorType.Delete);
    } finally {
      setDeletingId(0);
    }
  };

  const onInput = (input: string) => {
    setNewTodoTitle(input);
  };

  const onClose = () => {
    setErrorType(ErrorType.None);
  };

  useEffect(() => {
    loadTodos();

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          newTodoTitle={newTodoTitle}
          onInput={onInput}
          addTodo={handleTodoAdding}
          isAdding={isAdding}
        />

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              tempTodoTitle={newTodoTitle}
              handleTodoDeleting={handleTodoDeleting}
              deletingId={deletingId}
            />
            <Footer
              filterType={filterType}
              todos={todos}
              onFilter={setFilterType}
            />
          </>
        )}
      </div>

      <ErrorMessage
        onClose={onClose}
        errorType={errorType}
      />
    </div>
  );
};
