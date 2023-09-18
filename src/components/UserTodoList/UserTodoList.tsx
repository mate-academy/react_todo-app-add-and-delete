import React, { useContext } from 'react';
import { TodoForm } from '../TodoForm';
import { TodoList } from '../TodoList';
import { TodoFilter } from '../TodoFilter';
import { Notification } from '../common';
import { Section } from '../section';
import { DispatchContext, StateContext } from '../GlobalStateProvider';

export const UserTodoList: React.FC = () => {
  const { todos, error } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const hasTodos = !!todos.length;
  const onClose = () => (
    dispatch({ type: 'SET_ERROR', payload: '' })
  );

  return (
    <Section title="todos">
      <div className="todoapp__content">
        <TodoForm />

        {hasTodos && <TodoList />}

        {hasTodos && <TodoFilter />}
      </div>

      {error && (
        <Notification
          error={error}
          closeNotification={onClose}
        />
      )}
    </Section>
  );
};
