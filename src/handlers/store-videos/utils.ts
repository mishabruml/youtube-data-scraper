export const formatDateISOtoSQL = (dateString: string): string =>
  new Date(dateString)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ')
