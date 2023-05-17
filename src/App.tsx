/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Triangle } from 'react-loader-spinner';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/Todolist';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';

const USER_ID = 10413;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [errorName, setErrorName] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);

  const [title, setTitle] = useState('');

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'all':
        return true;
      case 'active':
        return !todo.completed;
      default:
        return todo.completed;
    }
  });
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setHasError(true);
      setErrorName('Title can\'t be empty');
      setTimeout(() => {
        setHasError(false);
      }, 3000);

      return;
    }

    const newTodo = {
      id: 0, userId: USER_ID, title, completed: false,
    };

    try {
      setDisabledInput(true);
      const addedTodo: Todo = await addTodo(USER_ID, newTodo);

      setTodos([...todos, addedTodo]);
      setTitle('');
    } catch (e) {
      setHasError(true);
    } finally {
      setDisabledInput(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      setHasError(false);
    } catch (error) {
      setHasError(true);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await getTodos(USER_ID);

        setTodos(response);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(true);
        setHasError(true);
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      {isLoading ? (
        <Triangle
          height="80"
          width="80"
          color="orange"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          visible
        />
      ) : (
        <div className="todoapp__content">
          <Header
            onSubmit={handleFormSubmit}
            onChangeTitle={handleTitleChange}
            title={title}
            isInputDisabled={disabledInput}
          />

          <TodoList
            todos={visibleTodos}
            handleDeleteTodo={handleDeleteTodo}
          />

          {/* Hide the footer if there are no todos */}
          {todos.length !== 0 && (
            <Footer
              todos={visibleTodos}
              setFilter={e => setFilter(e)}
              filter={filter}
            />
          )}
        </div>
      )}

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {hasError && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={() => setHasError(false)}
          />
          {errorName}
          {/* Unable to add a todo */}
          {/* <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
        </div>
      )}
    </div>
  );
};
