/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useRef } from 'react';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
import classNames from 'classnames';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TempToDo } from './components/TempToDo';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // #region loadToDOs
  const [todos, setToDos] = useState<Todo[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempToDo, setTempToDo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const loadToDos = () => {
    setLoading(true);

    postService
      .getTodos(USER_ID)
      .then(setToDos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadToDos();

    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);

  const filteredToDos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  // #endregion
  // #region add, delete
  const addToDo = async (newTodo: Todo) => {
    setErrorMessage('');
    setTempToDo({
      id: 0,
      title: newTodo.title,
      completed: newTodo.completed,
      userId: newTodo.userId,
    });

    try {
      const createdTodo = await postService.createTodo({
        title: newTodo.title,
        completed: newTodo.completed,
        userId: newTodo.userId,
      });

      setToDos(currentTodos => [...currentTodos, createdTodo]);
      setTempToDo(null);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTempToDo(null);
      throw error;
    }
  };

  const deleteToDo = async (todoId: number) => {
    setErrorMessage('');
    setLoadingTodoId(todoId);

    try {
      await postService.deleteTodo(todoId);

      setToDos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      loadToDos();
    } finally {
      setLoadingTodoId(null);
    }
  };

  const deleteCompletedToDos = async () =>
    Promise.all(
      todos.filter(todo => todo.completed).map(todo => deleteToDo(todo.id)),
    );

  const updateTodo = async (todoId: number, updatedFields: Partial<Todo>) => {
    setLoadingTodoId(todoId);

    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        setErrorMessage('Todo not found');

        return;
      }

      const updatedTodo = await postService.updateTodo({
        ...todoToUpdate,
        ...updatedFields,
      });

      setToDos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch {
      setErrorMessage('Unable to update todo status');
      loadToDos();
    } finally {
      setLoadingTodoId(null);
    }
  };

  // #endregion

  if (!USER_ID) {
    setErrorMessage('User ID is not defined');

    return;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addToDo={addToDo}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          todos={todos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredToDos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
            >
              <label
                className="todo__status-label"
                htmlFor={`todo-status-${todo.id}`}
              >
                <input
                  id={`todo-status-${todo.id}`}
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() =>
                    updateTodo(todo.id, { completed: !todo.completed })
                  }
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteToDo(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loadingTodoId === todo.id,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          <TempToDo tempToDo={tempToDo} />
        </section>

        <Footer
          todos={todos}
          setFilter={setFilter}
          deleteCompletedToDos={deleteCompletedToDos}
          filter={filter}
        />
      </div>

      {/* Error notification */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
