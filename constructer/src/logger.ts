// All logs funnel through here so stack traces point to logger.ts, not the actual source
const noop = () => {};

const _log = console.log.bind(console);
const _warn = console.warn.bind(console);
const _error = console.error.bind(console);
const _info = console.info.bind(console);

export const log = (...args: unknown[]): void => { _log(...args); };
export const warn = (...args: unknown[]): void => { _warn(...args); };
export const error = (...args: unknown[]): void => { _error(...args); };
export const info = (...args: unknown[]): void => { _info(...args); };
