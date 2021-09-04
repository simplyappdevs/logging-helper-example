/**
 * Examples for cidr-calulator v1.x.x
 */

/**
 * SimplyAppDevs Imports
 */
import {LogEntry, LogEntryWithDuration, logger, LOGTYPES} from '@simplyappdevs/logging-helper';

// initialize
logger.init('examples');

// module logger
const mLogger = logger.createModuleLogger('MAIN');

/**
 * Debug log
 * @param step Step
 */
const debug = (step: string) => {
  // fn logger
  const fnLogger = mLogger.createFnLogger('debug()');

  fnLogger.logDebug('Executing in debug()', '', step);
};

/**
 * Info log
 * @param step Step
 */
const info = (step: string) => {
  // fn logger
  const fnLogger = mLogger.createFnLogger('info()');

  fnLogger.logInfo('Executing in info()', '', step);
};

/**
 * Warning log
 * @param step Step
 */
const warning = (step: string) => {
  // fn logger
  const fnLogger = mLogger.createFnLogger('warning()');

  fnLogger.logWarning('Executing in warning()', 'WARNING WARNING WARNING', step);
};

/**
 * Error log
 * @param step Step
 */
const error = (step: string) => {
  // fn logger
  const fnLogger = mLogger.createFnLogger('error()');

  try {
    throw new Error('Error in error()');
  } catch (e) {
    fnLogger.logError(e as Error, undefined, step);
  }
};

/**
 * Critical error log
 * @param step Step
 */
const criticalError = (step: string) => {
  // fn logger
  const fnLogger = mLogger.createFnLogger('criticalError()');

  try {
    throw new Error('Error in ciritcalError()');
  } catch (e) {
    fnLogger.logCriticalError(e as Error, undefined, step);
  }
};

/**
 * Build log entry message
 * @param entry Log entry
 * @returns String representation of the log entry
 */
const buildMsg = (entry: LogEntry | LogEntryWithDuration) => {
  let msg = `${entry.entryTS.toISOString()}: [${entry.modName || '-'}]:[${entry.fnName || '-'}] (${entry.task || '-'}) ${entry.friendlyMsg}`;

  if ((entry as LogEntryWithDuration).durationIsMS) {
    msg += ` Duration: ${entry.durationIsMS} msecs`;
  }

  if (entry.detailMsg) {
    msg += `\n${entry.detailMsg}`;
  }

  return msg;
};

/**
 * Helper to create log entry and then sleep for sleepInSecs
 * @param logType Log type
 * @param sleepInSec Sleep in secs
 * @param step Step
 * @returns Promise of LogEntry
 */
const creteLogEntryWithDuration = (logType: LOGTYPES, sleepInSec: number, step: string): Promise<LogEntry> => {
  let entry: LogEntry;

  switch (logType) {
    case LOGTYPES.Debug:
    case LOGTYPES.Informational:
    case LOGTYPES.Warning:
      entry = logger.createLogEntry(logType, mLogger.moduleName, 'creteLogEntryWithDuration()', `Log for logType=${logType} and sleeping for ${sleepInSec} secs`, '', step);
      break;

    default:
      try {
        throw new Error(`Log for logType=${logType} and sleeping for ${sleepInSec} secs`);
      } catch (e) {
        entry = logger.createLogEntry(logType, mLogger.moduleName, 'creteLogEntryWithDuration()', e as Error, undefined, step);
      }
      break;
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(entry);
    }, sleepInSec * 1000);
  });
};

// Execute
(function () {
  // init
  let step = 0;

  // output default output
  debug(`step${++step}`);
  info(`step${++step}`);
  warning(`step${++step}`);
  error(`step${++step}`);
  criticalError(`step${++step}`);
  console.log('');

  // outout override JSON
  logger.setLoggerOutput((item: LogEntry) => {
    console.log(JSON.stringify(item));
  });

  step = 0;

  // output default output
  debug(`step${++step}`);
  info(`step${++step}`);
  warning(`step${++step}`);
  error(`step${++step}`);
  criticalError(`step${++step}`);
  console.log('');

  // output override custom
  logger.setLoggerOutput((item: LogEntry) => {
    let msg = buildMsg(item);

    switch (item.logType) {
      case LOGTYPES.Debug:
        msg = `[DEBUG        ] ${msg}`;
        break;

      case LOGTYPES.Informational:
        msg = `[INFORMATIONAL] ${msg}`;
        break;

      case LOGTYPES.Warning:
        msg = `[WARNING      ] ${msg}`;
        break;

      case LOGTYPES.Error:
        msg = `[ERROR        ] ${msg}`;
        break;

      case LOGTYPES.CriticalError:
        msg = `[CRITICALERROR] ${msg}`;
        break;
    }

    console.log(msg);
  });

  step = 0;

  // output custom
  debug(`step${++step}`);
  info(`step${++step}`);
  warning(`step${++step}`);
  error(`step${++step}`);
  criticalError(`step${++step}`);
  console.log('');

  // outout override JSON
  logger.setLoggerOutput((item: LogEntry | LogEntryWithDuration) => {
    console.log(buildMsg(item));
  });

  step = 0;

  // output duration
  creteLogEntryWithDuration(LOGTYPES.Debug, 1, `step${++step}`).then((entry: LogEntry) => {
    logger.logWithDuration(entry);
  });

  creteLogEntryWithDuration(LOGTYPES.Informational, 2, `step${++step}`).then((entry: LogEntry) => {
    logger.logWithDuration(entry);
  });

  creteLogEntryWithDuration(LOGTYPES.Warning, 3, `step${++step}`).then((entry: LogEntry) => {
    logger.logWithDuration(entry);
  });

  creteLogEntryWithDuration(LOGTYPES.Error, 4, `step${++step}`).then((entry: LogEntry) => {
    logger.logWithDuration(entry);
  });

  creteLogEntryWithDuration(LOGTYPES.CriticalError, 5, `step${++step}`).then((entry: LogEntry) => {
    logger.logWithDuration(entry);
  });
})();