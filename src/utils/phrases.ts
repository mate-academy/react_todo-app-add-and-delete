const translations = {
  'header.title': 'todos',
  'input.placeholder': 'What needs to be done?',

  'footer.itemsLeft': '{count} {noun} left',
  'button.clearCompleted': 'Clear completed',

  'filter.all': 'All',
  'filter.active': 'Active',
  'filter.completed': 'Completed',

  'noun.item': 'item',
  'noun.items': 'items',
  'noun.todo': 'todo',
  'noun.todos': 'todos',

  'error.loadFailed': 'Unable to load todos',
  'error.addFailed': 'Unable to add a todo',
  'error.emptyTitle': 'Title should not be empty',
  'error.deleteFailed': 'Unable to delete a todo',
  'error.bulkDeleteFailed': 'Unable to delete {count} {noun}',
} as const;

type TranslationKey = keyof typeof translations;

type TranslationParams = Record<string, string | number>;

export const filterTranslations = {
  all: 'filter.all',
  active: 'filter.active',
  completed: 'filter.completed',
} as const satisfies Record<string, TranslationKey>;

export function t(key: TranslationKey, options?: TranslationParams): string {
  let text = translations[key];

  if (!options) {
    return text;
  }

  Object.entries(options).forEach(([param, value]) => {
    text = text.replace(`{${param}}`, String(value)) as typeof text;
  });

  return text;
}

export function getNoun(
  count: number,
  singularKey: TranslationKey,
  pluralKey: TranslationKey,
): string {
  return count === 1 ? t(singularKey) : t(pluralKey);
}
