import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: (Todo[]),
  onDelete: (todoId: number) => void,
  onChangeCompleted: (todoId: number) => void,
  tempTodo: Todo | null,
  deletedTodoId: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onChangeCompleted,
  tempTodo,
  deletedTodoId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            deletedTodoId={deletedTodoId}
            onChangeCompleted={onChangeCompleted}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoInfo
            todo={tempTodo}
            onChangeCompleted={onChangeCompleted}
            onDelete={onDelete}
            deletedTodoId={deletedTodoId}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
