import { FC } from 'react';
import { CreatedTodo, Todo } from '../types/Todo';

interface Props {
  title: string;
  setTitle: (value: string) => void;
  handleSubmit: (data: CreatedTodo) => Promise<Todo | void>;
  userId: number;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

export const TodoHeader: FC<Props> = ({
  title,
  setTitle,
  handleSubmit,
  userId,
  todos,
  setTodos,
}) => {
  const isAllTodosComleted = todos.every(todo => todo.completed === true);

  const handleToggleAll = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !isAllTodosComleted,
    }));

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      {/* Toggle all todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={`todoapp__toggle-all ${isAllTodosComleted ? 'active' : ''}`}
        onClick={handleToggleAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={(event) => {
        event.preventDefault();
        handleSubmit({
          title,
          completed: false,
          userId,
        });
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
