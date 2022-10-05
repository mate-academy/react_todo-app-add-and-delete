import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FilterTypes } from '../types/Filter';

interface Props {
  tabs: FilterTypes[],
  selectedTabId: string,
  onTabSelected: (value: FilterTypes) => void,
}
export const Filter: React.FC<Props> = (
  {
    tabs,
    selectedTabId,
    onTabSelected,
  },
) => {
  const selectedTab = useMemo(() => {
    return tabs.find(tab => tab.id === selectedTabId) || tabs[0];
  }, [selectedTabId]);

  const handelClick = useMemo(() => {
    return (tab: FilterTypes) => {
      if (selectedTabId !== tab.id) {
        onTabSelected(tab);
      }
    };
  }, [selectedTabId]);

  return (
    <nav className="filter" data-cy="Filter">
      {tabs.map((tab: FilterTypes) => (
        <a
          key={tab.id}
          href={`#${tab.id}`}
          data-cy="FilterLinkAll"
          className={classNames('filter__link',
            {
              selected: tab.id === selectedTab.id,
            })}
          onClick={() => handelClick(tab)}
        >
          {tab.title}
        </a>

      ))}
    </nav>
  );
};
