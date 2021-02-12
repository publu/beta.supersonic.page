import DefaultLayout from "../../layouts/Default";
import { useEffect, useState } from "react";
import Box from "3box";
import { time } from "console";
import { DateTime, Zone, Info, Duration, Interval } from "luxon";

type BookingTimeSlotProps = {
  time: DateTime;
  onConfirmed: () => void;
}

const BookingTimeSlot: React.FC<BookingTimeSlotProps> = (props) => {
  const [selected, setSelected] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-1">
      <button 
        onClick={() => {
          setSelected(!selected);
        }}
        className={`${selected ? "col-span-1" : "col-span-2"} text-sm border border-blue-300 bg-blue-50 p-2 rounded text-blue-600 font-bold`}
        >
        { ("0" + props.time.hour).slice(-2) + ":" + ("0" + props.time.minute ).slice(-2) + (props.time.hour < 12 ? " AM" : " PM")}
      </button>
      {
        selected && (
          <button 
            onClick={() => {
              props.onConfirmed();
            }}
            className="text-sm border bg-blue-700 p-2 rounded text-white font-bold" 
            >
              Confirm
          </button>
        )
      }
    </div>
  );
}

type BookingCalendarProps = {
  availability: any;
  zone: Zone;
}

const BookingCalendar: React.FC<BookingCalendarProps> = (props) => {

  const monthNames = Info.months()

  const [currentYear, setCurrentYear] = useState(2020);
  const [currentMonth, setCurrentMonth] = useState(2);
  const [selectedDate, setSelectedDate]  = useState<DateTime>();
  const [confirmedTimeSlot, setConfirmedTimeSlot] = useState<Interval>();

  useEffect(() => {
    const currentDate = DateTime.local();
    setCurrentYear(currentDate.year);
    setCurrentMonth(currentDate.month);
  }, []);

  const decrementMonth = () => {
    if (currentMonth == 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const incrementMonth = () => {
    if (currentMonth == 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getFirstDay = () => {
    return DateTime.local(currentYear, currentMonth).weekday
  }

  const renderBookingTimes = (date: DateTime) => {
    const dayInWeek = date.weekday == 7 ? 0 : date.weekday;
    let intervals: Interval[] = [];

    props.availability[dayInWeek][1].map((timeslot) => {
      const [from, to] = timeslot.split("->").map(val => parseInt(val));
      const interval = Interval.fromDateTimes(DateTime.local(currentYear, currentMonth, date.day).setZone(props.zone).plus(Duration.fromMillis(from * 1000)), DateTime.utc(currentYear, currentMonth, date.day).setZone(props.zone).plus(Duration.fromMillis(to * 1000)))
      intervals.push(interval);
    });

    let bookingTimes: Interval[] = [];

    intervals.map(interval => {
      bookingTimes.push(...interval.splitBy(Duration.fromMillis(30 * 60 * 1000)));
      // Remove last element
      bookingTimes.pop();
    });

    return (
      <div className="h-64 flex flex-col overflow-y-scroll p-2 space-y-2">
        {
          bookingTimes.sort((a, b) => a.end.toSeconds() - b.end.toSeconds()).map(bookingTime => {
            const time = DateTime.fromSeconds(bookingTime.start.toSeconds(), {zone:  props.zone});
            if (date.ordinal == bookingTime.end.ordinal) {
              return (
                <BookingTimeSlot time={time} onConfirmed={() => setConfirmedTimeSlot(bookingTime)} />
              )
            }
          })
        }
      </div>
      // Remove last element
    );
  };

  const renderDay = (row: number, day: number, index: number) => {
    const dateNumber = Math.floor(((new Date(currentYear, currentMonth, ((index) + 1 - getFirstDay())).getTime()) - (new Date(currentYear, currentMonth, 0).getTime())) / (1000 * 3600 * 24));

    const currentDate = DateTime.local(currentYear, currentMonth, dateNumber);

    const renderClickableDateButton = () => {
      return (
        <button 
          className={`transition w-12 h-12 text-center rounded-full font-bold ${selectedDate && selectedDate.valueOf() == currentDate.valueOf() ? "bg-blue-700 text-white" : "text-blue-700"} focus:outline-none focus:ring ring-blue-200`} key={row * day}
          onClick={
            () => {
              setSelectedDate(
                currentDate
              );
            }
          }
        >
          { dateNumber }
        </button>
      );
    }

    return (
      <div className="select-none">
        {
          props.availability[day][0] && props.availability[day][1].length > 0? (
            renderClickableDateButton()
          ) : (
            <button disabled className="w-12 h-12 text-center rounded-full font-bold text-gray-400 cursor-default" key={row * day}>
              { dateNumber }
            </button>
          )
        }
      </div>
    );
  }

  const renderDates = () => {

    const month = DateTime.local(currentYear, currentMonth);

    const rows = [];
    let index = 0;
    if (getFirstDay() === 7) {
      index += 7;
    }
    for (let row = 0; row < 6; row++) {
      const currentRow = [];
      for (let day = 0; day < 7; day++) {
        currentRow.push(
          <td className="w-20 h-20 align-middle text-center">
            {
              ((index) < month.daysInMonth + getFirstDay()) && (index) >= getFirstDay()  ? (
                  <>
                    {
                      renderDay(row, day, index)
                    }
                  </>
                ) : (
                  <button disabled className="w-12 h-12 text-center cursor-default" key={row * day}>
                  </button>
                )
            }
          </td>
        );
        index++;
      }
      rows.push(
        <tr>
          { currentRow }
        </tr>
      );
    }

    return (
      rows
    );
  }


  return (
    <>
    { 
      confirmedTimeSlot ? (
        <div>
          <button
            onClick={() => setConfirmedTimeSlot(null)}
          >
            Back
          </button>
          Time: { confirmedTimeSlot.start.toString() }
        </div>
      ) : (
          <div className="grid grid-cols-2 h-full">
            <div>
              <div className="p-4 text-center align-center">
                <div className="flex flex-row items-center justify-between">
                  {
                    (DateTime.local(currentYear, currentMonth) >= DateTime.local()) ? (
                      <button
                        onClick={decrementMonth}
                      >
                        {"<"}
                      </button>
                    ) : (
                      <button>

                      </button>
                    )
                  }
                  <span className="font-bold">
                    { monthNames[currentMonth - 1] } { currentYear }
                  </span>
                  <button
                    onClick={incrementMonth}
                  >
                    {">"}
                  </button>
                </div>
              </div>
              <table className="w-full">
                <thead className="align-middle">
                  <tr>
                    {
                      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((val) => {
                        return (
                          <th className="text-xs font-bold">
                            { val.toUpperCase() }
                          </th>
                        );
                      })
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    props.availability ? (
                      renderDates()
                    ) : (
                      <div>
                        Loading
                      </div>
                    )
                  }
                </tbody>
              </table>
            </div>
            <div>
              { 
                selectedDate ? (
                  <div>
                    <span className="text-sm font-bold text-gray-400">
                      { selectedDate.toString() }
                    </span>
                    { renderBookingTimes(selectedDate) }
                  </div>
                ) : (
                  
                  <div>Select a date</div>
                )
              }
            </div>
          </div>
      )
    }
    </>
  );
};

const MentorPage: React.FC = () => {
  const raters = Math.round(Math.random() * 100);
  const rating = parseFloat((Math.random() * 5).toFixed(2));

  const [mentorAvailability, setMentorAvailability] = useState();
  const [mentorTimeZone, setMentorTimezone] = useState();

  useEffect(() => {
    (async () => {
      const space: any = await Box.getSpace("0x372AF201cCf4e72C60A3ca4C6f0D5df433a32daC", process.env.NEXT_PUBLIC_3BOX_SPACE_NAME);
      setMentorAvailability(space.preferences.availability);
      setMentorTimezone(space.preferences.timezone);
    })()
  }, [])

  return (
    <DefaultLayout>
      <div className="pt-8">
        <div className="mx-auto grid grid-cols-12 grid-flow-row gap-4">
          <div className="col-span-7 p-4 shadow flex flex-row space-x-4 rounded-lg">
            <img
              className="w-32 h-32 rounded-lg"
              src="https://thispersondoesnotexist.com/image"
            />
            <div className="flex flex-col">
              <span className="text-lg mb-1">Steve B. Candrum</span>
              <div className="flex flex-row items-center space-x-1" title={`Rating: ${rating}`}>
                {
                  [0,0,0,0,0].map((val, index) => (
                    <svg key={index} className={`w-4 h-4 ${index < Math.round(rating) ? "text-yellow-500" : "text-gray-300"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))
                }
                <span className="text-sm"> ({ raters }) </span>
                <p>

                </p>
              </div>
            </div>
          </div>
          <div className="col-span-5 p-4 shadow flex flex-row space-x-4 rounded-lg">
          </div>
          <div className="col-span-12 p-4 shadow flex flex-row space-x-4 rounded-lg">
            <BookingCalendar 
              availability={mentorAvailability}
              zone={mentorTimeZone}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default MentorPage;