export const sortArrByKey = (items: any[], key: string): any[][] => {
  const sortedByKey = items.reduce(
    (next, item) => ({
      ...next,
      [item[key]]: [...(next[item[key]] || []), item],
    }),
    []
  );

  return Object.entries(sortedByKey);
};
