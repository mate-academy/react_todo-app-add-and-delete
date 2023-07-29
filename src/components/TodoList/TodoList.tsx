import { useContext } from 'react';
import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem';
import { TodoContext } from '../../context/TodoContext';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(TodoContext);

  return (
    <>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} tempLoader />}
    </>
  );
};
