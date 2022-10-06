import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  title: string,
  isAdding: boolean,
  todos: Todo[],
  selectedTodos: number[],
  removeTodo: CallableFunction,
};

export const TodoList: React.FC<Props> = ({
  title,
  isAdding,
  todos,
  selectedTodos,
  removeTodo,
}) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              isProcessed={selectedTodos.includes(todo.id)}
              todo={todo}
              onDelete={removeTodo}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            className="temp-item"
          >
            <TodoItem
              todo={{
                id: Math.random(),
                title,
                completed: false,
                userId: user?.id || 0,
              }}
              onDelete={removeTodo}
              isProcessed
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
