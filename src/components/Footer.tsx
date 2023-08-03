import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TabsFooter } from '../enums/TabsFooter';
import { deleteTodos } from '../api/todos';

type Props = {
  todos: Todo[],
  setAvtiveTab: React.Dispatch<React.SetStateAction<TabsFooter>>;
  avtiveTab: TabsFooter,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: (v: string) => void,
  setHiddenError: (v: boolean) => void,
  setItemId: (v: number[]) => void,
  setLoading: (v: boolean) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  setAvtiveTab,
  avtiveTab,
  setTodos,
  setErrorMessage,
  setHiddenError,
  setItemId,
  setLoading,
}) => {
  const tabs: string[] = Object.values(TabsFooter);
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const finedCompleted = todos.find(todo => todo.completed);
  const handleTabs = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.currentTarget.textContent) {
      setAvtiveTab(TabsFooter[e.currentTarget.textContent as TabsFooter
        || TabsFooter.All]);
    }
  };

  const handleCatch = () => {
    setHiddenError(false);
    setTimeout(() => setHiddenError(true), 3000);
    setErrorMessage('Unable to delete a todo');
  };

  const handleClear = () => {
    const completed = todos.filter(todo => todo.completed);

    setLoading(true);
    setItemId(completed.map(el => el.id));

    completed.forEach(todo => deleteTodos(todo.id)
      .then(() => setTodos(todos.filter(t => !t.completed)))
      .catch(handleCatch)
      .finally(() => setLoading(false)));
  };

  return (
    <>
      {Boolean(todos.length) && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${itemsLeft} items left`}
          </span>

          <nav className="filter">
            {tabs.map((tab) => (
              <a
                href={`#/${tab !== TabsFooter.All ? tab.toLocaleLowerCase() : ''}`}
                className={classNames('filter__link',
                  { selected: avtiveTab === tab })}
                onClick={handleTabs}
                key={tab}
              >
                {tab}
              </a>
            ))}
          </nav>

          <div className="todoapp__clear-completed__wrapper">
            { finedCompleted && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={handleClear}
              >
                Clear completed
              </button>
            )}
          </div>
        </footer>
      )}
    </>
  );
};
