import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import './styles.scss';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (value: number) => void;
  onUpdate: (id: number, data: { completed: boolean; }) => void;
  isProcessing: (id: number) => boolean;
  isCreated: boolean;
  newTodo: Todo;
};

export const TodoList: React.FC<Props> = ({
  todos, onDelete, onUpdate, isProcessing, isCreated, newTodo,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              isProcessing={isProcessing}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}

        {isCreated && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={newTodo}
              isProcessing={isProcessing}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
