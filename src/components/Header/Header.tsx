import { Todo } from "../../types/Todo";
import { NoIdTodo } from "../../types/NoIdTodo";
import { TodosContext } from "../../components/TodosProvider";
import { useContext, useState } from "react";
import { USER_ID } from "../../utils/constants";



export const Header: React.FC = () => {
  const {addTodoHandler, todosFromServer, setTodosError, setIsShowErrors} = useContext(TodosContext);
  const isActiveTodos = todosFromServer.some((todo) => !todo.completed);
  const [newTodo, setNewTodo] = useState("");
  

  const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      if(!newTodo || !newTodo.trim()) {
        setTodosError('Title should not be empty');
        setIsShowErrors(true);
        return;
      }

      const post:NoIdTodo = {
        userId: USER_ID,
        title: newTodo.trim(),
        completed: false,
      }
      addTodoHandler(post);
      setNewTodo('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!isActiveTodos && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="ToggleAllButton"
        />
      )}
      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          aria-label="NewTodoField"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </form>
    </header>
  );
};
