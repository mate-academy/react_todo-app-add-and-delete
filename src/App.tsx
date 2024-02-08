/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Status } from './types/Statuses';
import { ErrorNotification } from './components/ErrorNotification';
import { Errors } from './types/Errors';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11980;

const applyFilter = (todos: Todo[], filter: Status) => {
  const conditions = {
    [Status.All]: () => {
      return todos;
    },
    [Status.Active]: () => {
      return todos.filter(todo => !todo.completed);
    },
    [Status.Completed]: () => {
      return todos.filter(todo => todo.completed);
    },
  };

  return conditions[filter]();
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<Errors | ''>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LoadError));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = applyFilter(todos, filter);

  const toggleTodo = (todo: Todo) => {
    const changedTodos = todos.map(item => {
      if (item.id === todo.id) {
        return {
          ...item,
          completed: !todo.completed,
        };
      }

      return item;
    });

    setTodos(changedTodos);
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => !todo.completed);

    try {
      setTodos(completedTodos);
    } catch {
      setErrorMessage(Errors.DeleteTodoError);
    }
  };

  const handleAddTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setTitle(title);
    setIsDisabledInput(true);

    setTempTodo({ id: 0, ...newTodo });

    await addTodo(newTodo)
      .then(todo => {
        setTodos((currentTodos) => [...currentTodos, todo]);
      })
      .catch(() => {
        setTitle(title);
        setErrorMessage(Errors.AddTodoError);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabledInput(false);
      });

    setTitle('');
  };

  const handleDeleteTodo = (todo: Todo) => {
    deleteTodo(todo.id)
      .catch(() => setErrorMessage(Errors.DeleteTodoError))
      .finally(() => {
        setTodos(current => current.filter(item => item.id !== todo.id));
        setTempTodo(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          userId={USER_ID}
          title={title}
          setTitle={setTitle}
          handleAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          isDisabledInput={isDisabledInput}
        />
        <TodoList
          tempTodo={tempTodo}
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          handleDeleteTodo={handleDeleteTodo}
        />
        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            tempTodo={tempTodo}
            todo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
            toggleTodo={toggleTodo}
          />
        )}

        {todos[0] && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
