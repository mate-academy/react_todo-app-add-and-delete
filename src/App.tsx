import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoNotification } from './components/TodoNotification';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { TodoStatus } from './types/TodoStatus';
import { Todo } from './types/Todo';

const USER_ID = 10509;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(TodoStatus.All);
  const [hasError, setHasError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedTodoIdList, setCompletedTodoIdList] = useState< number[]>([]);

  const showErrorMessage = (message: string) => {
    setHasError(true);
    setErrorMessage(message);
  };

  const handleCloseButton = useCallback(() => {
    setHasError(!hasError);
  }, [hasError]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasError(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showErrorMessage]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todoList => setTodos(todoList))
      .catch(() => showErrorMessage('Unable to load todos'));
  }, [USER_ID]);

  const visibleTodos = useMemo(() => {
    let visibleTodoArray = todos;

    switch (filterBy) {
      case TodoStatus.Active:
        visibleTodoArray = todos.filter(todo => !todo.completed);
        break;

      case TodoStatus.Completed:
        visibleTodoArray = todos.filter(todo => todo.completed);
        break;

      case TodoStatus.All:
      default:
        break;
    }

    return visibleTodoArray;
  }, [todos, filterBy]);

  const handleEnterKeyPress = useCallback((title: string) => {
    setTempTodo({
      id: Math.random(),
      userId: USER_ID,
      title,
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title,
      completed: false,
    })
      .then(fetchedTodo => setTodos(prevTodos => [...prevTodos, fetchedTodo]))
      .catch(() => showErrorMessage('Unable to add a todo'))
      .finally(() => setTempTodo(null));
  }, [todos]);

  const handleRemoveButtonClick = useCallback(async (todoId: number) => {
    setCompletedTodoIdList([todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      showErrorMessage('Unable to delete a todo');
    } finally {
      setCompletedTodoIdList([]);
    }
  }, [todos]);

  const activeTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [visibleTodos]);

  const handleFilterBy = useCallback((str: TodoStatus) => {
    setFilterBy(str);
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    const completedTodoIds = todos.filter(todo => todo.completed)
      .map(todo => todo.id);

    setCompletedTodoIdList(completedTodoIds);
    try {
      await Promise.all(completedTodoIds.map(todoId => deleteTodo(todoId)));

      setTodos(todos.filter(todo => !completedTodoIds.includes(todo.id)));
    } catch {
      showErrorMessage('Unable to delete the todos');
    } finally {
      setCompletedTodoIdList([]);
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          showErrorMessage={showErrorMessage}
          handleEnterKeyPress={handleEnterKeyPress}
          isTempTodoTrue={!!tempTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              completedTodoIdList={completedTodoIdList}
              onRemoveButtonClick={handleRemoveButtonClick}
            />
            <TodoFooter
              filterBy={filterBy}
              itemsLeft={activeTodosCount}
              handleFilterBy={handleFilterBy}
              clearCompletedTodos={clearCompletedTodos}
              completedTodos={todos.length - activeTodosCount}
            />
          </>
        )}
      </div>

      <TodoNotification
        handleCloseButton={handleCloseButton}
        errorMessage={errorMessage}
        hasError={hasError}
      />
    </div>
  );
};
