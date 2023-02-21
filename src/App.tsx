/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { TempTodo } from './types/TempTodo';
import {
  getTodos, addTodo, removeTodo, updateTodo,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { ErrorMessage } from './components/ErrorMessage';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [errorType, setErrorType] = useState<ErrorMessages>(ErrorMessages.None);
  const [isErrorHidden, setIsErrorHidden] = useState(true);
  const [updatingStage, setUpdatingStage] = useState<number[]>([]);
  const [editedTodoId, setEditedTodoId] = useState(0);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [isMainInputDisabled, setIsMainInputDisabled] = useState(false);

  const isSomeThingDone = todos.some((todo) => todo.completed);
  const activeTodosAmount = todos.filter((todo) => !todo.completed).length;

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch (error) {
      setErrorType(ErrorMessages.Load);
      setIsErrorHidden(false);
    }
  };

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [filterType, todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const timerId = setTimeout(setIsErrorHidden, 3000, true);

    return () => clearTimeout(timerId);
  }, [isErrorHidden]);

  const handleFiltering = useCallback((filter: FilterType) => {
    setFilterType(filter);
  }, []);

  const addTodoOnServer = async (title: string) => {
    try {
      setIsMainInputDisabled(true);
      const newTodo = await addTodo(title);

      setTodos((current) => [...current, newTodo]);
    } catch {
      setErrorType(ErrorMessages.Add);
    } finally {
      setIsMainInputDisabled(false);
      setTempTodo(null);
    }
  };

  const removeTodoFromServer = useCallback(async (todoId: number) => {
    try {
      setUpdatingStage((prev) => [...prev, todoId]);
      await removeTodo(todoId);
      await loadTodos();
    } catch (error) {
      setErrorType(ErrorMessages.Delete);
      setIsErrorHidden(false);
    } finally {
      setUpdatingStage((prev) => prev.filter((prevId) => prevId !== todoId));
    }
  }, []);

  const removeCompletedTodos = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosId.forEach(id => {
      removeTodoFromServer(id);
    });
  };

  const saveTempTodo = useCallback((todo: TempTodo) => {
    setTempTodo(todo);
  }, []);

  const updateTodoOnServer = useCallback(async (todo: Todo) => {
    try {
      setUpdatingStage(prev => [...prev, todo.id]);
      await updateTodo(todo);
      await loadTodos();
    } catch (error) {
      setErrorType(ErrorMessages.Update);
      setIsErrorHidden(false);
    } finally {
      setUpdatingStage(prev => prev.filter(id => id !== todo.id));
    }
  }, []);

  const selectAllTodos = (isEverythingDone: boolean) => {
    todos
      .filter((todo) => todo.completed !== isEverythingDone)
      .forEach((todo) => {
        updateTodoOnServer({
          ...todo,
          completed: isEverythingDone,
        });
      });
  };

  const toggleAllTodos = async (isEverythingDone: boolean) => {
    selectAllTodos(isEverythingDone);
  };

  const handleErrors = useCallback((error: ErrorMessages) => {
    setErrorType(error);
    setIsErrorHidden(false);
  }, []);

  const closeErrorMessage = useCallback(() => {
    setIsErrorHidden(true);
  }, []);

  const handleTodoEditor = useCallback((id: number) => {
    setEditedTodoId(id);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodoOnServer={addTodoOnServer}
          todos={todos}
          toggleAllTodos={toggleAllTodos}
          handleErrors={handleErrors}
          saveTempTodo={saveTempTodo}
          isMainInputDisabled={isMainInputDisabled}
        />

        <TodoList
          todos={filteredTodos}
          removeTodoFromServer={removeTodoFromServer}
          updateTodoOnServer={updateTodoOnServer}
          updatingStage={updatingStage}
          handleTodoEditor={handleTodoEditor}
          editedTodoId={editedTodoId}
          tempTodo={tempTodo}
        />

        <Footer
          filterType={filterType}
          removeCompletedTodos={removeCompletedTodos}
          handleFiltering={handleFiltering}
          isSomeThingDone={isSomeThingDone}
          activeTodosAmount={activeTodosAmount}
        />
      </div>

      {errorType && (
        <ErrorMessage
          errorType={errorType}
          isErrorHidden={isErrorHidden}
          closeErrorMessage={closeErrorMessage}
        />
      )}
    </div>
  );
};
