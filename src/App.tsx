/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Header } from './components/Header/Header';
import { useHooks } from './hooks/general';
import { ErrorMsg } from './components/ErrorMsg/ErrorMsg';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/Footer/Footer';
import { TempTodo } from './components/TodoItem/TempTodo';

export const App: React.FC = () => {
  const hooks = useHooks();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={hooks.todosFromServer}
          query={hooks.query}
          setQuery={hooks.setQuery}
          addTodo={hooks.addTodo}
          disabled={hooks.disabled}
          inputRef={hooks.inputRef}
          patch={hooks.toggleAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {hooks.visibleTodos &&
            hooks.visibleTodos.map(todo => (
              <TodoItem
                todo={todo}
                loading={hooks.loading.includes(todo.id)}
                key={todo.id}
                del={hooks.deleteTodo}
                patch={hooks.patchTodo}
              />
            ))}
          {hooks.tempTodo && <TempTodo todo={hooks.tempTodo} />}
        </section>
        {hooks.todosFromServer.length > 0 && (
          <Footer
            filter={hooks.filter}
            setFilter={hooks.setFilter}
            todos={hooks.todosFromServer}
            clear={hooks.clear}
          />
        )}

        <ErrorMsg error={hooks.error} setError={hooks.setError} />
      </div>
    </div>
  );
};
