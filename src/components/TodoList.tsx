import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

export interface TodoListType {
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<TodoListType> = ({ todos, inputRef }) => {
  return (
    <ul>
      {todos.map(item => (
        <TodoItem todo={item} key={item.id} inputRef={inputRef} />
      ))}
    </ul>
  );
};
