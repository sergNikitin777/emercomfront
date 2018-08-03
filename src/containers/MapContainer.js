import { connect } from 'react-redux';

import { getState } from '../actions';
import Map from '../pages/Map';

function mapDispatchToProps(dispatch) {
    return {
        getState: () => dispatch(getState())
    };
}

const MapContainer = connect(null, mapDispatchToProps)(Map);

export default MapContainer;