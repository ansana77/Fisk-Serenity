import axios from 'axios';
import Swal from 'sweetalert2';
import { FaTimesCircle } from 'react-icons/fa';

const AppointmentList = ({ appointment }) => {
  const monthToFullMonthName = (month) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July ',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month];
  };

  const formattedDate = (date) => {
    const parsedDateTime = new Date(date);
    const day = parsedDateTime.getDate();
    const month = monthToFullMonthName(parsedDateTime.getMonth());
    const year = parsedDateTime.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Cancel?',
      text: 'Are you sure you want to cancel this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`/appointments/${appointment._id}/cancel`)
          .then((res) => res.data)
          .then((data) => {
            if (data) {
              Swal.fire({
                title: 'Cancelled!',
                text: 'Your appointment has been cancelled.',
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
    <div className="appointment__information flex my-5">
      <div className="bg-serenity-pink text-white rounded-md p-2 text-md w-[2.5rem] h-[2.5rem] text-center align-middle inline-block my-1">
        {new Date(appointment.time).getDate()}
      </div>
      <div className="flex-col ml-5">
        <p className="font-bold text-lg">
          Appointment With {appointment.counselor.username}
        </p>
        <p className="text-[#626161] font-poppins text-sm">
          {formattedDate(appointment.time)}
        </p>
      </div>
      <div className="ml-auto pt-3">
        <FaTimesCircle
          className="text-[#626161] text-2xl cursor-pointer"
          onClick={handleCancel}
        ></FaTimesCircle>
      </div>
    </div>
  );
};

export default AppointmentList;
