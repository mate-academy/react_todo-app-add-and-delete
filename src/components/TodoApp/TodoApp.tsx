import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { USER_ID, createTodo, deleteTodo, getTodos } from '../../api/todos';
import { TodosContext } from '../TodosContext/TodosContext';
import { TodoList } from '../TodoList/TodoList';
import { TodosFilter } from '../TodosFilter/TodosFilter';
import { TodoItem } from '../TodoItem/TodoItem';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

export const TodoApp: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    resetError,
    setLoadingId,
  } = useContext(TodosContext);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);

  const todoInput = useRef<HTMLInputElement | null>(null);
  const isCompletedInTodos = todos.some(todo => todo.completed);
  const totalIncomplete = todos.reduce(
    (acc, curr) => (!curr.completed ? acc + 1 : acc),
    0,
  );

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  }, [tempTodo, todos]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.loadTodos);
      })
      .finally(resetError);
  }, [setTodos, setErrorMessage, resetError]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(Errors.noErrors);
    setTitle(event.target.value);
  };

  const addTodo = (newTitle: string) => {
    createTodo({ title: newTitle, completed: false, userId: USER_ID })
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.unableToAdd);
      })
      .finally(() => {
        resetError();
        setTempTodo(null);
        setLoadingId(null);
        setLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(Errors.emptyTitle);
      resetError();

      return;
    }

    setLoading(true);
    setLoadingId(0);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });
    addTodo(title.trim());
  };

  const handleDelete = (todoId: number) => {
    setLoadingId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(prevTodo => prevTodo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.unableDelete);
        resetError();
      })
      .finally(() => setLoadingId(null));
  };

  const handleDeleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={todoInput}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleTitleChange}
              disabled={loading}
            />
          </form>
        </header>

        <TodoList handleDelete={handleDelete} />
        {tempTodo && <TodoItem todo={tempTodo} handleDelete={handleDelete} />}

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${totalIncomplete} items left`}
            </span>

            <TodosFilter />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!isCompletedInTodos}
              onClick={handleDeleteCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage.length },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(Errors.noErrors)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
