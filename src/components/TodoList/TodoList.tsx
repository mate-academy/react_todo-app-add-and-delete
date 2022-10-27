import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import './TodoList.scss';

type Props = {
  todos: Todo[] | null,
  isAdding: boolean,
  userId: number,
  title: string,
  isRemoving: boolean,
  selectedTodoId: number | null,
  completedTodosIds: number[],
  handleTodoDeleteButton: (id: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  userId,
  title,
  isRemoving,
  selectedTodoId,
  completedTodosIds,
  handleTodoDeleteButton,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos?.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              isAdding={isAdding}
              isRemoving={isRemoving}
              selectedTodoId={selectedTodoId}
              completedTodosIds={completedTodosIds}
              handleTodoDeleteButton={handleTodoDeleteButton}
            />
          </CSSTransition>
        ))}
        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={{
                id: 0,
                userId,
                completed: false,
                title,
              }}
              isAdding={isAdding}
              isRemoving={isRemoving}
              selectedTodoId={selectedTodoId}
              completedTodosIds={completedTodosIds}
              handleTodoDeleteButton={handleTodoDeleteButton}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
