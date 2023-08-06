/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { Notifications } from './components/Notifications';
import { addTodo, deleteTodo, getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { ErrorText } from './types/ErrorText';
import { Filters } from './types/Filters';

const USER_ID = 11213;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadedTodos, setLoadingTodos] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorText.Empty);
  const [selectedFilter, setSelectedFilter] = useState<Filters>(Filters.All);
  const [title, setTitle] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const activeTodos = todos.filter(t => t.completed === false);
  const completedTodos = todos.filter(t => t.completed === true);

  const filteredTodos = (filterChar: Filters) => {
    return todos.filter(todo => {
      switch (filterChar) {
        case Filters.All:
          return true;

        case Filters.Active:
          return todo.completed === false;

        case Filters.Completed:
          return todo.completed === true;

        default:
          return false;
      }
    });
  };

  const deleteTodos = async (todoIds: number[]) => {
    setLoadingTodos(todoIds);

    const promisedDeletedTodos = todoIds.map(id => {
      return deleteTodo(id);
    });

    try {
      await Promise.all(promisedDeletedTodos);

      setTodos(todos.filter(t => !todoIds.includes(t.id)));
    } catch {
      setErrorMessage(ErrorText.Delete);
    } finally {
      setLoadingTodos([]);
    }
  };

  const addTodos = () => {
    const newTodo = {
      id: Math.max(...todos.map(t => t.id)) + 1,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setLoadingTodos([0]);
    setIsDisabledInput(true);

    addTodo(newTodo)
      .then(() => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorText.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingTodos([]);
        setIsDisabledInput(false);
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorText.Get);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          onSetTitle={setTitle}
          activeTodos={activeTodos}
          onSubmit={addTodos}
          onSetErrorMessage={setErrorMessage}
          isDisabledInput={isDisabledInput}
        />

        <TodoList
          todos={filteredTodos(selectedFilter)}
          loadingTodoId={loadedTodos}
          onDeleteTodo={deleteTodos}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Filter
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            selectedFilter={selectedFilter}
            onSetSelectedFilter={setSelectedFilter}
            onDeleteTodo={deleteTodos}
          />
        )}
      </div>

      <Notifications
        errorMessage={errorMessage}
        onSetErrorMessage={setErrorMessage}
      />
    </div>
  );
};
