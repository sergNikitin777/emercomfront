let localState = {
	map: {
		params: [
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
				  }
			  ]
	}
	
};

export default JSON.stringify(localState);