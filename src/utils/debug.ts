import log from "loglevel";

log.setLevel(process.env.NODE_ENV !== "development" ? "silent" : "debug");
export const debug = log;
