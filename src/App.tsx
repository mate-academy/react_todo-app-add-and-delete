import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { USER_ID, deleteTodo, getTodos, uploadTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { ErrorType } from './types/Errors';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { emptyTodo } from './utils/EmptyTodo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTodoStatus, setSelectedTodoStatus] = useState<TodoStatus>(
    TodoStatus.All,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorType | ''>('');
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInputField = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const filteringTodosByActiveStatus = useMemo(
    () => [...todos].filter(todo => !todo.completed),
    [todos],
  );

  const filteringTodosByCompletedStatus = useMemo(
    () => [...todos].filter(todo => todo.completed),
    [todos],
  );

  const filteredTodos = useMemo(() => {
    switch (selectedTodoStatus) {
      case TodoStatus.Active:
        return filteringTodosByActiveStatus;

      case TodoStatus.Completed:
        return filteringTodosByCompletedStatus;

      default:
        return todos;
    }
  }, [
    filteringTodosByActiveStatus,
    filteringTodosByCompletedStatus,
    selectedTodoStatus,
    todos,
  ]);

  const changeTodoTitleHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setErrorMessage('');
      setTodoTitle(e.target.value);
    },
    [],
  );

  const closeErrorHandler = () => {
    setErrorMessage('');
  };

  const handleStatusChange = (status: TodoStatus) => {
    setSelectedTodoStatus(status);
  };

  const addTodo = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!todoTitle.trim().length) {
        setErrorMessage(ErrorType.EMPTY_TITLE);

        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      const newTempTodo: Todo = { ...emptyTodo, title: todoTitle.trim() };

      setTempTodo(newTempTodo);
      setProcessingTodos([newTempTodo.id]);

      try {
        const todo = await uploadTodo({
          ...emptyTodo,
          title: todoTitle.trim(),
        });

        setTodos(currentTodos => [...currentTodos, todo]);
        setTodoTitle('');
      } catch {
        setErrorMessage(ErrorType.ADD_TODO);
      } finally {
        setIsLoading(false);
        setTempTodo(null);
        setProcessingTodos([]);
        focusInputField();
      }
    },
    [todoTitle],
  );

  const removeTodo = useCallback((id: number) => {
    setErrorMessage('');
    setProcessingTodos((prev: number[]) => [...prev, id]);

    deleteTodo(id)
      .then(() =>
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id)),
      )
      .catch(() => setErrorMessage(ErrorType.DELETE_TODO))
      .finally(() => {
        setProcessingTodos((prev: number[]) =>
          prev.filter(prevItem => prevItem !== id),
        );
        focusInputField();
      });
  }, []);

  const removeTodos = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    const deletePromises = filteringTodosByCompletedStatus.map(todo => {
      setProcessingTodos((prev: number[]) => [...prev, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
          );
        })
        .catch(() => {
          setErrorMessage(ErrorType.DELETE_TODO);
        })
        .finally(() => {
          setProcessingTodos((prev: number[]) =>
            prev.filter(prevItem => prevItem !== todo.id),
          );
          focusInputField();
        });
    });

    await Promise.allSettled(deletePromises);
    setIsLoading(false);
  }, [filteringTodosByCompletedStatus]);

  useEffect(() => {
    focusInputField();
  }, [todoTitle, todos, selectedTodoStatus, isLoading]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorType.LOAD_TODOS));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          value={todoTitle}
          addTodo={addTodo}
          onChange={changeTodoTitleHandler}
          inputRef={inputRef}
          isLoading={isLoading}
        />
        <TodoList
          preparedTodos={filteredTodos}
          processingTodos={processingTodos}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
        />

        <Footer
          todos={todos}
          selectedStatus={selectedTodoStatus}
          onStatusChange={handleStatusChange}
          filteringTodosByActiveStatus={filteringTodosByActiveStatus.length}
          filteringTodosByCompletedStatus={
            filteringTodosByCompletedStatus.length
          }
          removeTodos={removeTodos}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage.length === 0 },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeErrorHandler}
        />
        {errorMessage}
      </div>
    </div>
  );
};
