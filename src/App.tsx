/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as clientService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorsHandler } from './components/ErrorsHandler';
import { FilterQuery } from './types/FilterQuery';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [activeFilterBtn, setActiveFilterBtn] = useState('all');
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    clientService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Todo = {
      id: Math.max(0, ...todos.map(todo => todo.id)) + 1,
      title: title.trim(),
      userId: clientService.USER_ID,
      completed: false,
    };

    setIsDisabled(true);

    clientService
      .addTodos(newTodo)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setTitle('');
        setErrorMessage('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsDisabled(false);
        setIsFocused(true);
      });
  };

  const handleQueryChange = (value: string) => {
    setTitle(value);
  };

  const handleDeleteTodo = (id: number) => {
    setIsDisabled(true);

    clientService
      .deleteTodos(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setIsFocused(true);
      })
      .catch(() => setErrorMessage('Unable to delete a todo'));
  };

  const changeCompleted = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleChangeFilter = (value: string) => {
    setActiveFilterBtn(value);
  };

  const clearCompletedTodos = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const handleDeleteErrorMsg = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {};
  }, [errorMessage]);

  useEffect(() => {
    setFilteredTodos(
      todos.filter(todo => {
        switch (activeFilterBtn) {
          case FilterQuery.All:
            return true;
          case FilterQuery.Active:
            return !todo.completed;
          case FilterQuery.Completed:
            return todo.completed;
          default:
            return false;
        }
      }),
    );
  }, [todos, activeFilterBtn]);

  if (!clientService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          isFocused={isFocused}
          isDisabled={isDisabled}
          handleQueryChange={handleQueryChange}
          handleSubmit={handleSubmit}
        />

        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          changeCompleted={changeCompleted}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            activeBtn={activeFilterBtn}
            handleChangeFilter={handleChangeFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorsHandler
        errorMessage={errorMessage}
        handleDeleteErrorMsg={handleDeleteErrorMsg}
      />
    </div>
  );
};
