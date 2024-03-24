/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from '../../UserWarning';
import { ClientTodo } from './../../types';
import { todosApi } from '../../api/todos';
import { USER_ID } from '../../api/config';
import { filterTodos } from '../../utils/filterTodos';
import { createClientTodo } from '../../utils/createClientTodo';
import { ErrorContext } from '../../contexts/ErrorContext';
import { FormInputContext } from '../../contexts/FormInputContext';
import {
  TodosContext,
  TodosDispatchContext,
} from '../../contexts/TodosContext';
import { ErrorNotification } from '../ErrorNotification';
import { Filter, FilterStatus } from '../Filter';
import { TodoList } from '../TodoList';
import { TodoForm } from '../TodoForm';
import { TodoItem } from '../TodoItem';
import { ClearCompletedButton } from '../ClearCompletedButton';

export const TodoApp: React.FC = () => {
  const todos = useContext(TodosContext);
  const todosDispatch = useContext(TodosDispatchContext);
  const { setError } = useContext(ErrorContext);
  const { focus: focusFormInput, setDisabled: setDisabledFormInput } =
    useContext(FormInputContext);

  const [tempTodo, setTempTodo] = useState<ClientTodo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const filteredTodos: ClientTodo[] = filterTodos(todos, filterStatus);
  const completedTodos = todos.filter(({ completed }) => completed);

  useEffect(() => {
    setDisabledFormInput(true);

    todosApi
      .get()
      .then(result => todosDispatch({ type: 'set', payload: result }))
      .catch(() => setError({ message: 'Unable to load todos' }))
      .finally(() => {
        setDisabledFormInput(false);
        focusFormInput();
      });
  }, [setError, todosDispatch, focusFormInput, setDisabledFormInput]);

  const createTodo = async (title: string) => {
    const newTodo = createClientTodo({ title, loading: true });

    setTempTodo(newTodo);

    try {
      todosDispatch({
        type: 'add',
        payload: await todosApi.create(newTodo),
      });
    } catch (apiError) {
      setError({ message: 'Unable to add a todo' });

      throw apiError;
    } finally {
      setTempTodo(null);
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
          {Boolean(todos.length) && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.length === completedTodos.length,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <TodoForm onSubmit={createTodo} />
        </header>

        <TodoList todos={filteredTodos} />
        {tempTodo && <TodoItem todo={tempTodo} />}

        {Boolean(todos.length) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.length - completedTodos.length} items left
            </span>

            <Filter
              status={filterStatus}
              handleStatusChange={setFilterStatus}
            />

            <ClearCompletedButton completedTodos={completedTodos} />
          </footer>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
