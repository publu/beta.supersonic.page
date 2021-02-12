import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useBox } from "../hooks";
import { resetSpacePreferences } from "../util";
import { getTimeZones } from "@vvo/tzdb";
import { DateTime } from "luxon";

enum AVAILABILITY_TAB {
  AVAILABILITY,
  UNAVAILABILITY,
} 

interface ITimeSlotMeta {
  from: number;
  to: number;
};

type TimeSlotProps = {
  onChange?: (newTimeslot: ITimeSlotMeta) => void;
  timeslot: string;
}

const TimeSlot: React.FC<TimeSlotProps> = (props) => {

  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  const secondsIn30MinuteIntervals = [];

  let sum = 0;
  for (let x = 0; x < 48; x += 1) {
    sum += 1800;
    secondsIn30MinuteIntervals.push(sum);
  };

  useEffect(() => {
    const [from, to] = props.timeslot.split("->");
    setFrom(parseInt(from));
    setTo(parseInt(to));
  }, []);

  useEffect(() => {
    props.onChange({
      from,
      to,
    });
  }, [from, to]);

  return (
    <div className="flex flex-row items-center justify-between">
      <select onChange={(event) => setFrom(parseInt(event.target.value))}>
        {
          secondsIn30MinuteIntervals.map(seconds => {
            const time = new Date(seconds * 1000);
            return (
              <option selected={from === seconds} value={seconds}>{ ("0" + time.getUTCHours()).slice(-2) + ":" + ("0" + time.getUTCMinutes() ).slice(-2) + (time.getUTCHours() < 12 ? " AM" : " PM")}</option>
            )
          })
        }
      </select>
      to
      <select onChange={(event) => setTo(parseInt(event.target.value))}>
        {
          secondsIn30MinuteIntervals.map(seconds => {
            const time = new Date(seconds * 1000);
            return (
              <option selected={to === seconds} value={seconds}>{ ("0" + time.getUTCHours()).slice(-2) + ":" + ("0" + time.getUTCMinutes() ).slice(-2) + (time.getUTCHours() < 12 ? " AM" : " PM")}</option>
            )
          })
        }
      </select>
    </div>
  );
}

const AvailabilityTabs: React.FC = () => {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const {
    account,
    library,
  } = useWeb3React();

  const box = useBox();

  const [currentTab, setCurrentTab] = useState<AVAILABILITY_TAB>(AVAILABILITY_TAB.AVAILABILITY);
  const [preferences, setPreferences] = useState<any>();
  const [boxPreferences, setBoxPreferences] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (box) {
      (async () => {
        box.openSpace(process.env.NEXT_PUBLIC_3BOX_SPACE_NAME).then(space => {
          const initPreferences = () => space.public.get("preferences").then(async (preferences) => {
            if (!preferences) {
              await resetSpacePreferences(box);
              initPreferences();
            } else {
              setPreferences(preferences)
              setBoxPreferences(preferences)
              setLoading(false);
            }
          });
          initPreferences();
        })
      })()
    }
  }, [box]);

  useEffect(() => {
    console.log(preferences)
  }, [])

  const updateTimeSlot = (newTimeSlot: ITimeSlotMeta, index: number, weekday: number) => {
    const newTimeSlotString = newTimeSlot.from + "->" + newTimeSlot.to;

    const newAvailability = preferences.availability; 

    newAvailability[weekday][1][index] = newTimeSlotString;

    setPreferences({
      ...preferences,
      availability: newAvailability,
    });
  };

  const savePreferences = async () => {
    setSaving(true);
    box.openSpace(process.env.NEXT_PUBLIC_3BOX_SPACE_NAME).then(space => {
      space.public.set("preferences", preferences).then(async () => {
        await box.syncDone;
        setSaving(false);
        console.log(preferences);
        console.log("Saved!");
      }).catch(e => console.log(e));
    });
  };

  const toggleAvailability = (weekday: number) => {
    const newAvailability = preferences.availability; 

    newAvailability[weekday][0]= !newAvailability[weekday][0];

    setPreferences({
      ...preferences,
      availability: newAvailability,
    });
  }


  const setTimeZone = (timezone: string) => {
    console.log(timezone);
    setPreferences({
      ...preferences,
      timezone: timezone,
    });
  };


  return (
    <div>
      <div className="space-y-2">
          {
            preferences && !loading ? (
              <div>
                <h2>
                  Timezone
                </h2>
                <select value={preferences.timezone} onChange={e => setTimeZone(e.target.value)}>
                  {
                    getTimeZones().map(tz => {
                      const currTime = DateTime.fromJSDate(new Date(), { zone: tz.name });
                      return (
                        <option value={tz.name}>{tz.countryCode} ({currTime.toFormat("H:mm")})</option>
                      )
                    })
                  }
                </select>
                {
                preferences.availability.map((availability, weekday) => {

                  const addTimeSlot = () => {
                    const newTimeSlotString = "0->0";

                    const newAvailability = [
                      ...preferences.availability,
                    ];

                    newAvailability[weekday][1][newAvailability[weekday][1].length] = newTimeSlotString;

                    setPreferences({
                      ...preferences,
                      availability: newAvailability,
                    });
                  }

                  const deleteTimeSlot = (timeslotIndex: number) => {
                    const newAvailability = [
                      ...preferences.availability,
                    ];

                    newAvailability[weekday][1].splice(timeslotIndex, 1);

                    setPreferences({
                      ...preferences,
                      availability: newAvailability,
                    });
                  }

                  return (
                    <div className="border rounded">
                      <button className="w-full p-4 flex flex-row items-center justify-between">
                        <span className="text-sm">
                          { weekdays[weekday].charAt(0).toUpperCase() + weekdays[weekday].slice(1) }
                        </span>
                        <input type="checkbox" name="sunday-checkbox" checked={availability[0]} onClick={() => toggleAvailability(weekday)} />
                      </button>
                      {
                        availability[0] && (
                          <div className="flex flex-col space-y-2 py-2">
                            {
                              availability[1].map((timeslot, timeslotIndex) => (
                                <div className="flex flex-row w-full items-center">
                                  <div className="border rounded p-2 mx-2 flex-grow items-stretch">
                                    <TimeSlot 
                                      key={timeslotIndex}
                                      onChange={(newTimeSlot) => updateTimeSlot(newTimeSlot, timeslotIndex, weekday)}
                                      timeslot={timeslot}
                                    />
                                  </div>
                                  <div className="pr-2"
                                    onClick={() => deleteTimeSlot(timeslotIndex)}
                                  >
                                    <button className="w-4 h-4">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))
                            }
                            <button onClick={addTimeSlot}>
                              Add time
                            </button>
                          </div>
                        )
                      }
                    </div>
                  );
                })
                }
              </div>
            ) : (
              "Loading"
            )
          }
          <div className="flex flex-row justify-end">
            <button 
              className="px-4 py-2 bg-blue-500 text-white text-sm font-bold block rounded"
              onClick={savePreferences}
            >
              { preferences === boxPreferences ? "Lol" : "Save"}
            </button>
          </div>
      </div>
    </div>
  );
}

export default AvailabilityTabs;