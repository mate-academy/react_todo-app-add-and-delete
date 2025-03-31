/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FooterTodo } from './components/FooterTodo';
import { HeaderTodo } from './components/HeaderTodo';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { FilteredBy } from './types/filteredBy';
import { errorNotification } from './constants/errors';
import { focusTodoInput } from './helpers/inputFocus';

const filter = (todos: Todo[], filteredBy: FilteredBy) => {
  if (filteredBy === FilteredBy.ALL) {
    return todos;
  }

  switch (filteredBy) {
    case FilteredBy.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case FilteredBy.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTodosLoading, setIsTodosLoading] = useState(false);
  const [filteredBy, setFilteredBy] = useState(FilteredBy.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTempTodoCreating, setIsTempTodoCreating] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const handleDelete = (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(errorNotification.delete);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
        focusTodoInput();
      });
  };

  useEffect(() => {
    setIsTodosLoading(true);
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(errorNotification.load);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setIsTodosLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filter(todos, filteredBy);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <HeaderTodo
          todos={todos}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          isTempTodoCreating={isTempTodoCreating}
          setIsTempTodoCreating={setIsTempTodoCreating}
        />
        {!isTodosLoading && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            isTempTodoCreating={isTempTodoCreating}
            isLoading={isTodosLoading}
            handleDelete={handleDelete}
            deletingTodoIds={deletingTodoIds}
          />
        )}
        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <FooterTodo
            todos={todos}
            filteredBy={filteredBy}
            setFilteredBy={setFilteredBy}
            handleDelete={handleDelete}
          />
        )}
      </div>
      <ErrorNotification
        message={errorMessage}
        onCloseNotification={setErrorMessage}
      />
    </div>
  );
};
