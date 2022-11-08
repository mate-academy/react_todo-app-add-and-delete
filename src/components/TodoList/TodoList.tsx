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
  isLoader: boolean,
  isLoaderCompletedTodo: boolean,
  selectedTodoId: number | null,
  completedTodosIds: number[],
  handlerTodoDeleteButton: (id: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  userId,
  title,
  isLoaderCompletedTodo,
  selectedTodoId,
  completedTodosIds,
  isLoader,
  handlerTodoDeleteButton,
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
              isLoader={isLoader}
              selectedTodoId={selectedTodoId}
              completedTodosIds={completedTodosIds}
              handlerTodoDeleteButton={handlerTodoDeleteButton}
              isLoaderCompletedTodo={isLoaderCompletedTodo}
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
              isLoader={isLoader}
              selectedTodoId={selectedTodoId}
              completedTodosIds={completedTodosIds}
              handlerTodoDeleteButton={handlerTodoDeleteButton}
              isLoaderCompletedTodo={isLoaderCompletedTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
