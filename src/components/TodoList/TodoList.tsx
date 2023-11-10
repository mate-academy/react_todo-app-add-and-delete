/* eslint-disable no-console */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AppDispatch, RootState } from '../../redux/store';
import { setErrorType } from '../../redux/todoSlice';
import { deleteTodo } from '../../redux/todoThunks';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/errorType';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  todos: Todo[];
}

export const TodoList: React.FC<TodoListProps> = React.memo(
  ({ todos }) => {
    console.log('Rendering TodoList');

    const dispatch = useDispatch<AppDispatch>();
    const tempTodo = useSelector((state: RootState) => state.todos.tempTodo);
    const combinedTodos = tempTodo ? [...todos, tempTodo] : todos;
    const deletingTodoIds = useSelector(
      (state: RootState) => state.todos.deletingTodoIds,
    );

    const handleDeleteTodo = (todoId: number) => {
      dispatch(deleteTodo(todoId))
        .catch((err: string) => {
          console.error('Unable to delete todo:', err);
          dispatch(setErrorType(ErrorType.DeleteTodoError));
        });
    };

    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {combinedTodos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="temp-item"
              unmountOnExit={todo === tempTodo}
            >
              <TodoItem
                todo={todo}
                isTemporary={todo === tempTodo}
                onDelete={handleDeleteTodo}
                isDeleting={deletingTodoIds.includes(todo.id)}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </section>
    );
  },
);
