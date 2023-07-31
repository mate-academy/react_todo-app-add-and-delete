/* eslint-disable jsx-a11y/control-has-associated-label,no-console,@typescript-eslint/no-unused-vars */
import React, {
  FormEvent,
  useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Filter } from './types/Filter';
import { TodoInput } from './components/TodoInput';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { ErrorType } from './types/Error';

const USER_ID = 10822;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputIsDisabled, setInputIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleFormSubmit = (event :FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputIsDisabled) {
      return;
    }

    if (!inputValue.trim()) {
      setErrorMessage(ErrorType.TODO_TITLE_IS_EMPTY);

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    setTempTodo(todoToAdd);

    addTodo(todoToAdd)
      .then(newTodo => {
        setInputIsDisabled(true);
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })

      .catch(() => setErrorMessage(ErrorType.ADD))

      .finally(() => {
        setTempTodo(null);
        setInputValue('');
        setInputIsDisabled(false);
      });
  };

  const handleDeleteTodo = (todoId :number) => {
    deleteTodo(todoId)
      .then(() => setTodos(currentTodos => (
        currentTodos.filter(todo => todo.id !== todoId))))
      .catch(() => setErrorMessage(ErrorType.DELETE));
  };

  const countNotCompletedTodos = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const hasOneCompletedTodo = () => {
    return todos.some(todo => todo.completed);
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => handleDeleteTodo(todo.id));
  };

  const getFilteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(error => setErrorMessage(error));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput
          handleFormSubmit={handleFormSubmit}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />

        <TodoList
          todos={getFilteredTodos}
          handleDeleteTodo={handleDeleteTodo}
        />

        {todos.length > 0
          && (
            <TodoFooter
              filter={filter}
              setFilter={setFilter}
              itemsLeft={countNotCompletedTodos()}
              hasOneCompletedTodo={hasOneCompletedTodo()}
              handleClearCompleted={handleClearCompleted}
            />
          )}
      </div>

      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorMessage && (
        <Error
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
