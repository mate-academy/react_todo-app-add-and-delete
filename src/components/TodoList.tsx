import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Todo } from '../types/Todo';
import { Filter } from '../App';
import { TodoItem } from '../components/TodoItem';

type Props = {
  todos: Todo[];
  isTodoEditing: boolean;
  selectedPostId: number;
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>;
  selectedFilter: Filter;
  tempTodo: Todo | null;
  onDelete: (todoId: number) => Promise<void>;
  processingTodoIds: number[];

};

export const TodoList: React.FC<Props> = ({
  todos,
  isTodoEditing,
  selectedPostId,
  setIsTodoEditing,
  setSelectedPostId,
  selectedFilter,
  tempTodo,
  onDelete,
}) => {
  let todosCopy: Todo[] = [];

  switch (selectedFilter) {
    case Filter.all:
      todosCopy = [...todos];
      break;

    case Filter.active:
      todosCopy = [...todos].filter(todo => !todo.completed);
      break;

    case Filter.completed:
      todosCopy = [...todos].filter(todo => todo.completed);
      break;

    default:
      todosCopy = [...todos];
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todosCopy.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              isTodoEditing={isTodoEditing}
              selectedPostId={selectedPostId}
              setIsTodoEditing={setIsTodoEditing}
              setSelectedPostId={setSelectedPostId}
              onDelete={onDelete}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isTodoEditing={false}
              selectedPostId={0}
              setIsTodoEditing={() => {}}
              setSelectedPostId={() => {}}
              onDelete={async () => Promise.resolve()}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
