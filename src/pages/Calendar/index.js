import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ru';   
import 'react-big-calendar/lib/css/react-big-calendar.css';

const messages = { // new
  allDay: 'весь день',
  previous: 'предыдущий',
  next: 'следующий',
  today: 'текущий',
  month: 'месяц',
  week: 'неделя',
  work_week: 'раб. неделя',
  day: 'день',
  agenda: 'повестка дня',
  date: 'дата',
  time: 'время',
  event: 'событие',
};


BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);


let allViews = Object.keys(BigCalendar.views).map(k => BigCalendar.views[k])

const events = [
  {
    'title': 'Событие на весь день',
    'allDay': true,
    'start': new Date(2017, 3, 0),
    'end': new Date(2017, 3, 1)
  },
  {
    'title': 'Длительное событие',
    'start': new Date(2017, 3, 7),
    'end': new Date(2017, 3, 10)
  },

  {
    'title': 'DTS STARTS',
    'start': new Date(2016, 2, 13, 0, 0, 0),
    'end': new Date(2016, 2, 20, 0, 0, 0)
  },

  {
    'title': 'DTS ENDS',
    'start': new Date(2016, 10, 6, 0, 0, 0),
    'end': new Date(2016, 10, 13, 0, 0, 0)
  },

  {
    'title': 'Какое-то событие',
    'start': new Date(2017, 3, 9, 0, 0, 0),
    'end': new Date(2017, 3, 9, 0, 0, 0)
  },
  {
    'title': 'Конференция',
    'start': new Date(2017, 3, 11),
    'end': new Date(2017, 3, 13),
    desc: 'Большая конференция для важных людей'
  },
  {
    'title': 'Встреча',
    'start': new Date(2017, 3, 12, 10, 30, 0, 0),
    'end': new Date(2017, 3, 12, 12, 30, 0, 0),
    desc: 'Подготовка к встрече'
  },
  {
    'title': 'Обед',
    'start':new Date(2017, 3, 12, 12, 0, 0, 0),
    'end': new Date(2017, 3, 12, 13, 0, 0, 0),
    desc: 'Вкусный обед'
  },
  {
    'title': 'Встреча',
    'start':new Date(2017, 3, 12,14, 0, 0, 0),
    'end': new Date(2017, 3, 12,15, 0, 0, 0)
  },
  {
    'title': 'Время для себя',
    'start':new Date(2017, 3, 12, 17, 0, 0, 0),
    'end': new Date(2017, 3, 12, 17, 30, 0, 0),
    desc: 'Самое важное мероприятие'
  },
  {
    'title': 'Ужин',
    'start':new Date(2017, 3, 12, 20, 0, 0, 0),
    'end': new Date(2017, 3, 12, 21, 0, 0, 0)
  },
  {
    'title': 'День рождения',
    'start':new Date(2017, 3, 13, 7, 0, 0),
    'end': new Date(2017, 3, 13, 10, 30, 0)
  },
  {
    'title': 'Ещё одно мероприятие',
    'start':new Date(2017, 3, 17, 19, 30, 0),
    'end': new Date(2017, 3, 18, 2, 0, 0)
  },
  {
    'title': 'Многодневное мероприятие',
    'start':new Date(2017, 3, 20, 19, 30, 0),
    'end': new Date(2017, 3, 22, 2, 0, 0)
  }
]

const Calendar = () => (
  <div className="content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <BigCalendar
            events={events} 
			messages={messages}
			culture='ru-RU'
            views={allViews}
            defaultDate={new Date(2017, 3, 1)} />
        </div>
      </div>
    </div>
  </div>
);

export default Calendar;