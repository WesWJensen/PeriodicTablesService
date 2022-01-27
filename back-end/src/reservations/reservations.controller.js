const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
//similar to checkId
async function reservationExists (req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id)
  if (data) {
    res.locals.reservation = data;
    return next();
  }
  next({status: 404, message: `Reservation ${reservation_id} cannot be found`})
}


//make sure form has all field filled in correctly 
//similar to validateNewReservation
async function validForm(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: 'Data Missing!' });

  const { first_name, last_name, mobile_number, people, reservation_date, reservation_time, status } = req.body.data;

  if (!first_name)
    return next({ status: 400, message: 'Be sure to include first_name' });

  if (!last_name)
    return next({ status: 400, message: 'Be sure to include last_name' });

  if (!mobile_number)
    return next({ status: 400, message: 'Be sure to include mobile_number' });

  if (!people)
    return next({ status: 400, message: 'Be sure to include people' });

  if (!reservation_date)
    return next({ status: 400, message: 'Be sure to include reservation_date' });

  if (!reservation_time)
    return next({ status: 400, message: 'Be sure to include reservation_time' });

  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/))
    return next({ status: 400, message: 'reservation_date is invalid!' });

  if (!reservation_time.match(/\d{2}:\d{2}/))
    return next({ status: 400, message: 'reservation_time is invalid!' });

  if (typeof people !== 'number')
    return next({ status: 400, message: 'people is not a number!' });

  if (status === 'seated')
    return next({ status: 400, message: 'status can not be seated!' });

  if (status === 'finished')
    return next({ status: 400, message: 'status can not be finished!' });

  res.locals.reservation = { first_name, last_name, mobile_number, people, reservation_date, reservation_time };
  next();
}

async function validDate(req, res, next) {
  const date = new Date(res.locals.reservation.reservation_date);
  const currentDate = new Date();

  if (date.getUTCDay() === 2)
    return next({ status: 400, message: "We're closed on Tuesdays!" });

  if (date.valueOf() < currentDate.valueOf() && date.toUTCString().slice(0, 16) !== currentDate.toUTCString().slice(0, 16))
    return next({ status: 400, message: "Reservations must be made in the future!" });

  next();
}


function validTime(req, res, next) {
  // Request Time
  const time = res.locals.reservation.reservation_time;
  let hour = time[0] + time[1];
  let minutes = time[3] + time[4];
  hour = Number(hour);
  minutes = Number(minutes);

  // Current Time from Frontend Request
  const currentTime = req.body.data.current_time;
  const date = new Date(res.locals.reservation.reservation_date);
  const currentDate = new Date();

  // Checks to see if the requested time has passed and is on the current date
  if (currentTime > time && date.toUTCString().slice(0, 16) === currentDate.toUTCString().slice(0, 16))
    return next({ status: 400, message: "Time has already passed!" });

  if (hour < 10 || (hour <= 10 && minutes < 30))
    return next({ status: 400, message: "We're not open yet" });

  if (hour > 21 || (hour >= 21 && minutes > 30))
    return next({ status: 400, message: "Too close to closing time or closed!" });

  next();
}


async function validStatusUpdate(req, res, next) {
  const currentStatus = res.locals.reservation.status;
  const { status } = req.body.data;

  if (currentStatus === 'finished')
    return next({ status: 400, message: 'a finished reservation cannot be updated' })

  if (status === 'cancelled')
    return next();

  if (status !== 'booked' && status !== 'seated' && status !== 'finished')
    return next({ status: 400, message: 'Can not update unknown status' });

  next();
}

async function validUpdate(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: 'Data Missing!' });

  const { first_name, last_name, mobile_number, people, reservation_date, reservation_time } = req.body.data;

  if (!first_name)
    return next({ status: 400, message: 'Be sure to include first_name' });

  if (!last_name)
    return next({ status: 400, message: 'Be sure to include last_name' });

  if (!mobile_number)
    return next({ status: 400, message: 'Be sure to include mobile_number' });

  if (!people)
    return next({ status: 400, message: 'Be sure to include people' });

  if (!reservation_date)
    return next({ status: 400, message: 'Be sure to include reservation_date' });

  if (!reservation_time)
    return next({ status: 400, message: 'Be sure to include reservation_time' });

  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/))
    return next({ status: 400, message: 'reservation_date is invalid!' });

  if (!reservation_time.match(/\d{2}:\d{2}/))
    return next({ status: 400, message: 'reservation_time is invalid!' });

  if (typeof people !== 'number')
    return next({ status: 400, message: 'people is not a number!' });

  res.locals.reservation = { first_name, last_name, mobile_number, people, reservation_date, reservation_time };

  next();
}





async function list(req, res, next) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  if (date) {
    let reservations = await service.getAllReservations(date);
    res.json({
      data: reservations,
    });

  } else if (mobile_number) {
    res.json({ data: await service.findWithMobileNumber(mobile_number)});
    return;
  } 

}



async function create(req, res) {
  const data = await service.create(res.locals.reservation);
  res.status(201).json({data: data[0]})
}

async function read(req, res) {
  const {reservation} = res.locals;
  res.status(200).json({ data: reservation})
}

async function update(req, res) {
  const { reservation_id } = req.params;
  const data = await service.update(reservation_id, res.locals.reservation);
  res.status(200).json({
    data: data[0],
  });
}

async function updateStatus(req, res) {
  const { reservation_id } = req.params;
  const status = req.body.data.status;
  const data = await service.updateStatus(reservation_id, status);

  res.status(200).json({
    data: { status: data[0] },
  });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [ asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)], 
  create: [ asyncErrorBoundary(validForm), asyncErrorBoundary(validDate), asyncErrorBoundary(validTime), asyncErrorBoundary(create)], 
  updateStatus: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(validStatusUpdate), asyncErrorBoundary(updateStatus)],
  update: [ asyncErrorBoundary(reservationExists), asyncErrorBoundary(validUpdate), asyncErrorBoundary(validDate), asyncErrorBoundary(validTime), asyncErrorBoundary(update)], 
  
};