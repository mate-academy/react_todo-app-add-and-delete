import React, { useContext, useEffect, useRef, useState } from 'react';
import { postTodo, USER_ID } from '../../api/todos';
import { DispatchContext, StateContext } from '../../store/TodoContext';
import { ActionTypes } from '../../store/types';
import { Todo } from '../../types/Todo';

export const TodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const { refresh, tempTodo } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'Title should not be empty',
      });
      setTimeout(() => {
        dispatch({ type: ActionTypes.SET_ERROR, payload: null });
      }, 3000);

      return;
    }

    const todo: Omit<Todo, 'id'> = {
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    if (USER_ID) {
      dispatch({
        type: ActionTypes.ADD_TEMP_TODO,
        payload: { ...todo, id: 0 },
      });
      postTodo(todo)
        .then(newTodo => {
          setTitle('');
          dispatch({ type: ActionTypes.ADD_TODO, payload: newTodo });
        })
        .catch(() => {
          dispatch({
            type: ActionTypes.SET_ERROR,
            payload: 'Unable to add a todo',
          });
        })
        .finally(() => {
          dispatch({ type: ActionTypes.ADD_TEMP_TODO, payload: null });
          dispatch({ type: ActionTypes.SET_REFRESH });
        });
    }
  };

  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, [refresh]);

  return (
    <form onSubmit={onSubmit}>
      <input
        ref={todoField}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={!!tempTodo}
      />
    </form>
  );
};
