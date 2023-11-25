import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import { AppError } from '../utils/errorUtils.js';

// Get all appointments
const getAllAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find({})
    .populate('counselor', 'username')
    .populate('user', 'username')
    .sort({ time: 1 });
  res.status(200).json({
    message: 'Success',
    appointments,
  });
});

// Get a single appointment
const getAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id).populate(
    'counselor',
    'username'
  );
  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }
  res.status(200).json({
    message: 'Success',
    appointment,
  });
});

// Create an appointment
const createAppointment = asyncHandler(async (req, res, next) => {
  const { time } = req.body;
  const counselor = req.user;
  if (!time) {
    return next(new AppError('Please provide a time', 400));
  }
  if (counselor.role !== 'COUNSELOR' && counselor.role !== 'ADMIN') {
    return next(
      new AppError('You are not authorized to create an appointment', 403)
    );
  }
  const appointment = await Appointment.create({
    time,
    counselor,
  });
  const counselordb = await User.findById(req.user._id);
  counselordb.appointments.push(appointment);
  await counselordb.save();
  res.status(201).json({
    message: 'Success',
    appointment,
  });
});

// Book an appointment
const bookAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }
  if (appointment.booked) {
    return next(new AppError('Appointment already booked', 400));
  }
  let upcomingAppointmentsCount = 0;
  const user = await User.findById(req.user._id).populate('appointments');
  user.appointments.forEach((appointment) => {
    if (new Date(appointment.time) > Date.now()) {
      upcomingAppointmentsCount++;
    }
  });
  if (upcomingAppointmentsCount >= 2) {
    return next(
      new AppError(
        'You already have 2 upcoming appointments. Please cancel an appointment to book a new one',
        400
      )
    );
  }
  appointment.user = req.user;
  appointment.booked = true;
  user.appointments.push(appointment);
  await user.save();
  await appointment.save();
  res.status(200).json({
    message: 'Success',
    appointment,
  });
});

// Cancel an appointment
const cancelAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }
  if (!appointment.user) {
    return next(new AppError('Appointment not booked', 400));
  }
  if (
    appointment.user.toString() !== req.user._id.toString() &&
    appointment.counselor.toString() !== req.user._id.toString()
  ) {
    return next(
      new AppError('You are not authorized to cancel this appointment', 403)
    );
  }
  const user = await User.findById(appointment.user._id);
  user.appointments = req.user.appointments.filter(
    (appointment) => appointment._id.toString() !== req.params.id
  );
  appointment.user = null;
  appointment.booked = false;
  await user.save();
  await appointment.save();
  res.status(200).json({
    message: 'Success',
    appointment,
  });
});

// Edit an appointment
const editAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }
  const { time } = req.body;
  const isCounselor = req.user.role === 'COUNSELOR';
  if (
    !isCounselor ||
    req.counselor._id.toString() !== appointment.counselor._id.toString()
  ) {
    return next(
      new AppError('You are not authorized to edit this appointment', 403)
    );
  }
  if (!time) {
    return next(new AppError('Please provide a time', 400));
  }
  //dummy notify the user
  if (appointment.user) {
    console.log(
      `Notify ${appointment.user.username} that their appointment has been cancelled`
    );
  }
  appointment.time = time;
  await appointment.save();
  res.status(200).json({
    message: 'Success',
    appointment,
  });
});

// Delete an appointment
const deleteAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }
  const isCounselor = req.user.role === 'COUNSELOR';
  if (
    !isCounselor ||
    req.counselor._id.toString() !== appointment.counselor._id.toString()
  ) {
    return next(
      new AppError('You are not authorized to delete this appointment', 403)
    );
  }
  //dummy notify the user
  if (appointment.user) {
    console.log(
      `Notify ${appointment.user.username} that their appointment has been cancelled`
    );
  }
  const user = await User.findById(appointment.user._id);
  user.appointments = req.user.appointments.filter(
    (appointment) => appointment._id.toString() !== req.params.id
  );
  await user.save();
  await appointment.remove();

  res.status(200).json({
    message: 'Success',
    appointment,
  });
});

const getAppointmentsForDate = asyncHandler(async (req, res, next) => {
  const { date } = req.params;
  const appointments = await Appointment.find({
    time: {
      $gte: new Date(date),
      $lt: new Date(date).setDate(new Date(date).getDate() + 1),
    },
    booked: false,
  })
    .populate('counselor', 'username')
    .sort({ time: 1 });
  res.status(200).json({
    message: 'Success',
    appointments,
  });
});

export {
  getAllAppointments,
  getAppointment,
  createAppointment,
  bookAppointment,
  cancelAppointment,
  editAppointment,
  deleteAppointment,
  getAppointmentsForDate,
};
