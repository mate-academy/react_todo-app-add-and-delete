/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { TodoInput } from './components/TodoInput';
import { TodoStatus } from './types/TodoStatus';
import { filterTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  // #region states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<TodoStatus>(
    TodoStatus.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [, setLoaderIsActive] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorId, setErrorId] = useState(0);
  const [todosLoadingError, setTodosLoadingError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [addError, setAddError] = useState(false);
  const [notificationIsHide, setNotificationIsHide] = useState(true);
  const [deleteError, setDeleteError] = useState(false);
  const [updateError] = useState(false);
  // #endregion

  // #region useEffect
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const getTodosList = async () => {
      try {
        const todosList = await getTodos();

        setVisibleTodos(todosList);
        setTodos(todosList);
      } catch {
        setIsError(true);
        setTodosLoadingError(true);
        throw new Error();
      }
    };

    getTodosList();
  }, []);

  useEffect(() => {
    if (
      todosLoadingError ||
      titleError ||
      addError ||
      deleteError ||
      updateError
    ) {
      setIsError(true);
      setErrorId(prev => prev + 1);
    }
  }, [todosLoadingError, titleError, addError, deleteError, updateError]);

  useEffect(() => {
    const filtered = filterTodos(todos, selectedFilterStatus);

    setVisibleTodos(filtered);
  }, [todos, selectedFilterStatus]);

  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  const checkError = () => {
    const errorsList = [];

    if (todosLoadingError) {
      errorsList.push('Unable to load todos');
    }

    if (titleError) {
      errorsList.push('Title should not be empty');
    }

    if (addError) {
      errorsList.push('Unable to add a todo');
    }

    if (deleteError) {
      errorsList.push('Unable to delete a todo');
    }

    if (updateError) {
      errorsList.push('Unable to update a todo');
    }

    return errorsList;
  };

  const handleCheckTodo = (id: number) => {
    setVisibleTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const removeTodo = async (todoToDelete: Todo) => {
    setActiveTodoId(todoToDelete.id);
    try {
      setLoaderIsActive(true);
      await deleteTodo(todoToDelete.id);

      setTodos(prev => prev.filter(todo => todo.id !== todoToDelete.id));
      setVisibleTodos(prev => prev.filter(todo => todo.id !== todoToDelete.id));
    } catch {
      setDeleteError(false);
      setTimeout(() => setDeleteError(true), 0);
      throw new Error();
    } finally {
      setLoaderIsActive(false);
      setActiveTodoId(null);
    }
  };

  const errors = checkError();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput
          setTitleError={setTitleError}
          todos={todos}
          setVisibleTodos={setVisibleTodos}
          setAddError={setAddError}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setNotificationIsHide={setNotificationIsHide}
        />
        <TodoList
          todos={todos}
          visibleTodos={visibleTodos}
          handleCheckTodo={handleCheckTodo}
          tempTodo={tempTodo}
          activeTodoId={activeTodoId}
          removeTodo={removeTodo}
        />
        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            setVisibleTodos={setVisibleTodos}
            selectedFilterStatus={selectedFilterStatus}
            setSelectedFilterStatus={setSelectedFilterStatus}
            removeTodo={removeTodo}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <ErrorNotification
        isError={isError}
        errors={errors}
        notificationIsHide={notificationIsHide}
        setNotificationIsHide={setNotificationIsHide}
        errorId={errorId}
      />
    </div>
  );
};
