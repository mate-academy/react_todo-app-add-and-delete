/*eslint-disable*/
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorObject, FilterEnum } from './utils/types';

export const App: React.FC = () => {

  const inputRef = useRef<HTMLInputElement>(null);
  const [todosData, setTodosData] = React.useState<Todo[]>([]);
  const [error, setError] = React.useState<ErrorObject>('');
  const [filter, setFilter] = React.useState<FilterEnum>(FilterEnum.All);
  const [title, setTitle] = React.useState('');
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = React.useState<number | null>(null);
  const [isDeletingCompleted, setIsDeletingCompleted] = React.useState(false);
  if (!USER_ID) {
    return <UserWarning />;
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      try {

        const currentTodos = await getTodos();

        setTodosData(currentTodos);

      } catch (err) {
        setError('Load');
      } finally {
      }
    };

    fetchTodos();
  }, []);

  const filteredTodos = todosData.filter(todo => {
    switch (filter) {
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!tempTodo && !isDeletingCompleted && !deletingTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo, isDeletingCompleted, deletingTodo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!title.trim()) {
      setError('Title');
      return;
    }

    const newTempTodo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await addTodo({title: title.trim(), completed: false});
      setTodosData((prevTodos)=>[...prevTodos, newTodo]);
      setTitle('');
    } catch (err) {
      setError('Add');
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteOneTodo = async (id:number) => {

    setDeletingTodo(id);

    try {
      await deleteTodo(id);
      setTodosData((prevState)=>prevState.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Delete');
    } finally {
      setDeletingTodo(null);
    }
  };


  const handleDeleteCompletedTodos = async () => {
    const completedTodos = todosData.filter(todo => todo.completed);
    const remainingTodos = [...todosData];

    setIsDeletingCompleted(true);

    await Promise.all(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);
          const index = remainingTodos.findIndex(t => t.id === todo.id);
          if (index !== -1) {
            remainingTodos.splice(index, 1);
          }
        } catch {
               setError('Delete');
        }
        finally {
          setIsDeletingCompleted(false);

        }
      })
    );

    setTodosData(remainingTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {'active':todosData.filter(todo => todo.completed).length === todosData.length})}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList filteredTodos={filteredTodos} tempTodo={tempTodo} onDelete={handleDeleteOneTodo} deletingTodoId={deletingTodo}/>
        </section>
        {/*

           This todo is being edited
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

             This form is shown instead of the title and remove button
            <form>
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
          </div>

           This todo is in loadind state
          <div data-cy="Todo" className="todo">
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
            </button>

             'is-active' class puts this modal on top of the todo
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
          */}

        <Footer todosData={todosData} filter={filter} setFilter={setFilter} onClearClick={handleDeleteCompletedTodos} isDeleting={isDeletingCompleted}/>
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: error === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setError('');
          }}
        />
        {/* show only one message at a time */}
        {error === 'Load' && 'Unable to load todos'}
        {error === 'Add' && 'Unable to add a todo'}
        {error === 'Title' && 'Title should not be empty'}
        {error === 'Delete' && 'Unable to delete a todo'}

        {/*
        Unable to update a todo*/}
      </div>
    </div>
  );
};
