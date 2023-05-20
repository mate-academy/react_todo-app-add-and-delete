import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/types/Todo';
import { ToDoInfo } from '../ToDoInfo/ToDoInfo';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void,
  tempoTodo: Todo | null,
  processingTodosIds: number[],
  updateTodo: (id: number, data: Partial<Todo>) => void
};

export const ToDoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempoTodo,
  processingTodosIds,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={400}
            classNames="item"
          >
            <ToDoInfo
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              processingTodosIds={processingTodosIds}
              updateTodo={updateTodo}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
      {tempoTodo && (
        <ToDoInfo
          todo={tempoTodo}
          deleteTodo={deleteTodo}
          processingTodosIds={processingTodosIds}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};
