import React from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  tempTodo?: Todo | null;
  loading?: boolean;
};

const TodoList: React.FC<Props> = React.memo(({ todos, handleDeleteTodo, tempTodo, loading = false }) => {

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 &&
        todos.map(todo =>
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDeleteTodo={handleDeleteTodo}
            loading={loading}
          />)}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeleteTodo={() => { }}
          loading={true}
        />
      )}
    </section>
  );
});

TodoList.displayName = 'TodoList';
export default TodoList;
