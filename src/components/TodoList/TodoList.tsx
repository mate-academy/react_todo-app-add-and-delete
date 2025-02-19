import React from 'react';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  tempTodo: Todo | null;
  filteredTodos: Todo[];
  handleUpdate: (id: number, completed: boolean) => void;
  handleDelete: (id: number) => void;
  isSubmiting: boolean;
  loader: number;
};
export const TodoList: React.FC<Props> = ({
  tempTodo,
  filteredTodos,
  handleUpdate,
  handleDelete,
  isSubmiting,
  loader,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {(!tempTodo ? filteredTodos : [...filteredTodos, tempTodo]).map(
          todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                isSubmiting={isSubmiting}
                loader={loader}
              />
            </CSSTransition>
          ),
        )}
      </TransitionGroup>
    </section>
  );
};
