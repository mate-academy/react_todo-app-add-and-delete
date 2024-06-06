import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

export interface TodoListType {
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<TodoListType> = ({ todos, inputRef }) => {
  return (
    <div>
      {todos.map((item, index) => (
        <TodoItem todo={item} key={'id: ' + index} inputRef={inputRef} />
      ))}
    </div>
  );
};
