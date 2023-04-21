/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos, updateTodos,
} from './api/todos';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { USER_ID } from './api/userId';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAddingNewTodo, setIsAddingNewTodo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingActiveTodoId, setLoadingActiveTodoId] = useState<number[]>([]);

  const allTodosCompleted = todos.every((todo) => todo.completed);
  const allTodosIncompleted = todos.every((todo) => !todo.completed);

  const showErrorNotification = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const fetchTodos = async () => {
    try {
      const todosData = await getTodos(USER_ID);

      setTodos(todosData);
    } catch (error) {
      showErrorNotification('Unable to get todos');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleToggleAll = async () => {
    let copyTodo = [...todos];

    if (!allTodosCompleted && !allTodosIncompleted) {
      copyTodo = copyTodo.filter(todo => !todo.completed);
    }

    try {
      setLoading(true);
      const todoUpdates = copyTodo.map((todo) => {
        const updatedTodo = { ...todo, completed: !todo.completed };

        return updatedTodo;
      });
      const todoIds = todoUpdates.map(todoItem => todoItem.id);

      setLoadingActiveTodoId(todoIds);
      const mergedTodos = todos.map(todo => {
        const updatedTodo = todoUpdates.find(t => t.id === todo.id);

        return updatedTodo || todo;
      });

      setTodos(mergedTodos);
      const todoUpdatesPromise = todoUpdates.map(todo => updateTodos(USER_ID, todo.id, todo));

      await Promise.all(todoUpdatesPromise);
    } catch (error) {
      showErrorNotification('Unable to taggle todos');
    } finally {
      setLoading(false);
      setLoadingActiveTodoId([]);
    }
  };

  return (
    <section className="section container">
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            allTodosCompleted={allTodosCompleted}
            handleTaggleAll={handleToggleAll}
            showErrorNotification={showErrorNotification}
            setIsAddingNewTodo={setIsAddingNewTodo}
            isAddingNewTodo={isAddingNewTodo}
            setTodos={setTodos}
            setLoading={setLoading}
            todos={todos}
            setLoadingActiveTodoId={setLoadingActiveTodoId}
          />

          <TodoList
            setLoading={setLoading}
            setTodos={setTodos}
            filter={filter}
            showErrorNotification={showErrorNotification}
            todos={todos}
            loading={loading}
            loadingActiveTodoId={loadingActiveTodoId}
            setLoadingActiveTodoId={setLoadingActiveTodoId}
          />

          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            allTodosIncompleted={allTodosIncompleted}
            setTodos={setTodos}
            showErrorNotification={showErrorNotification}
            setLoading={setLoading}
            setLoadingActiveTodoId={setLoadingActiveTodoId}
          />
        </div>

        <Error
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />

      </div>
    </section>
  );
};
