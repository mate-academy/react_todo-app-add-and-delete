import React, {
  useContext, useEffect, useState,
} from 'react';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { getTodos } from '../api/todos';
import { AuthContext } from './Auth/AuthContext';
import { Todo } from '../types/Todo';
import { ErorTypes } from '../types/ErrorTypes';

type Props = {
  newTodoField: React.LegacyRef<HTMLInputElement> | undefined,
  setIsErrorMessage: (value: ErorTypes) => void,
};

export const TodoContent: React.FC<Props> = ({
  newTodoField, setIsErrorMessage,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const user = useContext(AuthContext);

  useEffect(() => {
    if (user?.id) {
      getTodos(user.id)
        .then(todo => {
          setTodos(todo);
          setVisibleTodos(todo);
        })
        .catch(() => setIsErrorMessage(ErorTypes.load));
    }
  }, []);

  const handleAddTodo = async (event:React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (user) {
    }
  };

  return (
    <div className="todoapp__content">
      <header className="todoapp__header">
        <button
          aria-label="ToggleAllButton"
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />

        <form>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
          />
        </form>
      </header>

      <TodoList visibleTodos={visibleTodos} />
      <Footer
        todos={todos}
        visibleTodos={visibleTodos}
        setVisibleTodos={setVisibleTodos}
      />
    </div>
  );
};
