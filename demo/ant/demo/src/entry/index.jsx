import 'antd/dist/antd.less';
import ReactDOM from 'react-dom';
import React from 'react';
import {
    Row,
    Col,
    Menu,
    Icon,
    Carousel,
    Card
} from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

ReactDOM.render(
    <Row style={{background: '#e3e8eb'}}>
        <Row type="flex" justify="start" style={{background: '#fff'}}>
            <Col span={6}>欢迎！圆影   退出登录</Col>
            <Col span={6} offset={12} style={{'text-align': 'right'}}>自助分析  管理者中心  开发者中心</Col>
        </Row>
        <Row type="flex" justify="start" style={{background: '#fff'}}>
            <Col span={6} style={{'font-size':28,'text-align':'center'}}><Icon type="apple" /></Col>
            <Col span={18}>
                <Menu mode="horizontal">
                    <Menu.Item key="a"> <a href="#" >首页</a> </Menu.Item>
                    <Menu.Item key="b"> <a href="#" >管理仪表盘</a> </Menu.Item>
                    <Menu.Item key="c"> <a href="#" >业务分析</a> </Menu.Item>
                    <Menu.Item key="d"> <a href="#" >人员效能</a> </Menu.Item>
                    <Menu.Item key="e"> <a href="#" >报表中心</a> </Menu.Item>
                    <Menu.Item key="f"> <a href="#" >产品分析</a> </Menu.Item>
                    <Menu.Item key="g"> <a href="#" >应用中心</a> </Menu.Item>
                    <Menu.Item key="h"> <a href="#" >预警台</a> </Menu.Item>
                </Menu>
            </Col>
        </Row>
        <Row type="flex" justify="start">
            <Col span={24}>
                <Carousel autoplay>
                    <div style={{background: '#eee', 'line-height': 350, 'text-align': 'center'}}><h3>1</h3></div>
                    <div style={{background: '#eee', 'line-height': 350, 'text-align': 'center'}}><h3>2</h3></div>
                    <div style={{background: '#eee', 'line-height': 350, 'text-align': 'center'}}><h3>3</h3></div>
                    <div style={{background: '#eee', 'line-height': 350, 'text-align': 'center'}}><h3>4</h3></div>
                </Carousel>
            </Col>
        </Row>
        <Row type="flex" justify="start">
            <Col span={1}></Col>
            <Col span={22}>
                <Row type="flex" justify="start" gutter={10}>
                    <Col span={6}>
                        <Card title="我的收藏" extra={<a href="#">更多</a>}>
                            <p>卡片的内容</p>
                            <p>卡片的内容</p>
                            <p>卡片的内容</p>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="经常访问" extra={<a href="#">更多</a>}>
                            <p>卡片的内容</p>
                            <p>卡片的内容</p>
                            <p>卡片的内容</p>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="大家在看" extra={<a href="#">更多</a>}>
                            <p>卡片的内容</p>
                            <p>卡片的内容</p>
                            <p>卡片的内容</p>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="DIGO公告" extra={<a href="#">更多</a>}>
                            <p>卡片的内容</p>
                            <p>卡片的内容</p>
                            <p>卡片的内容</p>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col span={1}></Col>
        </Row>
        <Row type="flex" justify="start" style={{background: '#fff'}}>
            <Col span={6}>业务接入  建议与反馈</Col>
            <Col span={6} offset={12} style={{'text-align': 'right'}}>Copyright 2009-2016 版</Col>
        </Row>
    </Row>,
    document.getElementById('react-content')
);