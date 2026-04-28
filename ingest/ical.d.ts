declare module 'ical.js' {
  class Component {
    constructor(data: unknown);
    getAllSubcomponents(name?: string): Component[];
    getAllProperties(name: string): Property[];
  }

  class Event {
    constructor(component: Component);
    uid: string;
    summary: string;
    description: string;
    location: string;
    startDate: Time;
    endDate: Time | null;
  }

  class Time {
    isDate: boolean;
    year: number;
    month: number;
    day: number;
    toJSDate(): Date;
  }

  class Property {
    getValues(): string[];
  }

  function parse(input: string): unknown;
}
