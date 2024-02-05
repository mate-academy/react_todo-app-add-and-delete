/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 100;

type Error = 'Unable to load todos' | 'Title should not be empty' | 'Unable to add a todo' | 'Unable to delete a todo' | 'Unable to update a todo' | '';
type FilPar = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [errorMsg, setErrorMsg] = useState<Error | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filterParam, setFilterParam] = useState<FilPar>('All');
  const [loadingList, setLoadingList] = useState<number[]>([]);
  const [disInput, setDisInput] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    // Коли компонент монтується, встановлюємо фокус на елемент input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  function filterTodos() {
    switch (filterParam) {
      case 'Active':
        setVisibleTodos(todos.filter(todo => todo.completed === false));
        break;
      case 'Completed':
        setVisibleTodos(todos.filter(todo => todo.completed));
        break;
      case 'All':
        setVisibleTodos(todos);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    setVisibleTodos(todos);
  }, [todos]);

  useEffect(() => {
    filterTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParam]);

  useEffect(() => {
    todoService.getTodos(USER_ID).then(setTodos);
  }, []);

  function loadTodos() {
    todoService.getTodos(USER_ID).then((data) => {
      setTodos(data);
    }).catch(() => setErrorMsg('Unable to load todos'));
  }

  function deleteTodo(todoId: number) {
    setLoadingList((curList) => [...curList, todoId]);

    todoService.removeTodo(todoId)
      .catch(() => setErrorMsg('Unable to delete a todo'))
      .then(() => loadTodos())
      .finally(() => setLoadingList(curList => curList.filter(todo => todo !== todoId)));
  }

  function addTodo({ title, completed, userId }: Todo) {
    setDisInput(true);

    todoService.postTodo({ title, completed, userId })
      .catch(() => setErrorMsg('Unable to add a todo'))
      .then(newPost => {
        setTodos(currTodos => [...currTodos, newPost] as Todo[]);
      }).finally(() => setDisInput(false));
    setTempTodo(null);
  }

  useEffect(loadTodos, []);

  function onDeleteCompleted() {
    todos.filter(todo => todo.completed === true).map(todo => deleteTodo(todo.id));
  }

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();
    setTempTodo({
      title: newTodoTitle, completed: false, userId: USER_ID, id: 0,
    });
    if (!newTodoTitle) {
      setErrorMsg('Title should not be empty');
    } else {
      addTodo({
        title: newTodoTitle, completed: false, userId: USER_ID, id: 0,
      });
      setNewTodoTitle('');
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
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              disabled={disInput}
              ref={inputRef}
              onChange={(event) => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  deleteTodo(todo.id);
                }}
              >
                ×
              </button>
              { false && (
                <form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value="Todo is being edited now"
                  />
                </form>
              )}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', { 'is-active': loadingList.includes(todo.id) })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div
              data-cy="Todo"
              className="todo"
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  deleteTodo(tempTodo.id);
                }}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className="modal overlay is-active"
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link ', { selected: filterParam === 'All' })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterParam('All')}
              >
                All
              </a>
              <a
                href="#/active"
                className={classNames('filter__link ', { selected: filterParam === 'Active' })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterParam('Active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={classNames('filter__link ', { selected: filterParam === 'Completed' })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterParam('Completed')}
              >
                Completed
              </a>
            </nav>
            <div>
              {todos.filter(todo => todo.completed).length > 0 && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={() => onDeleteCompleted()}
                >
                  Clear completed
                </button>
              )}
            </div>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames('notification is-danger is-light has-text-weight-normal', { hidden: !errorMsg })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => (setErrorMsg(null))}
        />
        {errorMsg}
      </div>
    </div>
  );
};
