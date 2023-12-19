import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { TodoMain } from './components/TodoMain';
import { TodoHeader } from './components/TodoHeader';
import { FilterType } from './types/FilterType';
import { TodoNotification } from './components/TodoNotification';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { ErrorType } from './types/ErrorType';

const USER_ID = 12031;

const filterTodos = (sourceTodos: Todo[], filterBy: FilterType) => {
  let filteredTodos: Todo[];

  switch (filterBy) {
    case FilterType.Active:
      filteredTodos = sourceTodos.filter(todo => !todo.completed);
      break;

    case FilterType.Completed:
      filteredTodos = sourceTodos.filter(todo => todo.completed);
      break;

    default:
      filteredTodos = [...sourceTodos];
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState<FilterType>(FilterType.All);

  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const [
    currentError,
    setCurrentError,
  ] = useState<ErrorType>(ErrorType.NoError);

  const timerId = useRef<NodeJS.Timeout>();

  const onError = (error: ErrorType) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    setCurrentError(error);
    timerId.current = setTimeout(
      () => setCurrentError(ErrorType.NoError),
      3000,
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    newTodoText: string,
    setNewTodoText: Dispatch<SetStateAction<string>>,
    inputRef: React.RefObject<HTMLInputElement>,
  ) => {
    event.preventDefault();

    if (!newTodoText.trim()) {
      onError(ErrorType.EmptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoText.trim(),
      completed: false,
    };

    try {
      setTempTodo(() => newTodo);
      await addTodo(newTodo)
        .then((todo) => setTodosFromServer(
          prevTodos => ([...prevTodos, todo]),
        ))
        .then(() => {
          setNewTodoText('');
        });
    } catch {
      onError(ErrorType.UnableToAdd);
    } finally {
      setTempTodo(() => null);

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleSingleTodoDelition = (todoId: number) => {
    try {
      setSelectedTodoIds(prevIds => [...prevIds, todoId]);

      deleteTodo(todoId).then(() => {
        setTodosFromServer(
          prevTodos => prevTodos.filter(todo => todo.id !== todoId),
        );
      });
    } catch {
      onError(ErrorType.UnableToDelete);
    } finally {
      setTimeout(
        () => setSelectedTodoIds(ids => ids.splice(ids.indexOf(todoId), 1)),
        500,
      );
    }
  };

  const handleCompletedTodosDelition = () => {
    const completedTodoIds = todosFromServer
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    try {
      setSelectedTodoIds(prev => [...prev, ...completedTodoIds]);

      completedTodoIds.forEach((todoId) => {
        deleteTodo(todoId).then(() => {
          setTodosFromServer(
            prevTodos => prevTodos.filter(todo => todo.id !== todoId),
          );
        });
      });
    } catch {
      onError(ErrorType.UnableToDelete);
    } finally {
      setTimeout(
        () => setSelectedTodoIds(
          ids => ids.filter(id => !completedTodoIds.includes(id)),
        ),
        500,
      );
    }
  };

  useEffect(() => {
    setCurrentError(ErrorType.NoError);
    getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => (onError(ErrorType.UnableToLoad)));
  }, []);

  const filteredTodos = useMemo(
    () => filterTodos(todosFromServer, selectedFilter),
    [todosFromServer, selectedFilter],
  );

  const activeTodosCount = todosFromServer.reduce((acc, todo) => {
    if (todo.completed) {
      return acc;
    }

    return acc + 1;
  }, 0);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isAnyTodoActive={!!activeTodosCount}
          isNewLoading={!!tempTodo}
          handleSubmit={handleSubmit}
        />

        <TodoMain
          todos={filteredTodos}
          tempTodo={tempTodo}
          selectedTodoIds={selectedTodoIds}
          onDelete={handleSingleTodoDelition}
        />

        {(todosFromServer.length !== 0 || tempTodo) && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            isAnyTodoCompleted={activeTodosCount !== todosFromServer.length}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            onClearCompleted={handleCompletedTodosDelition}
          />
        )}
      </div>

      <TodoNotification
        currentError={currentError}
        setCurrentError={setCurrentError}
      />
    </div>
  );
};
