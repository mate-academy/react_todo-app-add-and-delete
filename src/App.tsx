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
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';
import { TodoPostData } from './types/TodoPostData';

const USER_ID = 10308;

const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);
const postTodo = (data: TodoPostData) => client.post<Todo>(`/todos?userId=${USER_ID}`, data);
const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);

const prepareTodos = (todoList: Todo[], filterType: FilterType) => (
  todoList.filter(todo => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return !todo.completed;

      case FilterType.COMPLETED:
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
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [errorType, setErrorType] = useState(ErrorType.NONE);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [todoInputValue, setTodoInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getTodoList = useCallback(async () => {
    const todos = await getTodos();

    setTodoList(todos);
  }, []);

  const preparedTodos = useMemo(() => (
    prepareTodos(todoList || [], filterType)
  ), [todoList, filterType]);

  const activeTodosCount = useMemo(() => (
    getActiveTodosCount(todoList || [])
  ), [todoList]);

  const areCompletedTodos = todoList
    ? activeTodosCount < todoList.length
    : false;

  const handleFilterChange = (newFilterType: FilterType) => {
    setFilterType(newFilterType);
  };

  const handleTodoInputChange = (value: string) => {
    setIsErrorShown(false);

    setTodoInputValue(value);
  };

  const executePostTodo = () => {
    const addedTodo = {
      title: todoInputValue,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...addedTodo,
    });

    postTodo(addedTodo)
      .then(response => {
        const {
          id,
          title,
          userId,
          completed,
        } = response;
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
      })
      .catch(() => {
        setErrorType(ErrorType.ADD);
        setIsErrorShown(true);
        throw new Error('Add todo error');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleAddTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoInputValue.trim().length === 0) {
      setIsErrorShown(true);
      setErrorType(ErrorType.TITLE);

      return;
    }

    setIsAddDisabled(true);
    executePostTodo();
    setIsAddDisabled(false);
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingId(todoId);

    try {
      await deleteTodo(todoId);

      const newList = todoList && todoList.filter(({ id }) => todoId !== id);

      setTodoList(newList);
    } catch (error) {
      setErrorType(ErrorType.DELETE);
      setIsErrorShown(true);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseError = () => {
    setIsErrorShown(false);
  };

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
              onDeleteClick={handleDeleteTodo}
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
        isErrorShown={isErrorShown}
        onCloseClick={handleCloseError}
      />
    </div>
  );
};
