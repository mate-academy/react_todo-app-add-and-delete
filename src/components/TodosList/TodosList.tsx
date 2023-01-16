import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import '../../styles/todosList.scss';

interface Props {
  todos: Todo[],
  newTodo?: Todo,
  isAdding?: boolean,
  handleDelete: (event: React.MouseEvent<HTMLButtonElement>) => void,
  deletedId: number[] | null,
}

export const TodosList: React.FC<Props> = ({
  todos,
  newTodo,
  isAdding,
  handleDelete,
  deletedId,
}) => {
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
              todo={todo}
              key={todo.id}
              handleDelete={handleDelete}
              deletedId={deletedId}
            />
          </CSSTransition>
        ))}
        {newTodo
          && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={newTodo}
                isAdding={isAdding}
              />
            </CSSTransition>
          )}
      </TransitionGroup>
    </section>
  );
};
