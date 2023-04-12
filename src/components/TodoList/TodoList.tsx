import React, { useState } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import './TodoList.scss';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
// import { deleteTodo } from '../../api/todos';

export const USER_ID = 6980;

interface Props {
  visibleTodos: Todo[];
  // deleteById: (todoId: number) => Promise<unknown>,
}

type DefaultTodo = Todo | null;

export const TodoList: React.FC<Props> = ({ visibleTodos }) => {
  const [
    creating,
    // setCreating,
    // deleteById,
  ] = useState<DefaultTodo>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              // isProcessed={processings.includes(todo.id)}
              // onDelete={() => deleteById(todo.id)}
              // onUpdate={updateTodo}
            />
          </CSSTransition>
        ))}

        {creating && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={{
                id: Math.random(),
                title: 'shit',
                completed: false,
                userId: USER_ID,
              }}
              // isProcessed
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
