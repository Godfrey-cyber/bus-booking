export const BookingSeatModel = {
      createMany: async (bookingSeatsData, transaction) => {
            if (!bookingSeatsData || bookingSeatsData.length === 0) return;

        const executor = transaction || pool;

        try {
            const sql = `
                INSERT INTO booking_seats (
                  booking_id,
                  seat_id,
                  trip_id,
                  passenger_name,
                  passenger_age,
                  passenger_gender,
                  schedule_seat_id,
                  price
                ) VALUES ?
            `;

            const values = bookingSeatsData.map((item) => [
                item.booking_id,
                item.seat_id,
                item.trip_id,
                item.passenger_name,
                item.passenger_age,
                item.passenger_gender,
                item.schedule_seat_id,
                item.price
            ]);

            const [result] = await executor.batch(sql, [values]);
            return result;
        } catch (error) {
            console.error("Error in BookingSeatModel.createMany:", error);
            throw error;
        }
      }
};