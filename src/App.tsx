import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { HomeOutlined, MessageOutlined } from '@ant-design/icons';

import AccountSelectionPage from './pages/AccountSelectionPage';
import ConversationsPage from './pages/ConversationsPage';

import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Header style={{ height: '65px' }}>
        <div className="logo">Messenger App</div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Account Selection</Link>
          </Menu.Item>
          <Menu.Item key="conversations" icon={<MessageOutlined />}>
            <Link to="/conversations">Conversations</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/" element={<AccountSelectionPage />} />
          <Route path="/conversations" element={<ConversationsPage />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
