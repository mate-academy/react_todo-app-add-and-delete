export function addLoadingIds(id: number, loadingIds: number[] | null) {
  if (loadingIds === null) {
    const withAddedId = [id];

    return withAddedId;
  }

  const withAddedId = [...loadingIds, id];

  return withAddedId;
}

export function deleteLoadingIds(id: number, loadingIds: number[] | null) {
  if (loadingIds === null) {
    return null;
  }

  const withAddedId = loadingIds.filter(loadingId => loadingId !== id);

  return withAddedId;
}
