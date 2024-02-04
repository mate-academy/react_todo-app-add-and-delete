import { useContext } from 'react';
import { FilterTodos } from '../FilterTodos';
import { TodoUpdateContext, TodosContext } from '../../context/TodosContext';
import { Todo } from '../../types/Todo';

export const Footer = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    setDeleteIds,
  } = useContext(TodosContext);
  const { deleteTodo } = useContext(TodoUpdateContext);

  const isCompleted = todos.some(todo => todo.completed);
  const countItems = todos.filter(todo => !todo.completed).length;

  const handleClear = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeleteIds(completedTodoIds);

    try {
      await Promise.all(completedTodoIds.map(id => deleteTodo(id)));

      setTodos((prev: Todo[]) => {
        return prev
          .filter((todo) => !completedTodoIds.includes(todo.id));
      });
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeleteIds([]);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countItems} items left`}
      </span>

      <FilterTodos />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClear}
        disabled={!isCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
