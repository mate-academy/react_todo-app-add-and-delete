/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';

import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Header } from './Components/Header/Header';
import { TodoList } from './Components/TodoList/TodoList';
import { Footer } from './Components/Footer/Footer';
import { Todo } from './types/Todo';
import {
  deleteTodo, getTodos, postTodo, updateTodo,
} from './api/todos';
import { Error } from './types/Error';
import { Type } from './types/TodoTypes';

const USER_ID = 10788;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedType, setSelectedType] = useState(Type.All);
  const [isError, setIsError] = useState<Error>(Error.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputActive, setIsInputActive] = useState(true);
  const [todoIdUpdate, setTodoIdUpdate] = useState<number[]>([]);
  const [todoStatus, setStatus] = useState(false);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
      } catch (error) {
        setIsError(Error.DOWNLOAD);
      }
    };

    loadTodos();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (selectedType) {
      case Type.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Type.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, selectedType]);

  useEffect(() => {
    if (isError) {
      setIsError(isError);

      setTimeout(() => {
        setIsError(Error.NONE);
      }, 3000);
    }
  }, [isError]);

  const addTodo = useCallback(async (title: string) => {
    if (!title.trim()) {
      setIsError(Error.NOTITLE);

      return;
    }

    try {
      const newTodo = {
        userId: USER_ID,
        title,
        completed: false,
      };

      setIsInputActive(false);

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      const postedTodoToServer = await postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, postedTodoToServer]);
    } catch (error) {
      setIsError(Error.ADD);
    } finally {
      setTempTodo(null);
      setIsInputActive(true);
    }
  }, [USER_ID, todos]);

  const removeTodo = useCallback(async (todoId: number) => {
    setTodoIdUpdate([todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setIsError(Error.DELETE);
      setTodoIdUpdate([]);
    }
  }, [todos]);

  const completedTodos = todos.filter(todo => todo.completed);

  const removeCompletedTodos = useCallback(() => {
    setTodoIdUpdate(completedTodos.map(todo => todo.id));

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(() => setTodos(todos.filter(todo => !todo.completed)))
      .catch(() => {
        setIsError(Error.DELETE);
        setTodoIdUpdate([]);
      });
  }, [todos, todoIdUpdate]);

  const handleChange = useCallback(async (todoId: Todo) => {
    setStatus((current: boolean) => current);

    try {
      await updateTodo(todoId.id, todoStatus);

      setTodos(state => [...state].map(todo => {
        if (todo.id === todoId.id) {
          // eslint-disable-next-line no-param-reassign
          todo.completed = !todo.completed;
        }

        return todo;
      }));
    } catch {
      setIsError(Error.UPDATE);
    }
  }, [todoStatus, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onError={setIsError}
          addTodo={addTodo}
          isInputActive={isInputActive}
        />
        <TodoList
          todos={filteredTodos}
          onError={() => setIsError}
          removeTodo={removeTodo}
          todoIdUpdate={todoIdUpdate}
          tempTodo={tempTodo}
          handleChange={handleChange}
        />

        {todos.length && (
          <Footer
            todos={todos}
            selectType={selectedType}
            setSelectedType={setSelectedType}
            removeCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isError === Error.NONE },
      )}
      >
        <button
          type="button"
          className="delete"
        />
        {isError}
      </div>
    </div>
  );
};
