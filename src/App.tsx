/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { Filter } from './types/Filter';
import { Error } from './types/ErrorMsg';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMsg, setErrorMsg] = useState<Error | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [deletingId, setDeletingId] = useState<number[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setErrorMsg('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMsg(Error.Fetch);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleErrorClose = () => {
    setErrorMsg('');
  };

  const onAddTodo = (title: string) => {
    setIsSubmiting(true);
    setErrorMsg('');

    const newTodo = {
      id: 0,
      title: title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    addTodo(newTodo)
      .then(created => {
        setTodos(prev => [...prev, created]);
        setTodoTitle('');
      })
      .catch(error => {
        setErrorMsg(Error.Add);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmiting(false);
      });
  };

  const handleOnDelete = (id: number) => {
    setDeletingId(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMsg(Error.Delete);
      })
      .finally(() => {
        setDeletingId(prev => prev.filter(i => i !== id));
      });
  };

  const onDeleteCompletedTodos = () => {
    const completedIds = todos.filter(todo => todo.completed);

    if (completedIds.length === 0) {
      return;
    }

    completedIds.forEach(todo => {
      handleOnDelete(todo.id);
    });
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length > 0,
    [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          isSubmiting={isSubmiting}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onAddTodo={onAddTodo}
          setErrorMsg={setErrorMsg}
        />

        <TodoList
          todos={filteredTodos}
          isLoading={isLoading}
          deletingId={deletingId}
          handleOnDelete={handleOnDelete}
        />

        {tempTodo && <TodoItem todo={tempTodo} isSubmiting />}

        {todos.length !== 0 && (
          <TodoFooter
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompletedTodos={onDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errorMsg={errorMsg} onClose={handleErrorClose} />
    </div>
  );
};
