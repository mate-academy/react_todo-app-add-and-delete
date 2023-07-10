/* eslint-disable jsx-a11y/control-has-associated-label */
import { FormEvent, useState } from 'react';
import { useTodoContext } from '../hooks/useTodoContext';

const TodoHeader = () => {
  const {
    todos,
    USER_ID,
    tempTodo,
    onCreateTodo,
  } = useTodoContext();
  const [newTodo, setNewTodo] = useState('');

  const handleCreateTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      title: newTodo,
      userId: USER_ID,
      completed: false,
    };

    await onCreateTodo(data);
    setNewTodo('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button type="button" className="todoapp__toggle-all active" />
      )}

      <form onSubmit={handleCreateTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>

  );
};

export default TodoHeader;
