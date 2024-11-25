/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
// import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, postTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './Footer';
import { TodoList } from './TodoList';
import classNames from 'classnames';
import { Filters } from './types/Filters';
import { TodoItem } from './TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [addTodoTitle, setAddTodoTitle] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterSelected, setFilterSelected] = useState<Filters>(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const ref = useRef<HTMLInputElement | null>(null);

  const updateTodos = (todoId, title) => {
    // prettier-ignore
    setTodos(prevState =>
      title === null
        ? prevState.filter(todo => todo.id !== todoId)
        : prevState.map(todo => todoId === todo.id
          ? { ...todo, title: title } : todo,),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = addTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setShowErrorMessage(true);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    setIsSubmitting(true);
    try {
      const newTodo = {
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      };
      const createdTodo = await postTodos(newTodo);

      setTodos(prevState => [...prevState, createdTodo]);
      setTempTodo(null);
      setAddTodoTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
      setShowErrorMessage(true);
      setTempTodo(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTodos = () => {
    switch (filterSelected) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const handleDelete = async (todoId: number) => {
    setDeletingTodoId(todoId);
    try {
      await deleteTodos(todoId);
      updateTodos(todoId, null);
      const updatedTodos = await getTodos();

      setTodos(updatedTodos);
      ref.current.focus();
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setShowErrorMessage(true);
    }
  };

  useEffect(() => {
    if (!isSubmitting && ref.current) {
      ref.current.focus();
    }
  }, [isSubmitting]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setShowErrorMessage(true);
      });
  }, []);

  useEffect(() => {
    if (showErrorMessage) {
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            disabled={isSubmitting}
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />

          <form
            onSubmit={event => {
              handleSubmit(event);
            }}
          >
            <input
              disabled={isSubmitting}
              data-cy="NewTodoField"
              type="text"
              ref={ref}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={addTodoTitle}
              onChange={event => {
                setAddTodoTitle(event.target.value);
              }}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos()}
          deletingTodoId={deletingTodoId}
          updateTodos={updateTodos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          handleDelete={handleDelete}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            todos={[]}
            updateTodos={() => {}}
            setTodos={() => {}}
            setErrorMessage={setErrorMessage}
            handleDelete={() => {}}
            tempTodo={tempTodo}
          />
        )}

        {!!todos.length && (
          <Footer
            todos={todos}
            filterSelected={filterSelected}
            setFilterSelected={setFilterSelected}
            handleDelete={handleDelete}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${showErrorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setShowErrorMessage(false)}
        />

        {errorMessage}
      </div>
    </div>
  );
};
