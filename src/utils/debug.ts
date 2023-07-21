export const debug = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === "production") {
      return;
    }
    console.log(...args);
  },
};
