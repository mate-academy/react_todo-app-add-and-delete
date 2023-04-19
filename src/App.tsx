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

  const handleTaggleAll = async () => {
    let copyTodo = [...todos];

    if (!allTodosCompleted && !allTodosIncompleted) {
      copyTodo = copyTodo.filter(todo => !todo.completed);
    }

    try {
      const todoUpdates = copyTodo.map(async (todo) => {
        const updatedTodo = { ...todo, completed: !todo.completed };

        await updateTodos(USER_ID, todo.id, updatedTodo);

        return updatedTodo;
      });

      const updatedTodos = await Promise.all(todoUpdates);

      const mergedTodos = todos.map(todo => {
        const updatedTodo = updatedTodos.find(t => t.id === todo.id);

        return updatedTodo || todo;
      });

      setTodos(mergedTodos);
    } catch (error) {
      showErrorNotification('Unable to taggle todos');
    }
  };

  return (
    <section className="section container">
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            allTodosCompleted={allTodosCompleted}
            handleTaggleAll={handleTaggleAll}
            fetchTodos={fetchTodos}
            showErrorNotification={showErrorNotification}
            setIsAddingNewTodo={setIsAddingNewTodo}
            isAddingNewTodo={isAddingNewTodo}
          />

          <TodoList
            setTodos={setTodos}
            filter={filter}
            showErrorNotification={showErrorNotification}
            isAddingNewTodo={isAddingNewTodo}
            todos={todos}
          />

          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            allTodosIncompleted={allTodosIncompleted}
            setTodos={setTodos}
            showErrorNotification={showErrorNotification}
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
