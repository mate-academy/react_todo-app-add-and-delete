/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { deleteTodos, getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { Error } from './components/Error';
import { USER_ID } from './types/ConstantTypes';

function filterTodos(todos: Todo[], selectedFilter: TodoStatus): Todo[] {
  return todos.filter((todo) => {
    switch (selectedFilter) {
      case TodoStatus.All:
        return true;

      case TodoStatus.Active:
        return !todo.completed;

      case TodoStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(TodoStatus.All);
  const [errorType, setErrorType] = useState(ErrorMessage.None);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [query, setQuery] = useState('');
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then((userTodos) => setTodos(userTodos))
      .catch(() => {
        setErrorType(ErrorMessage.Download);
        setIsErrorShown(true);
      });
  }, []);

  const counterActiveTodos = useMemo(
    () => todos.reduce((num, todo) => {
      return todo.completed ? num : num + 1;
    }, 0),
    [todos],
  );

  const counterCompletedTodos = todos.length - counterActiveTodos;

  const filteredTodos = useMemo(
    () => filterTodos(todos, selectedFilter),
    [selectedFilter, todos],
  );

  const showError = useCallback((error: ErrorMessage) => {
    setErrorType(error);
    setIsErrorShown(true);
  }, []);

  const hideError = useCallback(() => {
    setIsErrorShown(false);
  }, []);

  const AddTodo = useCallback(
    (newTodo: Todo): void => setTodos((oldTodos) => [...oldTodos, newTodo]),
    [],
  );

  const DeleteTodo = useCallback(
    (todoId: number): void => (
      setTodos((oldTodos) => oldTodos.filter(todo => todo.id !== todoId))
    ),
    [],
  );

  const onClearCompleted = useCallback(() => {
    const completedTodos = filterTodos(todos, TodoStatus.Completed);

    setIsClearCompleted(true);
    hideError();

    Promise.all(
      completedTodos.map((todo) => deleteTodos(todo.id).then(() => todo.id)),
    )
      .then((ids) => {
        setTodos((oldTodos) => {
          return oldTodos.filter((todo) => !ids.includes(todo.id));
        });
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
      })
      .finally(() => {
        setIsClearCompleted(false);
      });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          counterActiveTodos={counterActiveTodos}
          showError={showError}
          hideError={hideError}
          onAddQuery={setQuery}
          addNewTodo={AddTodo}
        />

        <TodoList
          todos={filteredTodos}
          query={query}
          showError={showError}
          hideError={hideError}
          DeleteTodo={DeleteTodo}
          isClearCompleted={isClearCompleted}
        />

        {todos.length > 0 && (
          <Filter
            counterActiveTodos={counterActiveTodos}
            counterCompletedTodos={counterCompletedTodos}
            selectedFilter={selectedFilter}
            onFilterSelect={setSelectedFilter}
            onClearCompleted={onClearCompleted}
          />
        )}

        <Error
          errorMessage={errorType}
          isErrorShown={isErrorShown}
          onErrorClose={() => setIsErrorShown(false)}
        />
      </div>
    </div>
  );
};
