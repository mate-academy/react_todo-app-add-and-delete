import { useContext } from 'react';
import { TodosContext } from '../TodoContext';
import { TodoTitleField } from '../TodoTitleField';

export const TodoList:React.FC = () => {
  const {
    filteredTodos,
    tempTodo,
  } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.length !== 0
      && (
        <form>
          {filteredTodos.map((todo) => (
            <TodoTitleField
              todo={todo}
              key={todo.id}
            />
          ))}
        </form>
      )}
      {tempTodo
        && (
          <TodoTitleField
            key={tempTodo.id}
            todo={tempTodo}
          />
        )}
    </section>
  );
};
