import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';

import { ErrorOnPage } from './components/ErrorOnPage';

import { FilterBy } from './utils/FilterBy';
import { Todo } from './types/Todo';
import { getTodos, createTodo, removeTodo } from './todos';

import { getFilteredTodos } from './utils/NewFilterTodos';

import { ErrorMessages } from './types/ErrorNessages';

const USER_ID = 1333;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [newError, setNewError] = useState<ErrorMessages | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deleteTodosId, setDeleteTodosId] = useState<number[]>([]);

  const isTodoShow = todos.length > 0;

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setNewError(ErrorMessages.LoadError);
      });
  }, []);

  const deleteTodo = async (todoId: number) => {
    try {
      setDeleteTodosId((prev) => [...prev, todoId]);

      const removeNewTodo = await removeTodo(todoId);

      if (!removeNewTodo) {
        setNewError(ErrorMessages.DeleteError);

        return;
      }

      setTodos((prev) => {
        const filterPrev = prev.filter((todo) => todo.id !== todoId);

        return [...filterPrev];
      });
    } catch (error) {
      setNewError(ErrorMessages.DeleteError);
    } finally {
      setDeleteTodosId([]);
    }
  };

  const removeCompletTodos = async (todoIds: number[]) => {
    try {
      const deletePromises = todoIds.map((todoId) => deleteTodo(todoId));

      await Promise.all(deletePromises);
    } catch (error) {
      setNewError(ErrorMessages.DeleteError);
    }
  };

  const filterTodos = useMemo(() => {
    return getFilteredTodos(todos, filterBy);
  }, [todos, filterBy]);

  const handleNewTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const clearTodoTitle = () => {
    setNewTodoTitle('');
  };

  const addNewTodo = async (title: string): Promise<null | Todo> => {
    if (!title) {
      setNewError(ErrorMessages.TitleError);

      return null;
    }

    try {
      const newTodoStr = {
        completed: false,
        title,
        userId: USER_ID,
      };

      const newTodo = await createTodo(newTodoStr);

      clearTodoTitle();

      setTodos((prev) => [...prev, newTodo]);

      return newTodo;
    } catch (error) {
      setNewError(ErrorMessages.TitleError);

      return null;
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isTodoShow={isTodoShow}
          newTodoTitle={newTodoTitle}
          handleNewTodoTitle={handleNewTodoTitle}
          addNewTodo={addNewTodo}
        />

        <section className="todoapp__main">
          <TodoList
            todos={filterTodos}
            deleteId={deleteTodosId}
            deleteTodo={deleteTodo}
          />
        </section>

        <TodoFooter
          todos={todos}
          filterBy={filterBy}
          filterTodos={setFilterBy}
          deleteTodo={removeCompletTodos}
        />

        {newError
          && (
            <ErrorOnPage
              error={newError}
              setNewError={setNewError}
            />
          )}
      </div>
    </div>
  );
};
