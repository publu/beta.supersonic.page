import { faFacebook, faInstagram, faLinkedin, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faCross, faGlobe, faPlus, faTimes, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import BoxContext from "../../contexts/box";
import ipfs from "../../ipfs";

type Package = {
  name: string;
  amount: number;
};

const Profile: React.FC = (props) => {

	/*
	todo: add profile editor
	
	- [x] Bio 
			- [ ] json.stringify so we don’t lose the \n’s
	- [x] Name
	- [x] Status 
			- [ ] what comes after “{name} is…” (ie:”writing motivational pieces on Substack”
	- [ ] Profile pic ipfs hash 
	- [ ] Cover pic ipfs hash 
	- [ ] Topics of interest[]
			- [ ] strings
	- [ ] Social links[]
			- [ ] url
	- [ ] Icebreakers[]
			- [ ] Name
			- [ ] Price 
			- [ ] Description
  */

  const { idx } = useContext(BoxContext);

  const changeProfilePic = useRef(null);
  
  const [savedProfile, setSavedProfile] = useState({});
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicUploading, setProfilePicUploading] = useState(false);
  const [profilePicHash, setProfilePicHash] = useState("");
  const [coverPicUploading, setCoverPicUploading] = useState(false);
  const [coverPicHash, setCoverPicHash] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [other, setOther] = useState("");
  
  useEffect(() => {
    resetSettings();
  }, [idx]);

  async function saveProfile() {
    await idx.set("ssProfile", {
      ...savedProfile,
      name,
      status,
      bio,
      profilePicHash,
      coverPicHash,
      interests,
      packages,
      socials: {
        twitter,
        instagram,
        youtube,
        facebook,
        linkedin,
        website,
        other,
      },  
    });
    const profile = await idx.get("profile");
    setSavedProfile(profile);
    console.log("saved!");
  }

  const resetSettings = async () => {
    if (idx?.authenticated) {
      const profile: any = await idx.get("ssProfile");
      setSavedProfile(profile);

      setName(profile.name);
      setBio(profile.bio);
      setStatus(profile.status);
      setProfilePicHash(profile.profilePicHash);
      setCoverPicHash(profile.coverPicHash);
      setInterests(profile.interests);
      setPackages(profile.packages);
      setTwitter(profile.socials["twitter"]);
      setInstagram(profile.socials["instagram"]);
      setYoutube(profile.socials["youtube"]);
      setFacebook(profile.socials["facebook"]);
      setLinkedin(profile.socials["linkedin"]);
      setWebsite(profile.socials["website"]);
    }
  }

  const uploadCoverPhoto = async (e) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    setCoverPicUploading(true);
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const { path } = await ipfs.add(reader.result);
      setCoverPicHash(path);
      setCoverPicUploading(false);
    };
  };

  const uploadProfilePic = async (e) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    setProfilePicUploading(true);
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const { path } = await ipfs.add(reader.result);
      setProfilePicHash(path);
      setProfilePicUploading(false);
    };
  };

  const setPackageName = (index: number, newName: string) => {
    const newArray = packages.map(l => Object.assign({}, l));
    newArray[index].name = newName;
    setPackages(newArray);
  }

  const setPackageAmount = (index: number, newAmount: number) => {
    const newArray = packages.map(l => Object.assign({}, l));
    newArray[index].amount = newAmount;
    setPackages(newArray);
  }

  const removePackage = (index: number) => {
    let newArray = packages.map(l => Object.assign({}, l));
    newArray.splice(index, 1);
    setPackages(newArray);
  }

  return (
    <div>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover photo
            </label>
            {
              coverPicUploading ? (
                "Loading"
              ) : (
                <div 
                  style={{
                    backgroundImage: `url(https://ipfs.io/ipfs/${coverPicHash})`,
                    backgroundSize: "cover"
                  }}
                  className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 rounded-md"> 
                  <div className="bg-white p-4 rounded-lg space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" onChange={uploadCoverPhoto} name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )
            }
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo
          </label>
            <div className="mt-2 flex items-center">
              <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <img 
                  className="w-12 h-12 rounded-full bg-gray-400 object-cover"
                  src={`https://ipfs.io/ipfs/${profilePicHash}`}
                  alt=""
                  />
              </span>
              <button onClick={() => changeProfilePic!.current.click()} type="button" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Change
                <input id="myInput"
                  type="file"
                  ref={changeProfilePic}
                  style={{display: 'none'}}
                  onChange={uploadProfilePic}
                />
            </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label htmlFor="company_website" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input onChange={e => setName(e.target.value)} type="text" name="company_website" id="company_website" className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300" placeholder="Scott Moore" value={name} />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status ({name} is ...)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm" >
                <input onChange={e => setStatus(e.target.value)} type="text" name="status" id="status" className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300" placeholder="playing with pixels" value={status} />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
              Bio
          </label>
            <div className="mt-1">
              <textarea onChange={e => setBio(e.target.value)} id="about" name="about" rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md h-32" placeholder="I'm a fungi" value={bio}></textarea>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Brief description for your profile.
          </p>
          </div>
          <div>
            <label htmlFor="socials" className="block text-sm font-medium text-gray-700">
              Socials
            </label>
            <div className="mt-1">
              <div className="flex flex-col space-y-2">
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faTwitter} />
                  </span>
                  <input type="text" onChange={e => setTwitter(e.target.value)} name="company_website" id="company_website" className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="scottmoore" value={twitter} />
                </div>  
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faInstagram} />
                  </span>
                  <input type="text" onChange={e => setInstagram(e.target.value)} name="company_website" id="company_website" className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="scottmoore" value={instagram} />
                </div>  
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faYoutube} />
                  </span>
                  <input type="text" onChange={e => setYoutube(e.target.value)} name="company_website" id="company_website" className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="scottmoore" value={youtube}/>
                </div>  
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faFacebook} />
                  </span>
                  <input type="text" onChange={e => setFacebook(e.target.value)} name="company_website" id="company_website" className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="scottmoore" value={facebook}/>
                </div>  
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </span>
                  <input type="text" onChange={e => setLinkedin(e.target.value)} name="company_website" id="company_website" className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="scottmoore" value={linkedin}/>
                </div>  
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faGlobe} />
                  </span>
                  <input type="text" onChange={e => setWebsite(e.target.value)} name="company_website" id="company_website" className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="scottmoore" value={website}/>
                </div>  
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="socials" className="block text-sm font-medium text-gray-700">
              Packages
            </label>
            <div className="mt-1">
              <div className="flex flex-col space-y-2">
                {
                  packages.map((val, index) => {
                    return (
                      <div className="flex flex-row space-x-5" key={index}>
                        <div className="flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            Name
                          </span>
                          <input type="text" onChange={e => setPackageName(index, e.target.value)} className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="App Review" value={val.name}/>
                        </div>  
                        <div className="flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            $
                          </span>
                          <input type="number" onChange={e => setPackageAmount(index, parseFloat(e.target.value))} className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="0" value={val.amount}/>
                        </div>  
                        <button
                          onClick={() => removePackage(index)}
                          className="text-gray-500">
                          <FontAwesomeIcon icon={faTimes}/>
                        </button>
                      </div>
                    );
                  })
                }
              </div>
              <div className="mt-5 text-center">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setPackages([
                      ...packages,
                      {
                        name: "",
                        amount: 0,
                      }
                    ])
                  }}
                className="text-gray-500">
                  + Create package
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-2">
          <button 
            onClick={e => {
              e.preventDefault();
              resetSettings();
            }}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white border-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
        </button>
          <button 
            onClick={e => {
              e.preventDefault();
              saveProfile();
            }}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save
        </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;