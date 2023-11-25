import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import AppointmentList from './AppointmentList';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [dateSet, setDateSet] = useState(new Set());
  const [isBusy, setIsBusy] = useState(true);

  useEffect(() => {
    axios
      .get('users/me')
      .then((res) => res.data)
      .then((data) => {
        if (data) {
          const upcomingAppointments = filterUpcomingAppointments(
            data.user.appointments
          );
          setAppointments(upcomingAppointments);
          upcomingAppointments.map((appointment) => {
            dateSet.add(new Date(appointment.time).toLocaleDateString());
          });
        }
        setIsBusy(false);
      });
  }, []);

  const filterUpcomingAppointments = (appointments) => {
    const upcomingAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.time);
      const currentDate = new Date();
      return appointmentDate > currentDate;
    });
    return upcomingAppointments;
  };

  return (
    <div className="UpcomingAppointments bg-white rounded-xl m-10 p-10">
      <h1 className="text-[#373737] text-center font-bold text-2xl mb-5">
        Appointments
      </h1>
      {!isBusy && (
        <Calendar
          tileClassName={({ date, view }) => {
            if (dateSet.has(date.toLocaleDateString())) {
              return 'highlighted';
            }
          }}
        ></Calendar>
      )}
      <div className="appointments mt-10 border-t-4 border-t-gray-200 pt-5">
        <h1 className="text-[#373737] text-center font-bold text-2xl mb-7">
          Upcoming Appointments
        </h1>
        {appointments.map((appointment) => (
          <AppointmentList appointment={appointment} key={appointment._id} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
