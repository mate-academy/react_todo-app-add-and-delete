/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { Filters } from './utils/Filters';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { addTodo, getTodos } from './api/todos';

const USER_ID = 11437;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo>({} as Todo);
  const [isTodoLoading, setIsTodoLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  const [filterParam, setFilterParam] = useState(Filters.All);
  const [newTitle, setNewTitle] = useState('');

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTitle) {
      setErrorMessage('Title can\'t be empty');
      setIsErrorHidden(false);

      setTimeout(() => {
        setIsErrorHidden(true);
      }, 3000);

      return;
    }

    setTempTodo({
      id: 0,
      completed: false,
      title: newTitle,
      userId: USER_ID,
    });
    setIsTodoLoading(true);
    addTodo(USER_ID, {
      id: 0,
      completed: false,
      title: newTitle,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(JSON.parse(error.message).error);
        setIsErrorHidden(false);

        setTimeout(() => {
          setIsErrorHidden(true);
        }, 3000);
      })
      .finally(() => {
        setIsTodoLoading(false);
        setTempTodo({} as Todo);
        setNewTitle('');
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorMessage(JSON.parse(error.message).error);
        setIsErrorHidden(false);

        setTimeout(() => {
          setIsErrorHidden(true);
        }, 3000);
      });
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filterParam) {
      case Filters.Active:
        return todos.filter(({ completed }) => !completed);

      case Filters.Completed:
        return todos.filter(({ completed }) => completed);

      case Filters.All:
        return todos;

      default:
        return todos;
    }
  }, [filterParam, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTitle={newTitle}
          onTitleChange={handleChangeTitle}
          onSubmit={onSubmit}
        />

        <section className="todoapp__main">
          <TodoList todos={visibleTodos} />

          {/* This todo is in loadind state */}
          {isTodoLoading && (
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button type="button" className="todo__remove">×</button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {!!todos?.length && (
          <TodoFilter
            todos={todos}
            filterParam={filterParam}
            onFilterChange={(newFilter) => setFilterParam(newFilter)}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isErrorHidden },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setIsErrorHidden(true)}
        />

        {/* show only one message at a time */}
        {errorMessage}
        <br />
      </div>
    </div>
  );
};
