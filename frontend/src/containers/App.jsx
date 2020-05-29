import React, { Component } from 'react'

import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries
} from 'react-vis';

import styles from './app.css'
import 'antd/dist/antd.css';
import 'react-vis/dist/style.css';

import DashboardContainer from './DashboardPage/DashboardContainer.jsx'

export default class App extends Component {
  render() {
    return (
      <Layout>
        <Header>Dashboard</Header>
        <Layout>
          <Sider>Sider</Sider>
          <Content>Content
            <DashboardContainer></DashboardContainer>
          </Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
      
    )
  }
}
