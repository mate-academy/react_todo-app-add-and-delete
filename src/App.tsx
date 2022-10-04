/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoFooter } from './components/todos/TodoFooter';
import { TodoHeader } from './components/todos/TodoHeader';
import { TodoList } from './components/todos/TodoList';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [addError, setAddError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [updateError, setUpdateError] = useState(false);

  const [isAdding, setIsAdding] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState('All');

  const hasError = (isVisible?: boolean) => {
    if (isVisible === false) {
      setAddError(false);
      setDeleteError(false);
      setUpdateError(false);
    }

    return addError || deleteError || updateError;
  };

  const loadData = async () => {
    if (user) {
      const temp = await getTodos(user.id);

      setTodos(temp);
      setVisibleTodos(temp);
      setTempTodo(null);
    }
  };

  const filterByStatus = (activedStatus: string): Todo[] => {
    switch (activedStatus) {
      case 'Active':
        return todos.filter(todo => !todo.completed);

      case 'Completed':
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setVisibleTodos(filterByStatus(status));
  }, [status]);

  console.log(visibleTodos);

  const addTodo = async (value: string) => {
    setIsAdding(true);

    if (user && value) {
      setTempTodo({
        id: 0,
        userId: user.id,
        title: value,
        completed: false,
      });
      await postTodo(user.id, value);
      console.log('posted');
      loadData();
    } else {
      setAddError(true);
    }

    setIsAdding(false);
  };

  const removeTodo = async (id: number) => {
    await deleteTodo(id);
    loadData();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          addTodo={addTodo}
          isAdding={isAdding}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
        />

        <TodoFooter
          todos={todos}
          selected={status}
          setStatus={setStatus}
        />
      </div>

      {/* ↓↓↓ I use this code in the following tasks ↓↓↓ */}

      {hasError() && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => hasError(false)}
          />
          {addError && 'Unable to add a todo'}
          <br />
          {deleteError && 'Unable to delete a todo'}
          <br />
          {updateError && 'Unable to update a todo'}
        </div>
      )}
    </div>
  );
};
