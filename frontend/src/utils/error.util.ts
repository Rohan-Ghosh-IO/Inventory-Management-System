export const sanitizeErrorMessage = (err: any, fallback: string = 'Something went wrong. Please try again.'): string => {
  const rawMsg = err?.response?.data?.message || err?.message || '';
  if (!rawMsg || typeof rawMsg !== 'string') return fallback;

  if (
    rawMsg.includes('prisma') ||
    rawMsg.includes('Prisma') ||
    rawMsg.includes('invocation') ||
    rawMsg.includes('Database') ||
    rawMsg.includes('localhost') ||
    rawMsg.includes('\\') ||
    rawMsg.includes('at ') ||
    rawMsg.includes('Error:') ||
    rawMsg.includes('eval')
  ) {
    return 'Service is temporarily unavailable. Please try again later.';
  }

  return rawMsg;
};
