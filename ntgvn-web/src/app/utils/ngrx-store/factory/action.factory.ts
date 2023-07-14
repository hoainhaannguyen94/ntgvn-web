export const actionFactory = <T>(args: T = undefined) => ({ payload: args, timestamp: Date.now() });
