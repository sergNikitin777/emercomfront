export const enumFormatter = (cell, row, enumObject) => enumObject[cell];

export const dateFormatter = (cell, row) => (!cell) ? '' : cell.slice(-2) + '.' + cell.slice(5, 7) + '.' + cell.slice(0, 4);

export const addZero = (num) => (num < 10) ?  '0' + num : '' + num;

export const formatDateFromServer = (fData) => {
	let d = new Date(fData);
    return d.getFullYear() + '/' + addZero(d.getMonth() + 1) + '/' + addZero(d.getDate());	
}

export const formatDateToTime = data => new Date(data.slice(0, 4), data.slice(5, 7), data.slice(-2)).getTime();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getFetch = (url = ``, method = 'GET', data = {}) => {
	const params = {
        method: method, 
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    }	
	
	if(method === 'POST' || method === 'PUT'){
		params.body = JSON.stringify(data); 
	}
	
    return fetch(url, params)
		.then(response => response.json())
		.catch(error => console.error(`Fetch Error =\n`, error));
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const validation = (type, val) => {
	switch(type){
		case 'empty': 
		    return (val === '') ? false : true;
		  break;
		case 'integer':
		    return Number.isInteger(+val) ? true : false;
		  break;		
		case 'select':
		    return +val !== 0 ? true : false;
		  break;
		case 'year':
		    return (Number.isInteger(+val) && val.length === 4) ? true : false;
		  break;  
		case 'array':
		    return (val.length === 0) ? false : true;
		  break;  
		case 'none':
		    return true;
		  break;  
	}
}



