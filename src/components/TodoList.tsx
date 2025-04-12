import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  activeTodoIds: number[];
  tempTodo: Todo | null;
  setActiveTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

const TodoList = ({
  filteredTodos,
  activeTodoIds,
  setActiveTodoIds,
  tempTodo,
  setError,
  inputRef,
  setTodos,
}: Props) => {
  const displayTodos = tempTodo ? [...filteredTodos, tempTodo] : filteredTodos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {displayTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              activeTodoIds={activeTodoIds}
              setActiveTodoIds={setActiveTodoIds}
              setError={setError}
              inputRef={inputRef}
              setTodos={setTodos}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};

export default TodoList;
