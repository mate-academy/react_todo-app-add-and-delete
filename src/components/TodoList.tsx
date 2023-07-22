import React, { useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  hideError: () => void;
  proccessedTodoIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  hideError,
  proccessedTodoIds,
  tempTodo,
}) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
              hideError={hideError}
              isProcessing={proccessedTodoIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
