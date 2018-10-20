const Loader = require('./core/loader');

/**
 * ID from sattelite and value from param vetted_status
 * output is in folder /out/good
 */
const goodLoader = new Loader("965","good");
goodLoader.get()

/**
 * ID from sattelite and value from param vetted_status
 * output is in folder /out/bad
 */
const badLoader = new Loader("965", "bad");
badLoader.get();