import { useState, useEffect } from 'react';
import axios from 'axios';
import UpcomingAppointments from './UpcomingAppointments';
import ScheduleAppointments from './ScheduleAppointments';

const StudentAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get('/appointments')
      .then((res) => res.data)
      .then((data) => {
        if (data) {
          setAppointments(data.appointments);
        }
      });
  }, []);

  return (
    <div className="StudentAppointments flex h-[91.5vh]">
      <ScheduleAppointments />
      <div className="appointments">
        <UpcomingAppointments />
      </div>
    </div>
  );
};

export default StudentAppointments;
