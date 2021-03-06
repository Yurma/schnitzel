import React, { Component, useState } from 'react';
import { observer, inject } from 'mobx-react';
import {Link, withRouter} from 'react-router-dom';
import { getRandomInt, getTheme } from '../common/js';

import {Switch, SearchComponent} from './';
import {SwitchStore, SearchStore} from '../stores';

const searchStore = new SearchStore("Search", 0);

const themeSwitch = new SwitchStore(getTheme("getBool"), () => {
  getTheme("toggle");
});

interface NavbarProps {
  AuthStore: any,
  location: any
}

const Logo = (props) => {
  const logos = ["chicken", "hamburger", "beef", "salad"];
  const [current, setCurrent] = useState(getRandomInt(0,3));
  let random = () => {
    let rnd = getRandomInt(0,3);
    if (rnd == current) return random();
    return rnd;
  };
  React.useEffect(() => {
    setCurrent(random);
  }, [props.change]);

  return(
    <img src={`/api/logos/${logos[current]}.svg`} className="logo"></img>
  )
}


const NotLoggedLink = () =>
    <>
      <div className="header-item mr-5">
          <Link to="/explore" className="btn btn-white btn-rounder">Explore</Link>
      </div>
      <div className="header-item">
        <Link to="/login" className="header-link py-5px">
          Login
        </Link>
      </div>
      <div className="header-item">
        <Link to="/register" className="header-link py-5px">
          Register
        </Link>
      </div>
    </>

  const LoggedLink = observer(({userData, toggleMenu}) =>
    <>
      <div className="header-item">
        <SearchComponent 
          store={searchStore}
        />
      </div>
      <div className="header-item mr-5 explore-btn">
          <Link to="/explore" className="btn btn-white btn-rounder explore-btn">Explore</Link>
      </div>
      <div className="header-item">
        <details className="header-dropdown" id="profile">
          <summary className="btn btn-default px-7 header-button" onClick={(event) => {
            event.stopPropagation();
            toggleMenu(event);
          }}>
            <span className="big-screen">{userData.username}</span>
            <i className="arrow big-screen"></i>
            <div className="sml-photo mx-auto text-center">
              {userData.hasPhoto ? <img src={userData.url} className="card-img-top" /> : <img src="https://storage.googleapis.com/schnitzel/default.jpg" className="card-img-top" />}
            </div>
          </summary>
          <ul className="header-dropdown-menu dropdown-menu-dark">
            <Link to="/explore" className="dropdown-item explore-btn-small">Explore</Link>
            <li className="dropdown-divider explore-btn-small"></li>
            <Link to="/profile" className="dropdown-item">View Profile</Link>
            <Link to="/profile/edit" className="dropdown-item">Edit Profile</Link>
            <li className="dropdown-divider"/>
            <div className="dropdown-item noselect" onClick={(event) => {
              event.stopPropagation();
              themeSwitch.toggleClick();
              }}>
              <Switch 
                store={themeSwitch}
              /> 
              <span>Dark mode</span></div>
            <Link to="/logout" className="dropdown-item">Logout</Link>
          </ul>
        </details>
      </div>
    </>
  );
@inject("AuthStore")
@observer
class Navbar extends Component<NavbarProps> {
    render() {
        return (
          <>
            <header className="header border-bottom border-black p-5 f4">
                <div className={this.props.AuthStore.isAuth ? "header-item--full" : "header-item--full"}>
                    <Link to="/">
                      <Logo change={this.props.location.key} />
                    </Link>
                </div>
                { this.props.AuthStore.isAuth ? <LoggedLink userData={this.props.AuthStore.userData} toggleMenu={this.props.AuthStore.toggleMenu} /> : <NotLoggedLink /> }
            </header>
            {this.props.AuthStore.isAuth && this.props.AuthStore.menuShow && <div className="header-small">
              <ul className="header-dropdown-menu dropdown-menu-dark">
                <Link to="/explore" className="dropdown-item explore-btn-small">Explore</Link>
                <li className="dropdown-divider explore-btn-small"></li>
                <Link to="/profile" className="dropdown-item">View Profile</Link>
                <Link to="/profile/edit" className="dropdown-item">Edit Profile</Link>
                <div className="dropdown-item noselect" onClick={(event) => {
                  event.stopPropagation();
                  themeSwitch.toggleClick();
                  }}>
                  <Switch 
                    store={themeSwitch}
                  /> 
                  <span>Dark mode</span></div>
                <Link to="/logout" className="dropdown-item">Logout</Link>
              </ul>
            </div>}
          </>
        );
    }
}

export default withRouter(Navbar);