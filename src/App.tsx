import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import './App.scss';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoNotification }
  from './components/TodoNotification/TodoNotification';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { filterTodos } from './Helpers';
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 6795;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState(FilterOptions.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodosId, setDeletingTodosId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.LoadError);
      });
  }, []);

  const visibleTodos = useMemo(() => filterTodos(todos, filterOption),
    [filterOption, todos]);

  const activeVisibleTodos = useMemo(
    () => filterTodos(todos, FilterOptions.ACTIVE),
    [todos],
  );
  const completedVisibleTodos = useMemo(
    () => filterTodos(todos, FilterOptions.COMPLETED),
    [todos],
  );
  const isTodosPresent = todos.length > 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleNewTodoTitleChange
  = (event: React.ChangeEvent<HTMLInputElement>) => (
    setNewTodoTitle(event.target.value)
  );

  const clearNewTodoTitle = () => (
    setNewTodoTitle('')
  );

  const addNewTodo = async (title: string) => {
    if (!title) {
      setErrorMessage(ErrorMessages.TitleError);

      return null;
    }

    try {
      const newTodoPayload = {
        completed: false,
        title,
        userId: USER_ID,
      };

      setTempTodo({
        id: 0,
        ...newTodoPayload,
      });

      const newTodo = await createTodo(newTodoPayload);

      clearNewTodoTitle();
      setTodos((prevState) => [...prevState, newTodo]);

      return newTodo;
    } catch (error) {
      setErrorMessage(ErrorMessages.TitleError);

      return null;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setDeletingTodosId((prevState) => [...prevState, todoId]);

      const removeResult = await removeTodo(todoId);

      if (!removeResult) {
        setErrorMessage(ErrorMessages.DeleteError);

        return;
      }

      setTodos((prevState) => {
        const resultState = prevState.filter(todo => todo.id !== todoId);

        return [...resultState];
      });
    } catch (error) {
      setErrorMessage(ErrorMessages.DeleteError);
    } finally {
      setDeletingTodosId([]);
    }
  };

  const removeCompletedTodos = (todosToDelete: Todo[]) => {
    todosToDelete.forEach(async todoToDelete => {
      await deleteTodo(todoToDelete.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isTodosPresent={isTodosPresent}
          newTodoTitle={newTodoTitle}
          handleNewTodoTitleChange={handleNewTodoTitleChange}
          addNewTodo={addNewTodo}
        />

        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          deletingTodoId={deletingTodosId}
        />

        {isTodosPresent
        && (
          <TodoFooter
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            activeVisibleTodosLength={activeVisibleTodos.length}
            completedVisibleTodos={completedVisibleTodos}
            deleteTodos={removeCompletedTodos}
          />
        )}
      </div>

      <TodoNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

    </div>
  );
};
