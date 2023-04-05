import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListPropsType {
  todosToShow: Todo[],
  todoDelete: (todoId: number) => void,
  deletedId: number,
  tempTodo: Todo,
  added: boolean,
}

export const TodoList: React.FC<TodoListPropsType> = ({
  todosToShow,
  todoDelete,
  deletedId,
  tempTodo,
  added,
}) => {
  const todosToShown = added ? [...todosToShow, tempTodo] : todosToShow;

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todosToShown.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              deletedId={deletedId}
              todoDelete={todoDelete}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
