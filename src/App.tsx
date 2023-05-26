import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoAppHeader } from './components/TodoAppHeader/TodoAppHeader';
import { TodoAppContent } from './components/TodoAppContent/TodoAppContent';
import { TodoAppFooter } from './components/TodoAppFooter/TodoAppFooter';
import { Notifications } from './components/Notifications/Notifications';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';
import {
  USER_ID,
  getTodos,
  postTodo,
  deleteTodo,
} from './api/todos';

const prepareTodos = (todoList: Todo[], filterType: FilterType) => (
  todoList.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        return true;
    }
  })
);

const getActiveTodosCount = (todoList: Todo[]) => (
  todoList.filter(todo => !todo.completed).length
);

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[] | null>(null);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [errorType, setErrorType] = useState(ErrorType.None);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [todoInputValue, setTodoInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getTodoList = async () => {
    const todos = await getTodos();

    setTodoList(todos);
  };

  const preparedTodos = useMemo(() => (
    prepareTodos(todoList || [], filterType)
  ), [todoList, filterType]);

  const activeTodosCount = useMemo(() => (
    getActiveTodosCount(todoList || [])
  ), [todoList]);

  const areCompletedTodos = todoList
    ? activeTodosCount < todoList.length
    : false;

  const handleFilterChange = useCallback((newFilterType: FilterType) => {
    setFilterType(newFilterType);
  }, []);

  const handleTodoInputChange = useCallback((value: string) => {
    setIsErrorShown(false);

    setTodoInputValue(value);
  }, [todoList]);

  const executePostTodo = useCallback(async () => {
    const postedTodo = {
      title: todoInputValue,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...postedTodo,
    });

    try {
      const {
        id,
        title,
        userId,
        completed,
      } = await postTodo(postedTodo);

      const newTodo = {
        id,
        title,
        userId,
        completed,
      };

      setTodoList(currentList => (
        currentList
          ? [...currentList, newTodo]
          : [newTodo]
      ));
    } catch {
      setErrorType(ErrorType.Add);
      setIsErrorShown(true);
    } finally {
      setTempTodo(null);
    }
  }, [todoInputValue]);

  const handleAddTodo = useCallback(async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (todoInputValue.trim().length === 0) {
      setIsErrorShown(true);
      setErrorType(ErrorType.Title);

      return;
    }

    setIsAddDisabled(true);
    await executePostTodo();
    setIsAddDisabled(false);
    setTodoInputValue('');
  }, [todoInputValue]);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setDeletingId(todoId);

    try {
      await deleteTodo(todoId);

      const newList = todoList && todoList.filter(({ id }) => todoId !== id);

      setTodoList(newList);
    } catch (error) {
      setErrorType(ErrorType.Delete);
      setIsErrorShown(true);
    } finally {
      setDeletingId(null);
    }
  }, [todoList]);

  const handleCloseError = useCallback(() => {
    setIsErrorShown(false);
  }, []);

  useEffect(() => {
    getTodoList();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoAppHeader
          activeTodosCount={activeTodosCount}
          todoInputValue={todoInputValue}
          isAddDisabled={isAddDisabled}
          onInputChange={handleTodoInputChange}
          onSubmit={handleAddTodo}
        />

        {preparedTodos && (
          <>
            <TodoAppContent
              todoList={preparedTodos}
              tempTodo={tempTodo}
              deletingId={deletingId}
              onDelete={handleDeleteTodo}
            />

            <TodoAppFooter
              filterType={filterType}
              activeTodosCount={activeTodosCount}
              areCompletedTodos={areCompletedTodos}
              onFilterChange={handleFilterChange}
            />
          </>
        )}
      </div>

      <Notifications
        errorType={errorType}
        isError={isErrorShown}
        onClose={handleCloseError}
      />
    </div>
  );
};
