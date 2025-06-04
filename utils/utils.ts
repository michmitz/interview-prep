export const sortArrByKey = <T extends Record<string, any>>(items: T[], key: string): T[] => {
  return [...items].sort((a, b) => {
    const aValue = a[key] || '';
    const bValue = b[key] || '';
    return aValue.localeCompare(bValue);
  });
};
