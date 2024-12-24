import { TodoList } from './todoList';
import { TypeTodoList } from '../types/Todo';
import { TempTodo } from './tempTodo';

export const MainSection: React.FC<TypeTodoList> = ({
  filteredTodoList,
  deletingTodos,
  handleToggleCompletion,
  handleDeleteTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoList
        filteredTodoList={filteredTodoList}
        deletingTodos={deletingTodos}
        handleToggleCompletion={handleToggleCompletion}
        handleDeleteTodo={handleDeleteTodo}
      />

      <TempTodo tempTodo={tempTodo} />
    </section>
  );
};
