/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Triangle } from 'react-loader-spinner';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';
import { TodoItem } from './Components/TodoItem';

const USER_ID = 10413;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [errorName, setErrorName] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');

  const [todoID, setTodoID] = useState<number[]>([]);

  const [preparing, setPreparing] = useState(false);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'all':
        return true;
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        throw new Error('Can not filter Todo');
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
      setPreparing(true);
      setTempTodo(newTodo);
      setDisabledInput(true);
      const addedTodo: Todo = await addTodo(USER_ID, newTodo);

      setTodos(prev => [...prev, addedTodo]);
      setTitle('');
      setHasError(false);
    } catch (e) {
      setHasError(true);
    } finally {
      setTempTodo(null);
      setDisabledInput(false);
      setPreparing(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setTodoID(current => [...current, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      setHasError(false);
    } catch (error) {
      setHasError(true);
      setErrorName('Unable to delete a todo');
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const clearCompletedTodos = () => {
    completedTodos.map(todo => handleDeleteTodo(todo.id));
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

          <section className="todoapp__main">
            {visibleTodos.map(todo => {
              return (
                <TodoItem
                  todo={todo}
                  onDelete={() => handleDeleteTodo(todo.id)}
                  userId={todoID.includes(todo.id)}
                />
              );
            })}
            {preparing
            && (
              <TodoItem
                todo={tempTodo}
                userId
              />
            )}
          </section>

          {/* Hide the footer if there are no todos */}
          {todos.length !== 0 && (
            <Footer
              todos={visibleTodos}
              setFilter={e => setFilter(e)}
              filter={filter}
              onDeleteCompleted={() => clearCompletedTodos()}
              selectedTodos={completedTodos}
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
