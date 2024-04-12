import React, { useContext, useEffect, useMemo } from 'react';
import {
  Actions,
  DispatchContext,
  FilterValue,
  StateContext,
} from '../../Store';
import { Todo as TodoType } from '../../types/Todo';
import { getTodos } from '../../api/todos';
import { Todo } from '../Todo';

export const TodoList: React.FC = () => {
  const { todos, filterStatus, isAdding, tempTodo } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    getTodos()
      .then(items => {
        return dispatch({
          type: Actions.loadTodos,
          todos: items,
        });
      })
      .catch(error => {
        dispatch({
          type: Actions.setErrorLoad,
          payload: '',
        });
        dispatch({
          type: Actions.setErrorLoad,
          payload: 'Unable to load todos',
        });

        throw error;
      });
  }, [dispatch]);

  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterValue.Active:
        return todos.filter((todo: TodoType) => !todo.completed);
      case FilterValue.Completed:
        return todos.filter((todo: TodoType) => todo.completed);
      default:
        return todos;
    }
  }, [filterStatus, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: TodoType) => {
        return <Todo key={todo.id} todo={todo} />;
      })}
      {isAdding && tempTodo && <Todo todo={tempTodo} />}
    </section>
  );
};
