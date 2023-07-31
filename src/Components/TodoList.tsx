import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[],
  deleteTodo:(value:number) => Promise<void>;
  tempTodo:Todo | null;
  loading:boolean;
  idToDelete:number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  tempTodo,
  loading,
  idToDelete,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              deleteTodo={deleteTodo}
              todo={todo}
              idToDelete={idToDelete}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >

            <TodoItem todo={tempTodo} isLoading={loading} />

          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
