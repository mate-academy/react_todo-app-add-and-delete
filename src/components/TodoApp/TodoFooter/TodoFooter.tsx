import React, { useCallback, useContext } from 'react';

import * as todoService from '../../../api/todos';

import { DispatchContext, StateContext, actionCreator } from '../../TodoStore';
import { FilterTodo } from './FilterTodo';
import { TodoError } from '../../../types/TodoError';

export const TodoFooter: React.FC = () => {
  const { initialTodos, selectedFilter } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const TotalUncompletedTodos = initialTodos.filter(todo => !todo.completed);
  const isCompletedTodos = initialTodos.some(todo => todo.completed);

  const deleteCompletedTodos = useCallback(() => {
    dispatch(actionCreator.toggleClearing());
    dispatch(actionCreator.clearError());

    const completedTodos = initialTodos.filter(todo => todo.completed);
    const deletePromises = completedTodos
      .map(todo => todoService.deleteTodo(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        completedTodos.forEach(todo => {
          dispatch(actionCreator.updateTodos({
            delete: todo.id, filter: selectedFilter,
          }));
        });
      })
      .catch(error => {
        dispatch(actionCreator.addError(TodoError.ErrorDelete));
        throw error;
      })
      .finally(() => dispatch(actionCreator.toggleClearing()));
  }, [initialTodos, selectedFilter]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${TotalUncompletedTodos.length} ${TotalUncompletedTodos.length === 1 ? 'items' : 'items'} left`}
      </span>

      <FilterTodo />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompletedTodos}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
