function resetAutoRefreshAlarm() {
  browser.alarms.clear(EVENT_LOOP_AUTO_REFRESH)
    .then(cleared => getAutoRefreshTime())
    .then(periodInMinutes => browser.alarms.create(EVENT_LOOP_AUTO_REFRESH, {periodInMinutes, when: Date.now()}))
    .catch(err => console.error(err));
}

/**
 * simple routing alarm
 *
 * Map alarm to EventManager system
 */
browser.alarms.onAlarm.addListener(alarm => {
  manager.fire(alarm.name, alarm);
});

/**
 * auto refresh loop.
 * 1. Will connect if necessary
 * 2. fetch flux
 * 3. display them in panel
 */
manager.addListener(EVENT_LOOP_AUTO_REFRESH, () => {

});

/**
 * User have typed new options
 * store it in storage
 */
manager.addListener(
  EVENT_INPUT_OPTION_CHANGE,
  ({data: {name, value}}) => saveInStorage({[name]: value})
);

/**
 * Option page request params option
 * get them from auto storage
 * normalyze them
 * and fire them with EVENT_OBTAIN_PARAMS event
 */
manager.addListener(EVENT_REQUEST_PARAMS, () => {
  browser.storage.local.get(STORAGE_GET_ALL_PARAMS)
    .then(normalyzeParams)
    .then(params => manager.fire(EVENT_OBTAIN_PARAMS, params));
});

resetAutoRefreshAlarm();