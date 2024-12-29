import { useContext } from 'react';
import { NewTodoField } from './NewTodoField';
import { DispatchContext, StatesContext } from '../context/Store';
import { updateTodo } from '../api/todos';
import classNames from 'classnames';
import React from 'react';

export const Header: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos } = useContext(StatesContext);
  const handleOnToggleAll = () => {
    const toggledTodos = todos.every(todo => todo.completed)
      ? todos
      : todos.filter(t => !t.completed);

    toggledTodos.map(todo => {
      dispatch({ type: 'startUpdate' });
      updateTodo(todo.id, { ...todo, completed: !todo.completed })
        .then(newTodo => {
          dispatch({ type: 'selectTodo', payload: newTodo.id });
          dispatch({ type: 'updateTodo', payload: newTodo });
        })
        .catch(() => {
          dispatch({ type: 'showError', payload: 'Unable to update a todo' });
        })
        .finally(() => {
          dispatch({ type: 'stopUpdate' });
        });
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(t => t.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleOnToggleAll}
        />
      )}

      <NewTodoField />
    </header>
  );
};
