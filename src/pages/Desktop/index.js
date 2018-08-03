import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';

const Desktop = () => (
  <div className="row">
    <div className="col-md-12">
      <div className="card">
        <div className="header">
          <h4 className="title">Сводная информация</h4>
          {/*<p className="category">Tabs with icons and full width</p>*/}
        </div>
        <div className="content content-full-width">
          <Tabs defaultActiveKey={1} id="tab-with-icons">
            <Tab eventKey={1} title={<span><i className="fa fa-info"></i> Информация</span>}>Tab 1</Tab>
            <Tab eventKey={2} title={<span><i className="fa fa-user"></i> Сотрудники</span>}>Tab 2</Tab>
            <Tab eventKey={3} title={<span><i className="fa fa-cube"></i> Настройки</span>}>Tab 3</Tab>
          </Tabs>
        </div>
      </div>
    </div>

  </div>
);

export default Desktop