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
  // Later dates override prior ones (so dates in "No School" override those in "Standard Schedule")
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
          start: ['8:30', '9:01', '9:26', '9:53', '10:18', '10:45', '11:10', '11:37', '12:02', '12:29', '12:54', '13:21', '13:46', '14:13', '14:38', '15:05'],
          end: ['8:54', '9:21', '9:46', '10:13', '10:38', '11:05', '11:30', '11:57', '12:22', '12:49', '13:14', '13:41', '14:06', '14:33', '14:58', '15:25'],
          periods: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B']
        }
      ]
    },
    {
      name: 'Late Arrival',
      dates: ['8/23/2018', '8/31/2018', '9/13/2018', '10/18/2018', '11/29/2018', '1/17/2019',
        '2/14/2019', '3/14/2019', '4/25/2019'],
      modes: [
        {
          name: 'Normal',
          start: ['10:30', '11:10', '11:45', '12:20', '13:00', '13:40', '14:20', '14:55'],
          end: ['11:05', '11:40', '12:15', '12:55', '13:35', '14:15', '14:50', '15:25'],
          periods: ['1', '2', '3', '4', '5', '6', '7', '8']
        }
      ]
    },
    {
      name: 'Activity Schedule',
      dates: [''],
      modes: [
        {
          name: 'Normal',
          start: ['8:30', '9:20', '10:06', '10:54', '11:40', '12:26', '13:12', '13:58', '14:44'],
          end: ['9:15', '10:01', '10:49', '11:35', '12:21', '13:07', '13:53', '14:39', '15:25'],
          // The excalamation mark (!) prevents the text "Period " from being prepended to the period
          // "4A" evaluates to "Period 4A", "!4A" evaluates to "4A"
          periods: ['1', '2', '!Activity', '3', '4', '5','6', '7', '8']
        },
        {
          name: 'Half Period',
          start: ['8:30', '8:58', '9:20', '9:44', '10:06', '10:54', '11:18', '11:40', '12:04', '12:26', '12:50', '13:12', '13:36', '13:58', '14:22', '14:44', '15:08'],
          end: ['8:51', '9:15', '9:37', '10:01', '10:49', '11:11', '11:35', '11:57', '12:21', '12:43', '13:07', '13:29', '13:53', '14:15', '14:39', '15:01', '15:25'],
          periods: ['1A', '1B', '2A', '2B', '!Activity', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B']
        }
      ]
    },
    {
      name: 'PM Assembly',
      dates: ['11/21/2018', '5/17/2019'],
      modes: [
        {
          name: 'Normal',
          start: ['8:30', '9:20', '10:06', '10:52', '11:38', '12:24', '13:10', '13:56', '14:42'],
          end: ['9:15', '10:01', '10:47', '11:33', '12:19', '13:05', '13:51', '14:37', '15:25'],
          periods: ['1', '2', '3', '4', '5', '6', '7', '8', '!Assembly']
        },
        {
          name: 'Half Period',
          start: ['8:30', '8:58', '9:20', '9:44', '10:06', '10:30', '10:52', '11:16', '11:38', '12:02', '12:24', '12:48', '13:10', '13:34', '13:56', '14:20', '14:42'],
          end: ['8:51', '9:15', '9:37', '10:01', '10:23', '10:47', '11:09', '11:33', '11:55', '12:19', '12:41', '13:05', '13:27', '13:51', '14:13', '14:37', '15:25'],
          periods: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '!Assembly']
        }
      ]
    },
    {
      name: 'Finals',
      dates: ['12/19/2018-12/21/2018', '5/21/2019-5/23/2019'],
      modes: [
        {
          name: 'Normal',
          start: ['8:30', '10:10', '11:50'],
          end: ['10:00', '11:40', '13:20'],
          periods: [['1','2','4'], ['3','7','5'], ['8','6','!Makeup']]
        }
      ]
    },
    {
      name: 'No School',
      dates: ['weekends', '1st monday & september', '2nd monday & october', '3rd monday & january',
        '3rd monday & february', '1st monday & march',
        // the previous dates remain the same each year
        '9/10/2018', '9/19/2018','11/22/2018-11/23/2018', '12/24/2018-1/7/2019', '3/1/2019',
        '3/25/2019-3/29/2019', '4/19/2019'],
      modes: [], // leaving modes as a blank array indicates no school that day
    }
  ]
}