type ProfileCardProps = {
  imageLocation: string;
  name: string;
  spiritEmoji: string;
  jobTitle: string;
  description: string;
  location: string;
  website: string;
}

const ProfileCard: React.FC<ProfileCardProps> = (props) => {
  return (
    <div className="self-center flex flex-col bg-white rounded-3xl p-12 shadow-2xl">
      <div className="flex flex-col items-center">
        <img
          src={props.imageLocation}
          className="relative inline-block object-cover w-36 h-36 rounded-lg"
        />
      </div>
      <h1 className="text-center text-gray-900 text-xl font-semibold mt-5">{props.name} {props.spiritEmoji}</h1>
      <div className="my-2">
        <caption className="flex flex-row justify-center items-center text-gray-500 text-sm">
          <svg className="h-3 w-3 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {props.location}
        </caption>
        <caption className="flex flex-row justify-center items-center text-gray-500 text-sm">
          <svg className="h-3 w-3 mr-2"xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {props.jobTitle}
        </caption>
      </div>
      <caption className="flex flex-row justify-center items-center text-gray-500 text-sm ">
        <span><b>128</b> sesions booked 💖</span>
      </caption>
      <div>
        <p className="mt-5 text-center text-gray-500 text-sm">{props.description}</p>
      </div>
      <div className="text-center my-10 self-center">
        <caption className="text-gray-500 text-sm ">
          <span>Booking</span>
        </caption>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {
            ["30m Coaching", "15m Speed Consult", "45m analysis"].map((prompt) => (
              <a href="_" className="bg-primary px-4 py-2 text-white font-bold rounded">
                {prompt}
              </a>
            ))
          }
        </div>
      </div>
      <a href="#" className="text-gray-400 self-center">
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      </a>
      <span className="text-xs text-center mt-5 text-gray-400">💖 Proceeds will go to <a href="#" className="underline">gitcoin.com</a></span>
    </div>
  );
}

export default ProfileCard;