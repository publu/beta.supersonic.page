import Navbar from "../Navbar";
import Footer from "../Footer";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
  	<div>
	    <div className="flex justify-center items-center h-80per">
	      <div className="max-w-4xl mx-auto">
	        <section className="flex text-center flex-col lg:flex-row lg:text-left items-center">
	          <img 
	            className="max-w-sm"
	            src="images/rocket.png"
	          />
	          <div className="flex flex-col space-y-12 m-12">
	            <h1 className="font-bold text-3xl">
								Helping projects fund their ideas by selling expert advice.
	            </h1>
	            <p className="text-xl text-gray-600">
								What would you do if you could make some spare cash by leveraging your skills? You help projects while they fund your ideas.
	            </p>
	            <div className="space-x-4">
	              <a href="#" className="align-middle px-6 py-2 bg-indigo-600 rounded-lg text-white text-xl font-semibold">Request an invite</a>
	              <Link to="/0x372AF201cCf4e72C60A3ca4C6f0D5df433a32daC" className="align-middle px-6 py-2 border text-gray-600 rounded-lg text-white text-xl font-semibold">View demo</Link>
	            </div>
	          </div>
	        </section>
	      </div>
	    </div>
		<Footer />
	</div>
  );
};

export default HomePage;