import React, { useState, useEffect, useRef } from 'react';
import { TodoappHeader } from './components/TodoappHeader';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoappErrorsBlock } from './components/TodoappErrorsBlock';
import { TodoappFooter } from './components/TodoappFooter';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoListItem } from './components/TodoListItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const todoInputRef = useRef<HTMLInputElement>(null);

  const showError = (text: ErrorMessage | '') => {
    setErrorMessage(text);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.LoadTodos));
  }, []);

  const handleAddTodo = (title: string): Promise<void> => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      completed: false,
      title,
    });

    return createTodo({
      title,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setInputValue('');
      })
      .catch(() => {
        showError(ErrorMessage.AddTodo);
        setTempTodo(null);

        throw new Error();
      });
  };

  const handleDeleteTodo = (todoId: number): Promise<void> => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        todoInputRef.current?.focus();
      })
      .catch(() => {
        showError(ErrorMessage.DeleteTodo);
      })
      .finally(() =>
        setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId)),
      );
  };

  const handleDeleteAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prevIds => [...prevIds, ...completedIds]);

    const promises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => null),
    );

    Promise.all(promises)
      .then(result => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => !result.includes(todo.id)),
        );

        if (result.includes(null)) {
          showError(ErrorMessage.DeleteTodo);
        }

        todoInputRef.current?.focus();
      })
      .finally(() =>
        setLoadingTodoIds(prevIds =>
          prevIds.filter(id => !completedIds.includes(id)),
        ),
      );
  };

  const visibleTodos = [...todos].filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoappHeader
          todoInputRef={todoInputRef}
          inputValue={inputValue}
          onAddTodo={handleAddTodo}
          onInputChange={setInputValue}
          changeError={showError}
        />
        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={handleDeleteTodo}
              loadingTodoIds={loadingTodoIds}
            />

            {tempTodo && (
              <TodoListItem todo={tempTodo} onDeleteTodo={handleDeleteTodo} />
            )}

            <TodoappFooter
              todos={todos}
              selectedFilter={filter}
              onFilterChange={setFilter}
              onClearCompleted={handleDeleteAllCompleted}
            />
          </>
        )}
      </div>
      <TodoappErrorsBlock
        errorMessage={errorMessage}
        onDelete={setErrorMessage}
      />
    </div>
  );
};
