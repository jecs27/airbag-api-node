import cron from 'node-cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import VehiclePG from '@database/sql/entities/vehicles.entity';
import Vehicle from "@database/nosql/models/vehicle.model";
import { getDataSourceRepository } from '@database/sql/connection';

dayjs.extend(utc);
dayjs.extend(timezone);

export const syncVehiclesJob = () => {
  const timezone = 'America/Mexico_City';
  cron.schedule('0 3 * * *', async () => {
    try {
      const postgresVehicleRepo = getDataSourceRepository(VehiclePG);

      // Get all MongoDB vehicles modified since last sync
      const lastSyncTime = await getLastSyncTime();
      console.log('lastSyncTime', lastSyncTime);

      const modifiedMongoVehicles = await Vehicle.find({
        updatedAt: { $gt: lastSyncTime }
      });
      console.log('modifiedMongoVehicles', modifiedMongoVehicles);

      for (const mongoVehicle of modifiedMongoVehicles) {
        const postgresVehicleRepository = await postgresVehicleRepo;
        let postgresVehicle = await postgresVehicleRepository.findOne({ where: { uuid: mongoVehicle.uuid } });

        if (!postgresVehicle) {
          postgresVehicle = new VehiclePG();
          postgresVehicle.uuid = mongoVehicle.uuid;
        }
        postgresVehicle.licensePlate = mongoVehicle.licensePlate;
        postgresVehicle.vin = mongoVehicle.vin;
        postgresVehicle.make = mongoVehicle.make;
        postgresVehicle.vehicleType = mongoVehicle.vehicleType;
        postgresVehicle.userUuid = mongoVehicle.userUuid;
        postgresVehicle = await postgresVehicleRepository.save(postgresVehicle);
      }

      console.log(`Synced ${modifiedMongoVehicles.length} vehicles`);
    } catch (error) {
      console.error('Error syncing vehicles:', error);
    }
  }, {
    scheduled: true,
    timezone: timezone
  });
};

async function getLastSyncTime(): Promise<Date> {
  return dayjs().subtract(24, 'hours').toDate();
}
