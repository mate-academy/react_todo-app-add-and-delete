import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { deleteTodo, getTodos } from './api/todos';
import { filterTodos } from './helpers/filterTodos';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

import { Todo } from './types/Todo';

import { FilterType } from './enums/FilterType';
import { ErrorType } from './enums/ErrorType';
import { UserIdContext } from './contexts/UserIdContext';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterType.All);
  const [errorType, setErrorType] = useState(ErrorType.None);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [tempTodoTitle, setTempTodoTitle] = useState('');
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  const userId = useContext(UserIdContext);

  useEffect(() => {
    getTodos(userId)
      .then((userTodos) => setTodos(userTodos))
      .catch(() => {
        setErrorType(ErrorType.Download);
        setIsErrorShown(true);
      });
  }, []);

  const activeTodosNum = useMemo(
    () => (
      todos.reduce((num, todo) => {
        return todo.completed ? num : num + 1;
      }, 0)
    ),
    [todos],
  );
  const completedTodosNum = todos.length - activeTodosNum;

  const filteredTodos = useMemo(
    () => filterTodos(todos, selectedFilter),
    [selectedFilter, todos],
  );

  const showError = useCallback((error: ErrorType) => {
    setErrorType(error);
    setIsErrorShown(true);
  }, []);
  const hideError = useCallback(() => {
    setIsErrorShown(false);
  }, []);

  const onAddTodo = useCallback(
    (newTodo: Todo): void => setTodos((oldTodos) => [...oldTodos, newTodo]),
    [],
  );

  const onDeleteTodo = useCallback(
    (todoId: number): void => (
      setTodos((oldTodos) => oldTodos.filter((todo) => todo.id !== todoId))
    ),
    [],
  );

  const onClearCompleted = useCallback(() => {
    const completedTodos = filterTodos(todos, FilterType.Completed);

    setIsClearCompleted(true);
    hideError();

    Promise.all(
      completedTodos.map((todo) => deleteTodo(todo.id).then(() => todo.id)),
    )
      .then((ids) => {
        setTodos((oldTodos) => {
          return oldTodos.filter((todo) => !ids.includes(todo.id));
        });
      })
      .catch(() => {
        showError(ErrorType.Delete);
      })
      .finally(() => {
        setIsClearCompleted(false);
      });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeTodosNum={activeTodosNum}
          showError={showError}
          hideError={hideError}
          showTempTodo={setTempTodoTitle}
          addNewTodo={onAddTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodoTitle={tempTodoTitle}
          showError={showError}
          hideError={hideError}
          onDeleteTodo={onDeleteTodo}
          isClearCompleted={isClearCompleted}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeTodosNum={activeTodosNum}
            completedTodosNum={completedTodosNum}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorType={errorType}
        isErrorShown={isErrorShown}
        onCloseNotification={hideError}
      />
    </div>
  );
};
