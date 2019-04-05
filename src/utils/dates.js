import moment from 'moment-timezone'

export const toPrettyDate = (strOrDate, timezone = '') => {
  return (
    moment.utc(strOrDate).format('MMM Do, YYYY @ H:mm a') +
    ' ' +
    moment()
      .tz(timezone)
      .format('zZ')
  )
}

export const getDayAndTimeFromDate = isoString => {
  const date = new Date(isoString)
  const hours = date.getUTCHours() * 60 * 60 * 1000
  const minutes = date.getUTCMinutes() * 60 * 1000
  const day = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDay()
  )
  return [day, hours + minutes]
}

export const getDateFromDayAndTime = (dayUTCString, time) => {
  const day = new Date(dayUTCString)
  const utc = Date.UTC(day.getFullYear(), day.getMonth(), day.getDay())
  const date = new Date(utc + time)
  return date
}

export function getLocalTimezoneOffset() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
