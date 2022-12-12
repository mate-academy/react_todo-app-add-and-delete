import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TempTodoItem } from './TempTodoItem';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[],
  isAdding: boolean,
  newTodoTitle: string,
  onDelete: (todoId: number) => void,
  onRename: (todoId: number, title: string) => void,
  isProcessing: number[],
  onComplete: (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    visibleTodos,
    isAdding,
    newTodoTitle,
    onDelete, onRename,
    isProcessing,
    onComplete,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup component={null}>
          {visibleTodos.map(todo => (
            <CSSTransition
              key={todo.id}
              classNames="item"
              timeout={300}
            >
              <TodoItem
                key={todo.id}
                todo={todo}
                isProcessing={isProcessing.includes(todo.id)}
                onDelete={onDelete}
                onRename={onRename}
                onComplete={onComplete}
              />
            </CSSTransition>
          ))}

          {isAdding && (
            <CSSTransition
              key={0}
              classNames="item"
              timeout={300}
            >
              <TempTodoItem newTodoTitle={newTodoTitle} />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);
