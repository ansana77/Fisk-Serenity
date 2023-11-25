import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import {
  getAllAppointments,
  getAppointment,
  createAppointment,
  bookAppointment,
  cancelAppointment,
  editAppointment,
  deleteAppointment,
  getAppointmentsForDate,
} from '../controllers/appointmentController.js';

const appointmentRouter = Router();
appointmentRouter.get('/', getAllAppointments);
appointmentRouter.get('/:id', getAppointment);
appointmentRouter.post('/', isAuthenticated, createAppointment);
appointmentRouter.patch('/:id/book', isAuthenticated, bookAppointment);
appointmentRouter.patch('/:id/edit', isAuthenticated, editAppointment);
appointmentRouter.delete('/:id', isAuthenticated, deleteAppointment);
appointmentRouter.patch('/:id/cancel', isAuthenticated, cancelAppointment);
appointmentRouter.get('/date/:date', getAppointmentsForDate);

export default appointmentRouter;
