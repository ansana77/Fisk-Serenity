import axios from 'axios';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ScheduleAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [dateSet, setDateSet] = useState(new Set());
  const [isBusy, setIsBusy] = useState(true);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    axios
      .get('/appointments')
      .then((res) => res.data)
      .then((data) => {
        if (data) {
          const upcomingAppointments = filterUpcomingAppointments(
            data.appointments
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
      return appointmentDate > currentDate && appointment.booked === false;
    });
    return upcomingAppointments;
  };

  const getTimes = (date) => {
    let dateString = date.toISOString().split('T')[0];
    axios.get(`/appointments/date/${dateString}`).then((res) => {
      const appointments = res.data.appointments;
      const timesList = appointments.map((appointment) => {
        const time = new Date(appointment.time);
        const id = appointment._id;
        return {
          time: time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }),
          id: id,
        };
      });
      setTimes(timesList);
    });
  };

  const handleBook = (key, time) => {
    Swal.fire({
      title: `Confirm Appointment`,
      text: `Do you want confirm your appointment at ${time}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, book it!',
      cancelButtonText: 'No, I changed my mind',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`/appointments/${key}/book`)
          .then((res) => res.data)
          .then((data) => {
            if (data) {
              Swal.fire({
                title: 'Booked!',
                text: 'Your appointment has been booked.',
                icon: 'success',
                confirmButtonText: 'Cool',
              }).then(() => {
                window.location.reload();
              });
            }
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error!',
              text: err.response.data.message,
              icon: 'error',
              confirmButtonText: 'Cool',
            });
          });
      }
    });
  };

  return (
    <div className="schedule__appointments bg-white w-[80%] rounded-xl m-10 p-10">
      <h1 className="text-[#373737] text-center font-bold text-2xl mb-5">
        Let&apos;s Talk!
      </h1>
      <p className="text-center text-[#373737] text-md">
        Schedule a 30 min one-to-one to discuss your goals and challenges
      </p>
      <div className="p-5 text-right pt-0">
        {!isBusy && (
          <Calendar
            className="m-auto mt-5"
            tileClassName={({ date, view }) => {
              if (dateSet.has(date.toLocaleDateString())) {
                return 'highlighted';
              }
            }}
            onClickDay={(value, event) => getTimes(value)}
          ></Calendar>
        )}
        <p className="italic mt-5 text-sm align-middle mr-[25%]">
          <span>
            <FaInfoCircle className="inline text-gray-500 mr-1" />
            Available Dates are{' '}
            <span className="text-serenity-pink">highlighted</span>
          </span>
        </p>
      </div>
      {times.length > 0 && (
        <div className="times mt-10 border-t-4 border-t-gray-200 pt-5">
          <h1 className="text-[#373737] text-center font-bold text-2xl">
            Pick a Time
          </h1>
          <div className="grid grid-cols-4 gap-4 place-items-center">
            {times.map((time) => (
              <div
                className="bg-serenity-pink text-white p-2 text-xs text-center align-middle inline-block cursor-pointer my-5"
                key={time.id}
                onClick={() => handleBook(time.id, time.time)}
              >
                {time.time}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleAppointments;
