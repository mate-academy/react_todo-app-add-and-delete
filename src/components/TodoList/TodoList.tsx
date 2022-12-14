import { useContext } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  curTitle: string,
  onDelete: (id: number) => void,
  loadingTodosIds: number[]
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    onDelete,
    loadingTodosIds,
    isAdding,
    curTitle,
  } = props;

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
              todo={todo}
              onDelete={onDelete}
              isLoading={loadingTodosIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {isAdding && user && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={{
                id: 0,
                title: curTitle,
                completed: false,
                userId: user?.id,
              }}
              onDelete={onDelete}
              isLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
