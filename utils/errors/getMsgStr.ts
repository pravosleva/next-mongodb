export const getMsgStr = (err: any): string => (typeof err === 'string' ? err : err.message || 'No err.message')
