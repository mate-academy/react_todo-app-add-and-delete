/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorType } from './types/ErrorType';
import { GroupBy } from './types/GroupBy';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  const loadTodos = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setError(ErrorType.LOAD);
      }
    }
  }, []);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      setIsAdding(true);

      try {
        if (!todoTitle.trim().length) {
          setError(ErrorType.TITLE);
          setIsAdding(false);

          return;
        }

        await addTodo(todoTitle, user.id);
        await loadTodos();

        setIsAdding(false);
        setTodoTitle('');
      } catch {
        setError(ErrorType.ADD);
        setIsAdding(false);
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletedTodoIds([todoId]);

    try {
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      setError(ErrorType.DELETE);
    }
  };

  const handleDeleteCompletedTodos = async () => {
    try {
      const completedTodoIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setDeletedTodoIds(completedTodoIds);

      await Promise.all(todos.map(async (todo) => {
        if (todo.completed) {
          await deleteTodo(todo.id);
        }

        return todo;
      }));

      await loadTodos();
    } catch {
      setError(ErrorType.DELETE);
    }
  };

  const handleGroupBy = useCallback((status: GroupBy) => {
    setGroupBy(status);
  }, []);

  const handleChangeTodoTitle = useCallback((title: string) => {
    setTodoTitle(title);
  }, []);

  const handleCloseError = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  useEffect(() => {
    const filteredTodos = todos.filter(({ completed }) => {
      switch (groupBy) {
        case GroupBy.COMPLETED:
          return completed;

        case GroupBy.ACTIVE:
          return !completed;

        default:
          return true;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [todos, groupBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          todoTitle={todoTitle}
          onChangeTodoTitle={handleChangeTodoTitle}
          submitNewTodo={handleAddTodo}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              todoTitle={todoTitle}
              onDeleteTodo={handleDeleteTodo}
              deletedTodoIds={deletedTodoIds}
            />

            <Footer
              groupBy={groupBy}
              onGroup={handleGroupBy}
              onDeleteCompletedTodos={handleDeleteCompletedTodos}
              todos={todos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onCloseError={handleCloseError}
      />
    </div>
  );
};
