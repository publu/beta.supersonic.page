import { useWeb3React } from "@web3-react/core"
import { useContext, useState, useEffect } from "react";
import ConnectorModal from "../components/ConnectorModal";
import DefaultLayout from "../layouts/Default";
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import {BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import HomePage from "../components/pages/HomePage";
import DashboardPage from "./_dashboard";
import ProfilePage from "./id";
import BoxContext from "../contexts/box";
import LoadingSpace from "../components/LoadingSpace";
import NoAccount from "../components/NoAccount";
import Box from "3box";
import { resetSpace } from "../util";

export default function Home() {

	const { account } = useWeb3React();
	const { box, idx } = useContext(BoxContext);

  return (
		<Router>
			<Navbar />
			<Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/dashboard">
          {
            account ? (
              <>
              {
                idx.authenticated ? (
                  <DashboardPage />
                ) : (
                  <LoadingSpace />
                )
              }
              </>
            ) : (
              <NoAccount />
            )
          }
        </Route>
        <Route path="/:id">
          <ProfilePage/>
        </Route>
			</Switch>
		</Router>
  )
}
