import { FC, useContext } from 'react';
import { Todo } from '../../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../../../context/TodoContext';

interface TodoListProps {
  todos: Todo[];
}

export const TodoList: FC<TodoListProps> = ({ todos }) => {
  const { tempTodo } = useContext(TodosContext);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </section>
      {tempTodo && (
        <TodoItem todo={tempTodo} key={tempTodo.id} isLoading={true} />
      )}
    </>
  );
};
