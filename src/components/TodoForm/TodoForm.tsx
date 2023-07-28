import React, { useContext } from 'react';
import classNames from 'classnames';
import * as todoService from '../../api/todos';
import { DispatchContext, StateContext } from '../GlobalStateProvider';
import { Form } from '../common';

export const TodoForm: React.FC = () => {
  const { todos, userId } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const hasActiveTodos = todos.some(todo => !todo.completed);

  const addTodo = async (title: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });

    try {
      const newTodo = {
        userId,
        title,
        completed: false,
      };

      dispatch({ type: 'SET_TEMP_TODO', payload: { ...newTodo, id: 0 } });

      const todo = await todoService.createTodo(newTodo);

      dispatch({ type: 'SET_TEMP_TODO', payload: null });
      dispatch({ type: 'ADD_TODO', payload: todo });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Unable to add a todo' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={
          classNames('todoapp__toggle-all', {
            active: hasActiveTodos,
          })
        }
        aria-label="toggle all todos status"
      />

      <Form
        onSubmit={addTodo}
      />
    </header>
  );
};
