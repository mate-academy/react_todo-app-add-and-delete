/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Notification } from './components/Notification/Notification';

import { Todo } from './types/Todo';

import { getTodos, addTodo, onDelete } from './api/todos';

const USER_ID = 6476;

export enum SortType {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState('All');
  const [isError, setIsError] = useState(false);
  const [inputDisable, setInputDisable] = useState(false);
  const [title, setTitle] = useState('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const visibleTodos = useMemo(() => {
    return (todos.filter((todo) => {
      switch (filterBy) {
        case SortType.ALL:
          return todos;

        case SortType.ACTIVE:
          return !todo.completed;

        case SortType.COMPLETED:
          return todo.completed;

        default:
          return [];
      }
    })
    );
  }, [filterBy, todos]);

  const noCompleteTodos = todos.some((todo) => todo.completed);

  const loadTodosData = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setInputDisable(false);
      setIsError(false);
      setTempTodo(null);

      setTodos(todosFromServer);
    } catch (error) {
      setIsError(true);
      setErrorMessage("Can't load data...");
    }
  };

  useEffect(() => {
    loadTodosData();
  }, []);

  const createNewTodo = (query: string): Todo => {

    const newId = Math.max(...todos.map((todo) => todo.id + 1));

    const newTodo = {
      id: newId,
      userId: USER_ID,
      title: query,
      completed: true,
    };

    return newTodo;
  };

  const dataTodo = {
    userId: USER_ID,
    title,
    completed: false,
  };

  const sendTodo = async () => {
    setTempTodo({ id: 0, ...dataTodo });

    try {
      await addTodo(createNewTodo(title));
      loadTodosData();

      setIsError(false);
    } catch {
      setErrorMessage('Unable to add a todo');
      setTempTodo(null);
      setIsError(true);
    }
  };

  const handleFromSubmit = (event: React.FormEvent) => {
    setInputDisable(true);

    event.preventDefault();

    sendTodo();
    setTitle('');
  };

  const removeTodo = async (todoId: number) => {
    setTempTodo({ id: 0, ...dataTodo });

    try {
      await onDelete(todoId);
      loadTodosData();
    } catch (error) {
      setTempTodo(null);
      setIsError(true);
      setErrorMessage('Unable to delete a todo');
    }
  };

  const clearCompleted = () => {
    const clearCompletedTodos = todos.filter((todo) => todo.completed);

    clearCompletedTodos.forEach((todo) => removeTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          onSubmit={handleFromSubmit}
          disable={inputDisable}
        />

        {todos.length > 0 && (
          <>
            <TodoList 
              todos={visibleTodos} 
              isTemp={tempTodo} 
              onRemoveTodo={removeTodo} 
            />

            <Footer
              noCompleteTodos={noCompleteTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      {isError && (
        <Notification errorMessage={errorMessage} />
      )}

    </div>
  );
};
