import avatarImage from 'assets/images/faces/face-0.jpg';

const defaultUserInfo = {
  name: 'Пользователь',
  image: avatarImage
};

export default function reducer(state = {
  user: defaultUserInfo
}, action) {
  return state;
}


//image: 'http://demos.creative-tim.com/light-bootstrap-dashboard-pro/assets/img/default-avatar.png'