import { LocalZone } from "luxon";
export const DefaultPreferences = {
  profile: {
    image: "",
    name: "",
    tagline: "",
    description: "",
    website: "",
  },
  timezone: LocalZone.name,
  availability: [
    [
      true,
      [
        "1800->3600",
      ]
    ],
    [
      true,
      [
      ]
    ],
    [
      false,
      [
      ]
    ],
    [
      false,
      [
      ]
    ],
    [
      false,
      [
      ]
    ],
    [
      false,
      [
      ]
    ],
    [
      false,
      [
      ]
    ],
  ],
  unavailability: {
  }
};