import { Dispatch, SetStateAction, useContext } from 'react';
import { StateContext } from '../../store/Store';
import { TodoItem } from '../TodoItem/TodoItem';
import { handleFilteredTodos } from '../../utils/helpers';
import { TempTodo } from '../TempTodo/TempTodo';
import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo | null;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  isDeleting: boolean;
};

export const TodoList: React.FC<Props> = ({
  tempTodo,
  setIsDeleting,
  isDeleting,
}) => {
  const { todos, sortBy } = useContext(StateContext);

  const filteredTodos = handleFilteredTodos(todos, sortBy);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            setIsDeleting={setIsDeleting}
            isDeleting={isDeleting}
          />
        );
      })}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
