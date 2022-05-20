import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useState, Component } from "react";

import VideoIpfs from "./components/ipfsVideo/IpfsVideo";
import Sidebar from "./components/sidebar/Sidebar.js";
import Header from "./components/header/Header.js";

import ChannelPage from "./pages/ChannelPage/ChannelPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import VideoPage from "./pages/VideoPage/VideoPage";
import IpfsVideo from "./pages/IpfsVideo/IpfsVideo";
import HomePage from "./pages/HomePage/HomePage";

import "./App.scss";

class ErrorBoundary extends Component{
  state = { hasError: false };
  static getDerivedStateFromError(error){
    return { hasError: true };
  };
  componentDidCatch(error, info){
    console.log(`Cause: ${error}.\nStackTrace: ${info.componentStack}`);
  };
  render() {
    if(this.state.hasError){
      return <h3 style={{textAlign: "center"}}>Unfortunately, something went wrong.</h3>;
    };
    return this.props.children;
  };
};

const Layout = ({ children }) => {
  const [ sidebar, toggleSidebar ] = useState(true);
  const handleToggleSidebar = () => toggleSidebar(value => !value);

  return (
    <>
      <Header handleToggleSidebar={handleToggleSidebar} />
      <div className="sidebar_children">
        <Sidebar sidebar={sidebar} />
        <Container fluid className="children">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Container>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Layout>
          <HomePage />
        </Layout>
      </Route>
      <Route path="/video/:id" exact>
        <Layout>
          <VideoPage />
        </Layout>
      </Route>
      <Route path="/ipfs/:ipfscid" exact>
        <Layout>
          <IpfsVideo />
        </Layout>
      </Route>
      <Route path="/ipfs/:ipfscid/:path" exact>
        <Layout>
          <VideoIpfs />
        </Layout>
      </Route>
      <Route path="/channel/:id">
        <Layout>
          <ChannelPage />
        </Layout>
      </Route>
      <Route path="/search/:query">
        <Layout>
          <SearchPage />
        </Layout>
      </Route>
      <Route path="/:platform">
        <Layout>
          <HomePage />
        </Layout>
      </Route>

      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export default App;
