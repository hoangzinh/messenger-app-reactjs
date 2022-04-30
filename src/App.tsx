import { FunctionComponent } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';

import AccountSelectionPage from './pages/AccountSelectionPage';
import ConversationsPage from './pages/ConversationsPage';
import TopNavigation from './components/TopNavigation';

import './App.css';

const { Header, Content } = Layout;

const App: FunctionComponent = () => {
  return (
    <Layout className="layout">
      <Header style={{ height: '65px' }}>
        <div className="logo">Messenger App</div>
        <TopNavigation />
      </Header>
      <Content style={{ padding: '0', height: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/" element={<AccountSelectionPage />} />
          <Route
            path="/account/:id/conversations"
            element={<ConversationsPage />}
          />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
