import { BookingModel } from "../models/Booking.js";
import { TripModel } from "../models/Trip.js";//BookingSeatModel
import { BusSeatModel } from "../models/BusSeat.js"; 
import { BookingSeatModel } from "../models/BookingSeat.js";
import { ScheduleSeatModel } from "../models/ScheduleSeatModel.js";
import { generateBookingReference } from "../utilities/utiles.js"
import { pool } from "../db.js";

// @Get-all Booking
export const allBookings = async (req, res) => {
    console.log("bookings-user", req.user)
	try {
		const data = await BookingModel.getAll();
    	res.status(200).json({
    		success: true,
	        message: "Bookings fetched successfully",
	        data
    	})
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Get Booking by ID
export const myBookings = async (req, res) => {
	const { bookingID } = req.params;
	try {
		const data = await BookingModel.userBookings(bookingID);
    	res.status(200).json({
    		success: true,
	        message: "My Bookings fetched successfully",
	        data
    	})
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Get one Booking
export const oneBooking = async (req, res) => {
	const { bookingID } = req.params;
	try {
	    const result = await BookingModel.getOne(bookingID);
	    if (!result) {
	    	return res.status(404).json({ error: "Booking not found."})
	    }
	    res.status(201).json({
	    	success: true,
	        message: "Booking fetched successfully",
	        data: result
	    })
	} catch (error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Create new Booking
// export const createBooking = async (req, res) => {
// 	let transaction;
// 	try { // db
// 		transaction = await pool.getConnection();
//         await transaction.beginTransaction();

// 		const { trip_id, schedule_id, user_id, passenger_count, discount_amount, emergency_contact_name, emergency_contact_phone, subtotal, total_amount, promo_code_id, tax_amount, passengers = [], seats = [] } = req.body;
// 		// console.log(req.body)

// 		// 1. Validate Trip Existence BEFORE creating any records

// 	    const trip = await TripModel.getById(trip_id, transaction);
// 	    // console.log("trip", trip) // object
// 	    // console.log("trip_id", trip_id)

// 	    if (!trip || !trip.bus_id) {
// 	      	await transaction.rollback();
// 	      	return res.status(404).json({
// 	        	success: false,
// 	        	message: "Trip not found"
// 	      	});
// 	    }

// 	    if (!seats || seats.length === 0) {
// 		    await transaction.rollback();
// 		    return res.status(400).json({
// 		        success: false,
// 		        message: "One or more selected seats do not exist for this bus"
// 		    });
// 	    }

// 	    // 2. Look up all seats in a SINGLE query
// 	    const seatNumbers = seats.map(s => String(s.seat_number));
// 	    // console.log("seatNumbers", seatNumbers)

// 	    // const rawBusSeats = await BusSeatModel.getBySeatNumbers(trip.bus_id, seatNumbers, transaction);
	    
// 	    const busSeats = await BusSeatModel.getBySeatNumbers(trip.bus_id, seatNumbers, transaction);

// 	    console.log("=====busSeats=====", busSeats)
// 	    // console.log("=====seats=====", seats)

// 	    if (!busSeats || busSeats.length !== seats.length) {
// 	      	await transaction.rollback();
// 	      	return res.status(400).json({
// 	        	success: false,
// 	        	message: "One or more selected seats do not exist for this bus"
// 	      	});
// 	    }

// 	    // Map seat_number to busSeat object
// 	    const busSeatMap = new Map(busSeats.map(bs => [String(bs.seat_number), bs]));
// 	    console.log("busSeatMap", busSeatMap)

// 	    // 4. Lock & Validate Schedule Seats Status (Prevents Double Booking)
//         const scheduleSeatIds = seats
//             .map(s => s.schedule_seat_id)
//             .filter(Boolean);
//             console.log(scheduleSeatIds)

//         if (scheduleSeatIds.length > 0) {
//              // 2. Auto-generate bookable seats for this specific trip instance
// 		    await ScheduleSeatModel.getBookedSeats(
// 			    {
// 			    	scheduleSeatIds
// 			    },
// 			    transaction
// 		    );

//             // Verify all requested schedule seats are valid & available/held by current user
//             const isAnySeatTaken = availableSeats.some(s => {
//                 if (s.status === 'booked') return true;
//                 if (s.status === 'held' && s.held_by_user_id !== user_id) return true;
//                 return false;
//             });
//             console.log(isAnySeatTaken)

//             if (isAnySeatTaken) {
//                 await transaction.rollback();
//                 return res.status(409).json({
//                     success: false,
//                     message: "One or more seats have already been booked or held by another user."
//                 });
//             }

//             // Mark schedule seats as booked
//             await ScheduleSeatModel.makeScheduleBooked(
// 			    {
// 			    	scheduleSeatIds
// 			    },
// 			    transaction
// 		    );
//         }

// 	    // 3. Create Primary Booking Record
// 	    const bookingReference = generateBookingReference();
// 	    console.log("bookingReference", bookingReference)

// 	    const result = await BookingModel.create(
// 		    {
// 		        trip_id,
// 		        schedule_id,
// 		        user_id,
// 		        passenger_count,
// 		        discount_amount,
// 		        emergency_contact_name,
// 		        emergency_contact_phone,
// 		        subtotal,
// 		        total_amount,
// 		        promo_code_id,
// 		        tax_amount,
// 		        booking_reference: bookingReference,
// 		        status: 'confirmed'
// 		    },
// 		    transaction
// 	    );

// 	    const bookingId = Number(result.insertId);

// 	    if (!bookingId || isNaN(bookingId)) {
// 	      	throw new Error("Failed to generate a valid booking ID.");
// 	    }

// 	    console.log("result", result)
// 	    console.log("bookingId", bookingId)

// 	    // 6. Map Bulk Insert Data for Booking Seats
//         const bookingSeatsData = seats.map((seat, index) => {
//             const busSeat = busSeatMap.get(String(seat.seat_number));
//             if (!busSeat) {
//                 throw new Error(`Bus seat number ${seat.seat_number} could not be resolved.`);
//             }

//             const passenger = passengers[index] || {};

//             return {
//                 booking_id: bookingId,
//                 seat_id: busSeat.id,
//                 trip_id,
//                 passenger_name: passenger.name || passenger.passenger_name || null,   
//                 passenger_age: passenger.age || passenger.passenger_age || null,
//                 passenger_gender: passenger.gender || passenger.passenger_gender || null,
//                 schedule_seat_id: seat.schedule_seat_id || null,
//                 price: passenger.price || seat.price || trip.price || 0
//             };
//         });

// 	    console.log("bookingSeatsData", bookingSeatsData)

// 	    // Bulk insert all booking seats at once
// 	    await BookingSeatModel.createMany(bookingSeatsData, transaction);

// 	    // Commit Transaction
// 	    await transaction.commit();

// 	    return res.status(201).json({
// 	      	success: true,
// 	      	message: "Booking created successfully",
// 	      	data: {
// 	        	booking_id: bookingId,
// 	        	booking_reference: bookingReference
// 	      	}
// 	    }); 

// 	} catch (error) {
// 		console.error("Error creating booking:", error);
// 	    if (transaction) {
// 	      	try {
// 	        	await transaction.rollback();
// 	      	} catch (rollbackErr) {
// 	        	console.error("Rollback failed:", rollbackErr);
// 	      	}
// 	    }
// 	    return res.status(500).json({
// 	      	success: false,
// 	      	message: error.message || "An unexpected error occurred while creating the booking"
// 	    });
// 	} finally {
//     	if (transaction) transaction.release();
//   	}
// };

export const createBooking = async (req, res) => {
    let transaction;
    try {
        transaction = await pool.getConnection();
        await transaction.beginTransaction();

        const { 
            trip_id, 
            schedule_id, 
            user_id, 
            passenger_count, 
            discount_amount = 0, 
            emergency_contact_name, 
            emergency_contact_phone, 
            subtotal, 
            total_amount, 
            promo_code_id = null, 
            tax_amount = 0, 
            passengers = [], 
            seats = [] 
        } = req.body;

        console.log("req", req.body)

        // 1. Validate Trip Existence
        const rawTrip = await TripModel.getById(trip_id, transaction);
        const trip = Array.isArray(rawTrip) ? rawTrip[0] : rawTrip;

        console.log("trip", trip)
        
        if (!trip || !trip.bus_id) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Trip not found or invalid bus assignment"
            });
        }

        if (!seats || seats.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "No seats selected for booking"
            });
        }
        console.log("seats", seats)
        // 2. Validate Physical Bus Seats
        const seatNumbers = seats.map(s => String(s.seat_number));

        const busSeats = await ScheduleSeatModel.getBySeatNumbers(trip.bus_id, trip.id, seatNumbers, transaction);

        console.log("seatNumbers", seatNumbers)
        console.log("busSeats", busSeats)

        // if (!busSeats || busSeats.length !== seats.length) {
        //     await transaction.rollback();
        //     return res.status(400).json({
        //         success: false,
        //         message: "One or more selected seats do not exist for this bus"
        //     });
        // }


        // Map seat_number -> busSeat
        const busSeatMap = new Map(busSeats.map(bs => [String(bs.seat_number), bs]));

        // 3. Lock & Validate Schedule Seats Status
        const scheduleSeatIds = seats
            .map(s => s.schedule_seat_id)
            .filter(Boolean);

        if (scheduleSeatIds.length > 0) {
            const availableSeats = await ScheduleSeatModel.getBookedSeats(
                scheduleSeatIds,
                transaction
            );

            const seatsList = Array.isArray(availableSeats) ? availableSeats : [];
            console.log(seatsList)
            console.log(isAnySeatTaken)
            console.log(scheduleSeatIds)

            // Check if any seat is already booked or held by a different user
            const isAnySeatTaken = seatsList.some(s => {
                if (s.status === 'booked') return true;
                if (s.status === 'held' && Number(s.held_by_user_id) !== Number(user_id)) return true;
                return false;
            });

            if (isAnySeatTaken) {
                await transaction.rollback();
                return res.status(409).json({
                    success: false,
                    message: "One or more seats have already been booked or held by another user."
                });
            }

            // Update schedule seats to 'booked' status
            await ScheduleSeatModel.makeScheduleBooked(
                scheduleSeatIds,
                transaction
            );
        }

        // 4. Create Primary Booking Record
        const bookingReference = generateBookingReference();

        const result = await BookingModel.create(
            {
                trip_id,
                schedule_id,
                user_id,
                passenger_count,
                discount_amount,
                emergency_contact_name,
                emergency_contact_phone,
                subtotal,
                total_amount,
                promo_code_id,
                tax_amount,
                booking_reference: bookingReference,
                status: 'confirmed'
            },
            transaction
        );

        const bookingId = Number(result?.insertId || result?.id);

        if (!bookingId || isNaN(bookingId)) {
            throw new Error("Failed to generate a valid booking ID.");
        }

        // 5. Map & Bulk Insert Booking Seats
        const bookingSeatsData = seats.map((seat, index) => {
            const busSeat = busSeatMap.get(String(seat.seat_number));
            if (!busSeat) {
                throw new Error(`Bus seat number ${seat.seat_number} could not be resolved.`);
            }

            const passenger = passengers[index] || {};

            return {
                booking_id: bookingId,
                seat_id: busSeat.id,
                trip_id,
                passenger_name: passenger.name || passenger.passenger_name || null,   
                passenger_age: passenger.age || passenger.passenger_age || null,
                passenger_gender: passenger.gender || passenger.passenger_gender || null,
                schedule_seat_id: seat.schedule_seat_id || null,
                price: passenger.price || seat.price || trip.price || 0
            };
        });

        await BookingSeatModel.createMany(bookingSeatsData, transaction);

        // Commit Transaction
        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                booking_id: bookingId,
                booking_reference: bookingReference
            }
        }); 

    } catch (error) {
        console.error("Error creating booking:", error);
        if (transaction) {
            try {
                await transaction.rollback();
            } catch (rollbackErr) {
                console.error("Rollback failed:", rollbackErr);
            }
        }
        return res.status(500).json({
            success: false,
            message: error.message || "An unexpected error occurred while creating the booking"
        });
    } finally {
        if (transaction) transaction.release();
    }
};