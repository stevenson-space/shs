#### *Note: Documentation is Incomplete*

# Documentation

### Definitions

- **Schedule Type**: the type of schedule dependent on which day it is (i.e. `Standard Schedule`, `Late Arrival`, `Activity Period`, etc.)
- **Schedule Mode**: user-selectable schedule that can apply on any given day (i.e. `Normal`, `Half Periods`). Different schedule modes can be specified based on the schedule type, for example on Late Arrival days there are no half periods, so the `Half Periods` schedule mode doesn't exist.

## Format of `schedules.json`

Example:
```json
[
  {
    "name":"Activity Period",
    "isSpecial":true,
    "dates":["8/14/2019","9/4/2019","10/2/2019", "10/30/2019","11/20/2019","12/2/2019","1/13/2020","2/12/2020","2/26/2020","3/18/2020","4/16/2020","4/29/2020"],
    "modes":[
      {
        "name":"Normal",
        "start":["8:30","9:20","10:06","10:54","11:40","12:26","13:12","13:58","14:44"],
        "end":["9:15","10:01","10:49","11:35","12:21","13:07","13:53","14:39","15:25"],
        "periods":["1","2","!Activity","3","4","5","6","7","8"]
      },
      {
        "name":"Half Periods",
        "start":["8:30","8:58","9:20","9:44","10:06","10:54","11:18","11:40","12:04","12:26","12:50","13:12","13:36","13:58","14:22","14:44","15:08"],
        "end":["8:51","9:15","9:37","10:01","10:49","11:11","11:35","11:57","12:21","12:43","13:07","13:29","13:53","14:15","14:39","15:01","15:25"],
        "periods":["1A","1B","2A","2B","!Activity","3A","3B","4A","4B","5A","5B","6A","6B","7A","7B","8A","8B"]
      }
    ]
  },
]
```

The top level data structure is an array of schedules corresponding to different [schedule types](#definitions).

The `isSpecial` property is mainly used to determine whether the schedule type is important enough to appear on the Upcoming Events card as well as the Calendar. The main reason this property was created was to distinguish between No School on weekends (which we don't want to appear on the calendar) and No School for other reasons such as Teacher Institute Day (which should appear on calendar).

The `dates` array specifies the dates on which they given schedule type active in a [special format](#date-format). If there are conficting schedules on a given day (e.g. two different schedules have March 3rd in `dates`), then **the schedule specified later in the top level array takes priority**. This allows us to have the schedule corresponding to `Standard Schedule` be the first element in the array and be active on **all** dates, and any schedules specified later will override `Standard Schedule` on their specific days. Notice that the `No School (Weekend)` schedule has the dates `weekends` and is the last schedule in the array, which guarantees that it will be active on all weekends.

Schedules also contain a `modes` array that defines all of the [schedule modes](#definitions) that apply on the given schedule type. The schedule mode object contains the properties `start` and `end` which specify the start and end times of each period in 24-hour time. `periods` contains the name of each period. By default, when the period is displayed, it will be prefixed by "Period ", but in certain cases this behavior is not desired (we don't want "Period Assembly"). To avoid this, the period can be specified with a "!" before it (e.g. "!Assembly"). Also, if there are no modes specified, it indicates that there's no school on days with that schedule type.

Lastly, the `periods` array can also be a 2D array, in which case each sub-array defines the periods for the nth consecutive day of the given schedule type. For example, on the schedule type `Finals`, we have this:
```json
"periods": [
  ["1","2","4"],
  ["3","7","5"],
  ["8","6","!Makeup"]
]
```
so the periods `["1","2","4"]` apply on the first day of finals, `["3","7","5"]` on the second, and so on.

### Date Format

The dates specified in `schedules.json` use a special format to make it more convenient for manual date entry. It's **whitespace agnostic** and **case-insensitive**, with the following structure:

#### Dates:

- `m/d/yyyy`: selects a specific date
- `m/d`: selects that date every year
- `d`: selects that day every month
- `yyyy`: selects every day in that year
- `*`: selects all days

#### Keywords:

- Type: `weekend`, `weekday`
- Days of Week: `Monday`, `Tuesday`, ... 
- Months: `January`, `February`, ...

(all keywords may include an optional "s" at the end, e.g. `weekends`)

#### Operators:

- `-`: selects a range of dates between two dates/keywords (inclusive)
  - `12/22/17-1/7/18` selects all dates between 12/22/17 and 1/7/18
  - `Monday-Wednesday` selects all Mondays, Tuesdays, and Wednesdays
  - *Note: Cannot do `Saturday-Sunday` or `December-January` (must stay in same week/year)*

- `&`: **AND**, date needs to satisfy all conditions separated by it
  - `12/22/17-1/7/18 & weekdays` selects all weekdays between 12/22/17 and 1/7/18

- `|`: **OR**, date needs to satisfy one of the conditions separated by it (higher precedence than &)
  - `12/22/17-1/7/18 & Tuesday|Thursday` selects all Tuesdays and Thursdays between 12/22/17 and 1/7/18

- `!`: **NOT**, inverts the selection (higher precedence than & and |)
  - `12/22/17-1/7/18 & !Sunday & !Saturday` selects all weekdays between 12/22/17 and 1/7/18

- `n(st/nd/rd/th)`, `last`: selects the nth keyword (type or days of week) in the month
  - `3rd monday & January` selects the 3rd Monday of January
  - `last Friday` selects the last Friday of every month

## Custom Schedules

The app allows users to define their own custom schedule modes on the settings page. It also allows modification of schedules, but if the schedule being modified is an offical one (not custom), a copy will be created instead of directly modifying the original. These new schedules are saved JSON encoded in `localStorage.customSchedules`. The format for these is slightly different from `schedules.json` in order to allow for efficent merging of the custom schedules and the official ones. It's a map with the schedule type as keys and an array of schedule mode objects as values.

Example:
```json
{
  "Late Arrival": [
    {
      "name":"My Schedule",
      "start": ["10:30","11:10","11:45","12:20","13:00","13:40","14:20","14:55"],
      "end": ["11:05","11:40","12:15","12:55","13:35","14:15","14:50","15:25"],
      "periods": ["Physics","Calculus","English","Lunch","Computer Science","Dance","U.S. History","Computer Art 1"],
    },
  ]
}
```

## Themes
```themes.json``` contains the different themes available. 

| Name      | Description |
| ----------- | ----------- |
| name      | Name of the theme       |
| suggestedColor|  suggested color to use with the theme - when changing themes, the user has the option to apply this color as their selected color. |
| background  | page background color, applies to all pages|
| secondaryBackground      | a closely related to ```background``` but provides minor contrast, used mainly for hover effects      |
| headerBackgroundColor | the header color on the home page |
| primary | main text color  |
| secondary | slightly darker ```primary``` |
| tertiary | slightly darker ```secondary``` |
| iconTextCardColor | the text color of inverted ```IconTextCard```|
| iconTextCardInvertColor | background color of inverted ```IconTextCard``` |

Values of colors can be set to other variables like ```var(--color)``` to remove the need to duplicate colors. 