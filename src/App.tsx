import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { FilterComponent } from './components/FilterComponent';
import { TodoList } from './components/Todo/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { AddForm } from './components/AddForm';
import { ErrorType } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);
  const [errorText, setErrorText] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const user = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const getTodosFromServer = async (userId: number) => {
        try {
          const receivedTodos = await getTodos(userId);

          setTodos(receivedTodos);
        } catch (error) {
          setErrorText(`${error}`);
        }
      };

      getTodosFromServer(user.id);
    }
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filterBy]);

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorText(ErrorType.TITLE);
      setErrorStatus(true);

      return;
    }

    setIsAdding(true);

    try {
      if (user) {
        const newTodo = await createTodo(user.id, title);

        setTodos((prevTodos) => [...prevTodos, newTodo]);
        setIsAdding(false);
      }
    } catch {
      setErrorText(ErrorType.ADD);
    }

    setTitle('');
  }, [title, user]);

  const deleteTodo = useCallback(async (todoId: number) => {
    setSelectedIds([todoId]);

    try {
      await removeTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorText(ErrorType.DELETE);
    }
  }, [todos, errorText]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const deleteCompletedTodos = useCallback(async () => {
    setSelectedIds(completedTodos.map(({ id }) => id));

    try {
      await Promise.all(completedTodos.map(({ id }) => removeTodo(id)));

      setTodos(prevTodos => prevTodos
        .filter(({ completed }) => !completed));
    } catch {
      setErrorText(ErrorType.DELETE);
      setSelectedIds([]);
    }
  }, [completedTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddForm
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
              isAdding={isAdding}
              selectedId={selectedIds}
              title={title}
            />
            <FilterComponent
              todos={filteredTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorStatus={errorStatus}
        setErrorStatus={setErrorStatus}
        errorText={errorText}
      />
    </div>
  );
};
