import PropTypes from 'prop-types';
import type { FC } from 'react';
import type { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  processingTodoIds: number[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  processingTodoIds,
  tempTodo,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isProcessing={processingTodoIds.includes(todo.id)}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && <TodoItem key="temp" todo={tempTodo} isProcessing />}
  </section>
);

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
  processingTodoIds: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  tempTodo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }),
  onDelete: PropTypes.func.isRequired,
};
