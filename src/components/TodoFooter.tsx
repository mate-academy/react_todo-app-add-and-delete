import { Todo } from '../types/Todo';
import { TodoFilters } from '../types/TodoFilters';
import { StatusTodo } from './StatusTodo';
import { СlearCompletedBtn } from './СlearCompletedBtn';

type TodoFooterProps = {
  todos: Todo[];
  todoFilter: TodoFilters;
  setTodoFilter: (val: TodoFilters) => void;
  handleDeleteTodo: (val: Todo) => void;
};

export const TodoFooter = ({
  todos,
  todoFilter,
  setTodoFilter,
  handleDeleteTodo,
}: TodoFooterProps) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodo = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <StatusTodo todoFilter={todoFilter} onTodoFilter={setTodoFilter} />

      <СlearCompletedBtn
        completedTodo={completedTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </footer>
  );
};
