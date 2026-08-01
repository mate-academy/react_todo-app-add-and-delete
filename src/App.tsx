/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as apiMetodos from './api/todos';

export const App: React.FC = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState('Title should not be empty');
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [todoFantasm, setTodoFantasm] = useState<Todo | undefined>(undefined);
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const [deletingTodo, setDeletingTodo] = useState<number>();
  const getData = async (filtro = '') => {
    try {
      const todosGet = await apiMetodos.getTodos();

      switch (filtro) {
        case 'active':
          setTodo(todosGet.filter((r: Todo) => r.completed === false));
          break;
        case 'completed':
          setTodo(todosGet.filter((r: Todo) => r.completed === true));
          break;
        case '':
          setTodo(todosGet);
      }

      setErrorMessage('');
    } catch (e) {
      setErrorMessage('Unable to load todos');
      throw new Error('Erro no GetData ' + e);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);
  useEffect(() => {
    newTodoInputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!inputDisabled) {
      newTodoInputRef.current?.focus();
    }
  }, [inputDisabled]);
  const postData = async (event: React.FormEvent<HTMLFormElement>) => {
    let createdTodo: Todo;

    event.preventDefault();
    try {
      if (!inputText || inputText.trim() === '') {
        setErrorMessage('Title should not be empty');
        newTodoInputRef.current?.focus();

        return;
      }

      const sendObject = {
        id: 0,
        userId: apiMetodos.USER_ID,
        title: String(inputText).trim(),
        completed: false,
      };

      setTodoFantasm(sendObject);
      setInputDisabled(true);
      createdTodo = await apiMetodos.postTodo(sendObject);
      setTodo((prev: Todo[]) => [...prev, createdTodo]);
      setInputText('');
    } catch (e) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTodoFantasm(undefined);
      setInputDisabled(false);
    }
  };

  const deleteData = async (todoId: number) => {
    try {
      setDeletingTodo(todoId);

      await apiMetodos.deleteTodo(todoId);

      setTodo(prev => prev.filter(r => r.id !== todoId));

      setDeletingTodo(undefined);

      newTodoInputRef.current?.focus();
    } catch (e) {
      setErrorMessage('Unable to delete a todo');
      setDeletingTodo(undefined);
    }
  };

  const deleteCompleted = async () => {
    const completedTodos = todo.filter(r => r.completed);

    const deletePromises = completedTodos.map(r => deleteData(r.id));

    try {
      await Promise.all(deletePromises);
      await getData();
    } catch (e) {
      setErrorMessage('Unable to delete a todo');
      completedTodos.forEach(r => {
        deleteData(r.id);
      });
      await getData();
      throw new Error('erro no deleteCompleted' + e);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={`todoapp__toggle-all  ${todo.filter(r => r.completed === true).length === todo.length ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={e => postData(e)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputText}
              onChange={e => {
                setInputText(e.target.value);
                if (e.target.value === '') {
                  setErrorMessage('Title should not be empty');
                }
              }}
              disabled={inputDisabled}
              ref={newTodoInputRef}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todo.map(todoArray => (
            <div
              data-cy="Todo"
              className={`todo ${todoArray.completed ? 'completed' : ''}`}
              key={todoArray.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todoArray.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todoArray.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteData(todoArray.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={`modal overlay ${deletingTodo === todoArray.id ? 'is-active' : ''}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {todoFantasm !== undefined && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todoFantasm.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay  is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
          {/* This is a completed todo */}
          {/* <div data-cy="Todo" className="todo completed">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Completed Todo
            </span> */}

          {/* Remove button appears only on hover */}
          {/* <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button> */}

          {/* overlay will cover the todo while it is being deleted or updated */}
          {/* <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

          {/* This todo is an active todo */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Not Completed Todo
            </span>
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

          {/* This todo is being edited */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label> */}

          {/* This form is shown instead of the title and remove button */}
          {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

          {/* This todo is in loadind state */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button> */}

          {/* 'is-active' class puts this modal on top of the todo */}
          {/* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
        </section>

        {/* Hide the footer if there are no todos */}
        {todo.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todo.filter(r => r.completed === false).length} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${activeFilter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => {
                  getData();
                  setActiveFilter('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${activeFilter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => {
                  getData('active');
                  setActiveFilter('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${activeFilter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  getData('completed');
                  setActiveFilter('completed');
                }}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todo.filter(r => r.completed).length === 0}
              onClick={() => deleteCompleted()}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* {failledApi.get ? 'Unable to load todos' : ''}
        <br />
        {!inputText ? 'Title should not be empty' : ''}
        <br />
        {failledApi.get ? 'Unable to add todo' : ''}
        <br />
        {failledApi.get ? 'Unable to delete todo' : ''}
        <br />
        {failledApi.get ? 'Unable to update todo' : ''} */}
      </div>
    </div>
  );
};
