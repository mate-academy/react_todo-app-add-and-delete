/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodosList } from './components/TodosList';
import { TodosSelection } from './components/TodosSelection';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodosSelections } from './types/TodosSelections';
import { ErrorHandler } from './types/ErrorHandler';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [hasError, setHasError] = useState<ErrorHandler>(ErrorHandler.None);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterSelector, setFilterSelector]
    = useState<TodosSelections>(TodosSelections.All);
  const [isAdding, setIsAdding] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [todosRemovingIds, setTodosRemovingIds]
    = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });
  const isTodosAvailable = todos.length > 0;

  const closeErrorField = () => (
    setHasError(ErrorHandler.None)
  );

  const getTodosFromServer = useCallback(
    async () => {
      try {
        if (user) {
          const todosFromServer = await getTodos(user.id);

          setTodos(todosFromServer);
          setFilteredTodos(todosFromServer);
        }
      } catch (error) {
        setHasError(ErrorHandler.LoadError);
      }
    }, [],
  );

  const addTodoToServer = useCallback(
    async () => {
      try {
        if (!todoTitle.trim()) {
          setHasError(ErrorHandler.EmptyTitle);

          return;
        }

        setIsAdding(true);

        const addingData = {
          title: todoTitle,
          userId: user?.id || 0,
          completed: false,
        };

        setTempTodo((currentTodo) => ({
          ...currentTodo,
          ...addingData,
        }));

        await createTodo(addingData);
        await getTodosFromServer();

        setIsAdding(false);
        setTodoTitle('');
      } catch (error) {
        setIsAdding(false);
        if (error === ErrorHandler.EmptyTitle) {
          setHasError(ErrorHandler.EmptyTitle);
        } else {
          setHasError(ErrorHandler.AddError);
        }
      }
    }, [todoTitle],
  );

  const removeTodoFromServer = useCallback(
    async (todoId: number) => {
      try {
        setTodosRemovingIds(prevIds => [...prevIds, todoId]);
        await removeTodo(todoId);
        await getTodosFromServer();
      } catch (error) {
        setHasError(ErrorHandler.DeleteError);
      }
    }, [todos],
  );

  const removeAllCompletedTodos = useCallback(
    () => {
      const completedTodos = todos.filter(todo => todo.completed);

      completedTodos.forEach(todo => removeTodoFromServer(todo.id));
    }, [todos],
  );

  useEffect(() => {
    setTimeout(() => setHasError(ErrorHandler.None), 3000);
  }, [hasError]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  useEffect(() => {
    const filteredBySelection = todos.filter(todo => {
      switch (filterSelector) {
        case TodosSelections.Active:
          return !todo.completed;

        case TodosSelections.Completed:
          return todo.completed;

        default:
          return true;
      }
    });

    setFilteredTodos(filteredBySelection);
  }, [todos, filterSelector]);

  const handleTodoTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const remainCompletedTodos = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isTodosAvailable={isTodosAvailable}
          newTodoField={newTodoField}
          todoTitle={todoTitle}
          setTodoTitle={handleTodoTitleInput}
          addTodo={addTodoToServer}
          isAdding={isAdding}
        />
        {isTodosAvailable && (
          <>
            <TodosList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isAdding={isAdding}
              onDelete={removeTodoFromServer}
              todosToDelete={todosRemovingIds}
            />
            <TodosSelection
              setFilterSelector={setFilterSelector}
              remainCompletedTodos={remainCompletedTodos}
              filterSelector={filterSelector}
              todosLength={todos.length}
              deleteAllCompletedTodos={removeAllCompletedTodos}
            />
          </>
        )}
      </div>
      <ErrorNotification
        hasError={hasError}
        hideError={closeErrorField}
      />
    </div>
  );
};
