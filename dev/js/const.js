/* 
Custom Date Format:
  - whitespace agnostic
  - case-insensitive

  Dates:
    - "m/d/yyyy": selects a specific date
    - "m/d": selects that date every year
    - "d": selects that day every month
    - "yyyy": selects every day in that year
    - "*": selects all days

  Keywords:
    - Type: "weekend", "weekday"
    - Days of Week: "Monday", "Tuesday", ... 
    - Months: "January", "February", ...
    (all keywords may include an optional "s" at the end, e.g. "weekends")

  Operators:
    - "-": selects a range of dates between two dates/keywords (inclusive)
        "12/22/17-1/7/18" selects all dates between 12/22/17 and 1/7/18
        "Monday-Wednesday" selects all Mondays, Tuesdays, and Wednesdays
          Cannot do "Saturday-Sunday" or "December-January" (must stay in same week/year)

    - "&": AND, date needs to satisfy all conditions separated by it
        "12/22/17-1/7/18 & weekdays" selects all weekdays between 12/22/17 and 1/7/18

    - "|": OR, date needs to satisfy one of the conditions separated by it (higher precedence than &)
        "12/22/17-1/7/18 & Tuesday|Thursday" selects all Tuesdays and Thursdays between 12/22/17 and 1/7/18

    - "!": NOT, inverts the selection (higher precedence than & and |)
        "12/22/17-1/7/18 & !Sunday & !Saturday" selects all weekdays between 12/22/17 and 1/7/18

    - "n(st/nd/rd/th)", "last": selects the nth keyword (type or days of week) in the month
        "3rd monday & January" selects the 3rd Monday of January
        "last Friday" selects the last Friday of every month

*/

export default {
  // Later dates override prior ones (so dates in "Holidays" override those in "Standard Schedule")
  // allowing Standard Schedule to select all days
  schedules: [
    {
      name: 'Standard Schedule',
      dates: ['*'],
      modes: [
        {
          name: 'Normal',
          start: ['8:30', '9:26', '10:18', '11:10', '12:02', '12:54', '13:46', '14:38'],
          end: ['9:21', '10:13', '11:05', '11:57', '12:49', '13:41', '14:33', '15:25'],
          periods: ['1', '2', '3', '4', '5', '6', '7', '8'],
        },
        {
          name: 'Half Periods',
          start: [],
          end: [],
          // The excalamation mark (!) prevents the text "Period " from being prepended to the period
          // "4A" evaluates to "Period 4A", "!4A" evaluates to "4A" 
          periods: ['1A', '1B', '2A', '2B', '!Activity', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B']
        }
      ]
    },
    {
      name: ''
    },
    {
      name: 'No School',
      dates: ['weekends']
    }
  ]
}