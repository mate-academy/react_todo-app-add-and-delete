/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';
import * as todoService from '../../api/todos';
import { Filter } from '../../types/Filter';
import { UserWarning } from '../../UserWarning';
import { TodosList } from '../TodosList';
import { TodosFilter } from '../TododsFilter';
import { TempTodoContext } from '../../TempTodoContext';

const USER_ID = 11903;
const ERROR_DELAY = 3000;

export const TodoApp: React.FC = () => {
  const { todos, setTodos } = useContext(TodosContext);
  const { tempTodo, setTempTodo } = useContext(TempTodoContext);
  const [todoTitle, setTodoTitle] = useState('');
  const [status, setStatus] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [isHidden, setIsHidden] = useState(true);
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setIsHidden(false);
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setTimeout(() => setIsHidden(true), ERROR_DELAY);
      });
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (status) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  const completedTodo = todos.some(todo => todo.completed);

  const handleOnBlur = () => {
    if (!todoTitle.trim()) {
      setIsHidden(false);
      setErrorMessage('Title should not be empty');
      setTempTodo(null);

      setTimeout(() => {
        setIsHidden(true);
      }, ERROR_DELAY);
    } else {
      todoService.createTodo({
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      })
        .then(newTodo => {
          const currentTodos = [...todos];

          setTodos([...currentTodos, newTodo]);
          setTodoTitle('');
          setTempTodo(null);
        })
        .catch(() => {
          setIsHidden(false);
          setErrorMessage('Unable to add a todo');
          setTempTodo(null);
        })
        .finally(() => {
          setTimeout(() => setIsHidden(true), ERROR_DELAY);
        });
    }
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tempTodo) {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      });
    }

    handleOnBlur();
  };

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus();
    }
  }, [todoTitle, handleOnSubmit]);

  const count = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form
            onSubmit={handleOnSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={event => setTodoTitle(event.target.value)}
              ref={refInput}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {todos && (
          <TodosList
            todos={filteredTodos}
          />
        )}
        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${count} items left`}
            </span>

            <TodosFilter
              status={status}
              setStatus={setStatus}
            />

            {completedTodo && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: isHidden },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsHidden(true)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
