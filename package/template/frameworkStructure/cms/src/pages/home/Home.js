import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainLayout from './MainLayout';
import PageSpinner from '../../components/PageSpinner';
import CreateNotification from '../notifification/CreateNotification';
import UserList from '../userList/UserList';
import BlockedUserList from '../userList/BlockedUserList';
import MilestoneListModel from '../profile/MilestoneListModel';
import ProfilePage from '../profile/ProfilePage';

const routePaths = [
  { to: '/', title: 'Users List', Component: UserList },
  { to: '/users', title: 'Users List', Component: UserList },
  { to: '/notifications', title: 'Create Notification', Component: CreateNotification },
  { to: '/blocked_list', title: 'Blocked users', Component: BlockedUserList },
  { to: '/milestone_icons', title: 'Milestone List', Component: MilestoneListModel },
  { to: '/user_profile/:userId', title: 'User Profile', Component: ProfilePage }
];

export default function Home(props) {
  const [routeTitle, setRouteTitle] = useState("");
  const [routeBreadcrumbs, setRouteBreadcrumbs] = useState("");
  return (
    <Router>
      <div className="d-flex">
        <MainLayout {...props} breakpoint={props.breakpoint} routeTitle={routeTitle} routeBreadcrumbs={routeBreadcrumbs}>
          <React.Suspense fallback={<PageSpinner />}>
            {routePaths.map(({ to, Component, title }) => (<Route key={to} exact path={to} render={() => { setRouteTitle(title); return (<Component {...props} setRouteBreadcrumbs={setRouteBreadcrumbs} />) }} />))}
          </React.Suspense>
        </MainLayout>
      </div>
    </Router>
  );
}
