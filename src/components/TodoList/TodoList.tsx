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
  setIsError: (value: string | null) => void,
  isRemoving: boolean,
  setIsRemoving: (value: boolean) => void,
  selectedTodoId: number | null,
  setSelectedTodoId: (value : number | null) => void,
  completedTodosIds: number [],
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  userId,
  title,
  setIsError,
  isRemoving,
  setIsRemoving,
  selectedTodoId,
  setSelectedTodoId,
  completedTodosIds,
}) => {
  const tempTodo = {
    id: 0,
    userId,
    completed: false,
    title,
  };

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
              setIsError={setIsError}
              isRemoving={isRemoving}
              setIsRemoving={setIsRemoving}
              selectedTodoId={selectedTodoId}
              setSelectedTodoId={setSelectedTodoId}
              completedTodosIds={completedTodosIds}
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
              todo={tempTodo}
              isAdding={isAdding}
              setIsError={setIsError}
              isRemoving={isRemoving}
              setIsRemoving={setIsRemoving}
              selectedTodoId={selectedTodoId}
              setSelectedTodoId={setSelectedTodoId}
              completedTodosIds={completedTodosIds}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
