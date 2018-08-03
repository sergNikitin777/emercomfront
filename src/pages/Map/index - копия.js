import React, {Component} from 'react';
import {Button, Modal, OverlayTrigger, Tabs, Tab} from 'react-bootstrap';
import Map from 'pigeon-maps';
import Marker from './Marker';


//import localState from '../../config/localState';

const mapConfig = {
  center: [58.0099, 56.25],
  zoom: 13
};

const getProvider = (x, y, z) => `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;

const inWidth = window.innerWidth - 280;
const inHeight = window.innerHeight - 180;

const providers = {
  osm: (x, y, z) => {
    const s = String.fromCharCode(97 + (x + y + z) % 3)
    return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`
  },
  wikimedia: (x, y, z) => {
    const retina = typeof window !== 'undefined' && window.devicePixelRatio >= 2 ? '@2x' : ''
    return `https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}${retina}.png`
  },
  stamen: (x, y, z) => {
    const retina = typeof window !== 'undefined' && window.devicePixelRatio >= 2 ? '@2x' : ''
    return `https://stamen-tiles.a.ssl.fastly.net/terrain/${z}/${x}/${y}${retina}.jpg`
  }
}

//const params = JSON.parse(localState).map.params;

const params = [
  {
	  title: 'Просмотр оборудования №123',
	  details: {
		  address: 'г. Пермь, ул. Ленина, 68',
		  type: 'СРУ',
		  producer: 'Производитель 1',
		  year: '01.07.2017',
		  services: 'ТО-1, ТО-2',
		  ekt: 'ID ЭКТ',
	  }
  },
  {
	  title: 'Просмотр оборудования №122',
	  details: {
		  address: 'г. Пермь, ул. Пушкина, 60',
		  type: 'СРУ II',
		  producer: 'Производитель 2',
		  year: '01.07.2018',
		  services: 'ТО-3',
		  ekt: 'ID ЭКТ',
	  }
  },
  {
	  title: 'Просмотр оборудования №125',
	  details: {
		  address: 'г. Пермь, ул. Пушкина, 80',
		  type: 'СРУ IIUI',
		  producer: 'Производитель 3',
		  year: '01.07.2019',
		  services: 'ТО-4, ТО-5, ТО-10',
		  ekt: 'ID ЭКТ',
	  }
  }
];

const markers = [
  {
    name: 0,
    latlng: [58.0099912, 56.257386],
	type: 1
  },
  {
    name: 1,
    latlng: [58.0058812, 56.252286],
	type: 2
  }  ,
  {
    name: 2,
    latlng: [58.0018812, 56.250286],
	type: 3
  } 
];

class EquipmentMap extends React.Component {
  constructor(props, context) {
    super(props, context);
	this.store = this.props.store;

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
	  modalTitle: ''
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(env) {
	 //this.props.getState(); 
	 this.setState({ 
	     modalTitle: params[env.payload].title,
		 modalDetailsAddress: params[env.payload].details.address,
		 modalDetailsType: params[env.payload].details.type,
		 modalDetailsProducer: params[env.payload].details.producer,
		 modalDetailsYear: params[env.payload].details.year,
		 modalDetailsServices: params[env.payload].details.services,
		 modalDetailsEkt: params[env.payload].details.ekt,
	 });

    this.setState({ show: true });
  }
  


  render() {
	 
    const PigeonMarkers = markers.map(marker => (
      <Marker key={`marker_${marker.name}`} type={marker.type} anchor={marker.latlng} payload={marker.name} onClick={this.handleShow} />
    ));	  
	
    const imgStyle = {
	  position: 'absolute', 
	  transform: 'translate(924.817px, 464.189px)',
	  cursor: 'pointer',
	  width: '29px',
	  height: '34px',
	  border: '0 none',
    };		
	  
    return (		
      <div>
		  <div className="map">  		
			<Map
			  width={inWidth}
			  height={inHeight}
			  defaultCenter={mapConfig.center}
			  defaultZoom={mapConfig.zoom}
			  provider={providers['osm']}
			  >
			  {PigeonMarkers}
			</Map> 
		  </div>
		  
			<Modal show={this.state.show} onHide={this.handleClose} bsSize="large" aria-labelledby="contained-modal-title-lg">
			  <Modal.Header closeButton>
				<Modal.Title>{this.state.modalTitle}</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
				<h4>СРУ БАО-600</h4>
			    <Tabs defaultActiveKey={1} id="tab-with-icons">
				  <Tab eventKey={1} title={<span>Детали</span>}>
				    <div className="card">
					<div className="content">
					  <div className="typo-line">
						<p><span className="category">Адрес </span> {this.state.modalDetailsAddress}</p>
					  </div>
					  <div className="typo-line">
						<p><span className="category">Тип</span> {this.state.modalDetailsType}</p>
					  </div>
					  <div className="typo-line">
						<p><span className="category">Производитель</span> {this.state.modalDetailsProducer}</p>
					  </div>	
					  <div className="typo-line">
						<p><span className="category">Год выпуска</span> {this.state.modalDetailsYear}</p>
					  </div>
					  <div className="typo-line">
						<p><span className="category">Виды <br />необходимых ТО</span> {this.state.modalDetailsServices}</p>
					  </div>
					  <div className="typo-line">
						<p><span className="category">ID ЭКТ</span> {this.state.modalDetailsEkt}</p>
					  </div>	
					</div>		
                    </div>						
				  </Tab>
				  <Tab eventKey={2} title={<span>План обслуживания</span>}>
					  <div className="card">
						<div className="content table-responsive table-full-width">
						  <table className="table table-hover table-striped">
							<thead>
							  <tr>
								<th>№</th>
								<th>Плановая дата проведения обслуживания</th>
								<th>Вид ТО</th>
							  </tr>
							</thead>
							<tbody>
								<tr>
								  <td>1</td>
								  <td>01.02.2017</td>
								  <td>ТО-1</td>
								</tr>
								<tr>
								  <td>2</td>
								  <td>02.03.2018</td>
								  <td>ТО-2</td>
								</tr>
							</tbody>
						  </table>
						</div>
					  </div>				  
				  </Tab>
				  <Tab eventKey={3} title={<span>История обслуживания</span>}>
					  <div className="card">
						<div className="content table-responsive table-full-width">
						  <table className="table table-hover table-striped">
							<thead>
							  <tr>
								<th>№</th>
								<th>Вид ТО</th>
								<th>Дата проведения</th>
								<th>Трудозатраты</th>
								<th>Замена элементов</th>
								<th>Результат (комментарий)</th>
								<th>Исполнитель</th>
							  </tr>
							</thead>
							<tbody>
								<tr>
								  <td>1</td>
								  <td>ТО-1</td>
								  <td>01.02.2017</td>
								  <td>5 ч</td>
								  <td>нет</td>
								  <td>завершено успешно</td>
								  <td>Сидоров А.А.</td>
								</tr>
								<tr>
								  <td>2</td>
								  <td>ТО-2</td>
								  <td>02.03.2018</td>
								  <td>10 ч</td>
								  <td>нет</td>
								  <td>ТО-2 выявило некоторые неполадки в оборудовании</td>
								  <td>Сидоров А.А.</td>
								</tr>
							</tbody>
						  </table>
						</div>
					  </div>
				  </Tab>
			    </Tabs>
			  </Modal.Body>
			  <Modal.Footer>
				<Button onClick={this.handleClose}>Закрыть</Button>
			  </Modal.Footer>
			</Modal>
      </div>
    );
  }
}

export default EquipmentMap;






