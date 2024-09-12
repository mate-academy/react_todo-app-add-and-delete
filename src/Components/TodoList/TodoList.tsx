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
import { TransitionGroup, CSSTransition } from 'react-transition-group';

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
          payload: 'Unable to load todos',
        });

        throw error;
      });
  }, [dispatch]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo: TodoType) => {
      switch (filterStatus) {
        case FilterValue.Active:
          return !todo.completed;
        case FilterValue.Completed:
          return todo.completed;
        default:
          return todos;
      }
    });
  }, [filterStatus, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map((todo: TodoType) => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <Todo todo={todo} />
          </CSSTransition>
        ))}
        {isAdding && tempTodo && (
          <CSSTransition timeout={300} classNames="temp-item">
            <Todo todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
