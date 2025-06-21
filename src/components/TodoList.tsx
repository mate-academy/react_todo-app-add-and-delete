/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodoItem } from './TempTodo';

type Props = {
  filteredTodos: Todo[];
  selectedTodo?: Todo | null;
  setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  deleteChosenTodo: (currentTodoToDelete: Todo | null) => void;
  focusedTodoRef: React.RefObject<HTMLInputElement>;
  shouldDeleteCompleted: boolean;
  tempTodo: Todo | null;
  updateChosenTodo: (todoSetToUpdate: Todo | null) => void;
  shouldToggleAllCompleted: boolean;
  currentTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  selectedTodo,
  setSelectedTodo,
  deleteChosenTodo,
  focusedTodoRef,
  shouldDeleteCompleted,
  tempTodo,
  updateChosenTodo,
  shouldToggleAllCompleted,
  currentTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.length !== 0 && (
        <div>
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
              deleteChosenTodo={deleteChosenTodo}
              focusedTodoRef={focusedTodoRef}
              shouldDeleteCompleted={shouldDeleteCompleted}
              key={todo.id}
              updateChosenTodo={updateChosenTodo}
              shouldToggleAllCompleted={shouldToggleAllCompleted}
              currentTodos={currentTodos}
            />
          ))}

          {tempTodo && <TempTodoItem tempTodo={tempTodo} />}
        </div>
      )}
    </section>
  );
};
