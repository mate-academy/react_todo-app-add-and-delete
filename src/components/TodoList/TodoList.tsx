import React, { useContext, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TempTodo, Todo } from '../Todo';
import * as todoService from '../../api/todos';
import { ITodo, StatusType } from '../../types';
import { DispatchContext, StateContext } from '../GlobalStateProvider';

const getVisibleTodos = (todos: ITodo[], filter: StatusType) => {
  switch (filter) {
    case StatusType.Active:
      return todos.filter((todo) => !todo.completed);
    case StatusType.Completed:
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

export const TodoList: React.FC = () => {
  const {
    todos, filter, tempTodo, loading,
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, filter),
    [todos, filter],
  );

  const deleteTodo = async (todoId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });
    dispatch({ type: 'SET_SELECTED', payload: todoId });

    try {
      await todoService.deleteTodo(todoId);

      dispatch({ type: 'DELETE_TODO', payload: todoId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Unable to delete a todo' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_SELECTED', payload: null });
    }
  };

  const editTodo = (todoId: number, newTitle: string) => {
    if (!todoId || !newTitle) {
      dispatch({ type: 'SET_ERROR', payload: 'Unable to edit todo' });
    }

    // console.log('Edit todo', todoId, newTitle);
  };

  const toggleTodoStatus = (todoId: number) => {
    if (!todoId) {
      dispatch({ type: 'SET_ERROR', payload: 'Unable to toggle todo status' });
    }

    // console.log('Toggle todo status', todoId);
  };

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <Todo
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              toggleTodoStatus={toggleTodoStatus}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodo
              todo={tempTodo}
              loading={loading}
            />

          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
