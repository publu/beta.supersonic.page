import DefaultLayout from "../layouts/Default";
import Home from "../components/dashboard/home";
import Messages from "../components/dashboard/messages";
import Payments from "../components/dashboard/payments";
import Profile from "../components/dashboard/profile";
import { useContext, useEffect, useState } from "react";
import Thread from "../components/dashboard/thread";
import BoxContext from "../contexts/box";
import { useWeb3React } from "@web3-react/core";
import { BrowserRouter as Router, Switch, Route, Link, useLocation, NavLink} from "react-router-dom";

const activeClasses = "bg-gray-300 text-gray-900 rounded";

enum DashboardTab {
  HOME,
  MESSAGES,
  PAYMENTS,
  PROFILE,
  THREAD,
}

const Dashboard: React.FC = () => {

  const location = useLocation();
  const { idx } = useContext(BoxContext);
  const [routerStack, setRouterStack] = useState([DashboardTab.HOME]);
  const [selectedThread, setSelectedThread] = useState({});
  const [loading, setLoading] = useState(true);
  const {
    account
  } = useWeb3React()

  useEffect(() => {
    console.log(routerStack);
  }, [routerStack])

  useEffect(() => {
    if (selectedThread !== "" && routerStack.length > 1) {
      setRouterStack([...routerStack, DashboardTab.THREAD]);
    }
  }, [selectedThread])

  useEffect(() => {
    if (idx.authenticated && account) {
      setLoading(false);
    }
  }, [idx, account])

  useEffect(() => {
    console.log(location);
  }, [location])

  return (
    <Switch>
      <DefaultLayout>
        {
          loading ? (
            "Loading"
          ) : (
            <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-12 gap-5 my-5">
              <Router>
                <aside className="lg:col-span-4">
                  <div className="flex flex-col items-start text-gray-700 text-lg space-y-2">
                    <NavLink exact activeClassName={activeClasses} className="px-3 py-2" to="/dashboard">Home</NavLink>
                    <NavLink activeClassName={activeClasses} className="px-3 py-2" to="/dashboard/messages">Messages</NavLink>
                    <NavLink activeClassName={activeClasses} className="px-3 py-2" to="/dashboard/payments">Payments</NavLink>
                    <NavLink activeClassName={activeClasses} className="px-3 py-2" to="/dashboard/profile">Profile</NavLink>
                  </div>
                </aside>
                <main className="mx-5 lg:mx-0 lg:col-span-8">
                    <Route exact path="/dashboard">
                      <Home />
                    </Route>
                    <Route exact path="/dashboard/messages">
                      <Messages />
                    </Route>
                    <Route exact path="/dashboard/payments">
                      <Payments />
                    </Route>
                    <Route exact path="/dashboard/profile">
                      <Profile />
                    </Route>
                    <Route path="/thread/:threadAddress">
                      <Thread />
                    </Route>
                </main>
              </Router>
            </div>
          )
        }
      </DefaultLayout>
    </Switch>
  );
};

export default Dashboard;