/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { addTodo, getTodos, deleteTodo } from './api/todos';
import { Filter } from './types/Filter';
import { ErrorNotification } from './types/ErrorNotification';
import { Error } from './components/Error';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11988;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage]
    = useState<ErrorNotification>(ErrorNotification.Default);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isLoader, setIsLoader] = useState<number | null>(null);

  useEffect(() => {
    setErrorMessage(ErrorNotification.Default);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorNotification.LoadError));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const createTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setErrorMessage(ErrorNotification.Default);

    try {
      setIsInputDisabled(true);
      setTempTodo({ id: 0, ...newTodo });
      const todo = await addTodo(newTodo);

      setTodos((currentTodos) => [...currentTodos, todo]);
    } catch (error) {
      setErrorMessage(ErrorNotification.AddError);
      throw error;
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }

    setTitle('');
  };

  const removeTodo = async (todo: Todo) => {
    setErrorMessage(ErrorNotification.Default);

    try {
      setIsLoader(todo.id);
      await deleteTodo(todo.id);
    } catch (error) {
      setErrorMessage(ErrorNotification.DeleteError);
      setIsLoader(null);
      throw error;
    } finally {
      setTempTodo(null);
    }

    setTodos(currentTodos => currentTodos
      .filter(item => item.id !== todo.id));
  };

  const deleteSeveral = async () => {
    try {
      const deletePromises = todos
        .filter(todo => todo.completed)
        .map(todo => deleteTodo(todo.id));

      await Promise.allSettled(deletePromises);
    } catch (error) {
      setErrorMessage(ErrorNotification.DeleteError);
      throw error;
    } finally {
      const newTodos = todos.filter(todo => !todo.completed);

      setTodos(newTodos);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={createTodo}
          todos={todos}
          setErrorMessage={setErrorMessage}
          title={title}
          setTitle={setTitle}
          userId={USER_ID}
          isInputDisabled={isInputDisabled}
        />
        {todos.length !== 0 && (
          <TodoList
            todos={filteredTodos}
            removeTodo={removeTodo}
            isLoader={isLoader}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            removeTodo={removeTodo}
            isLoader={isLoader}
            isTempTodo
          />
        )}

        {todos.length !== 0 && (
          <Footer
            setFilter={setFilter}
            filterOption={filter}
            todos={todos}
            deleteCompleted={deleteSeveral}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
