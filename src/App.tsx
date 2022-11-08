/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import {
  createTodos, getTodos, removeTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoComponent } from './components/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputTitle, setInputTitle] = useState('');
  const [isAdding, setIsAdding] = useState<Todo | null>(null);
  const [addError, setAddError] = useState(false);
  const [removeError, setRemoveError] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [isHidden, setIsHidden] = useState(true);
  const [isEditing, setIsEditing] = useState<Todo | null>(null);

  const editTitle = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const getTodosFromApi = async (userId: number) => {
    try {
      const response = await getTodos(userId);

      setTodos(response);
      setIsAdding(null);
      setIsEditing(null);
    } catch (error) {
      throw new Error('Error on loading todos');
    }
  };

  const createTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputTitle) {
      setInputError(true);
      setIsHidden(false);

      return;
    }

    if (user) {
      const newTodo = {
        userId: user.id,
        title: inputTitle,
        completed: false,
      };

      setIsAdding(newTodo);

      try {
        await createTodos(newTodo);
      } catch {
        setAddError(true);
        setIsHidden(false);
        setIsAdding(null);
      }

      getTodosFromApi(user.id);
      setInputTitle('');
    }
  };

  const selectCompleted = async (todo: Todo) => {
    try {
      await updateTodo(todo, !todo.completed);
    } catch {
      setUpdateError(true);
      setIsHidden(false);
    }

    if (user) {
      getTodos(user.id);
    }
  };

  const selectAll = () => {
    todos.map(async todo => {
      if (!todo.completed && isAllSelected) {
        selectCompleted(todo);
      } else if (todo.completed && !isAllSelected) {
        selectCompleted(todo);
      }
    });

    setIsAllSelected(!isAllSelected);
  };

  const clearCompleted = () => {
    todos.map(async todo => {
      if (todo.completed) {
        removeTodo(todo);
        try {
          await removeTodo(todo);
        } catch {
          setRemoveError(true);
          setIsHidden(false);
        }

        if (user) {
          getTodosFromApi(user.id);
        }
      }
    });
  };

  useEffect(() => {
    if (user) {
      getTodosFromApi(user.id);
    }
  }, [user]);

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      default:
        return todo;
    }
  });

  const clearErrors = () => {
    setIsHidden(true);
    setAddError(false);
    setUpdateError(false);
    setRemoveError(false);
    setInputError(false);
  };

  useEffect(() => {
    setTimeout(clearErrors, 3000);
  }, [isHidden]);

  const hasCompleted = todos.some(todo => todo.completed);
  const countOfActive = todos.filter(todo => !todo.completed).length;
  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={cn('todoapp__toggle-all', { active: isAllCompleted })}
            onClick={selectAll}
          />

          <form onSubmit={createTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputTitle}
              onChange={event => setInputTitle(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoComponent
              todo={todo}
              getTodo={getTodosFromApi}
              setUpdateError={setUpdateError}
              setRemoveError={setRemoveError}
              editTitle={editTitle}
              setIsHidden={setIsHidden}
              isEditting={isEditing}
              setIsEditting={setIsEditing}
            />
          ))}

          {isAdding && (
            <TodoComponent
              todo={isAdding}
              getTodo={getTodosFromApi}
              setUpdateError={setUpdateError}
              setRemoveError={setRemoveError}
              editTitle={editTitle}
              setIsHidden={setIsHidden}
            />
          )}
        </section>

        {todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${countOfActive} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={cn('filter__link', {
                  selected: filterType === 'All',
                })}
                onClick={() => setFilterType('All')}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={cn('filter__link', {
                  selected: filterType === 'Active',
                })}
                onClick={() => setFilterType('Active')}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={cn('filter__link', {
                  selected: filterType === 'Completed',
                })}
                onClick={() => setFilterType('Completed')}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className={cn('todoapp__clear-completed', {
                hidden: !hasCompleted,
              })}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          { hidden: isHidden })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={clearErrors}
        />

        {updateError && 'Unable to update a todo'}
        {addError && 'Unable to add a todo'}
        {removeError && 'Unable to delete a todo'}
        {inputError && 'Title can\'t be empty'}
      </div>
    </div>
  );
};
