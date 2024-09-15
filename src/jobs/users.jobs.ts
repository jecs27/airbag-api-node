import cron from 'node-cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import UserPG from '@database/sql/entities/users.entity';
import User from "@database/nosql/models/user.model";
import { getDataSourceRepository } from '@database/sql/connection';

dayjs.extend(utc);
dayjs.extend(timezone);

export const syncUsersJob = () => {
  const timezone = 'America/Mexico_City';
  cron.schedule('0 2 * * *', async () => {
    try {
      const postgresUserRepo = getDataSourceRepository(UserPG);

      // Get all MongoDB users modified since last sync
      const lastSyncTime = await getLastSyncTime();
      console.log('lastSyncTime', lastSyncTime);

      const modifiedMongoUsers = await User.find({
        updatedAt: { $gt: lastSyncTime }
      });
      console.log('modifiedMongoUsers', modifiedMongoUsers);

      for (const mongoUser of modifiedMongoUsers) {
        const postgresUserRepository = await postgresUserRepo;
        let postgresUser = await postgresUserRepository.findOne({ where: { uuid: mongoUser.uuid } });

        if (!postgresUser) {
          postgresUser = new UserPG();
          postgresUser.uuid = mongoUser.uuid;
        }
        postgresUser.name = mongoUser.name;
        postgresUser.email = mongoUser.email;
        postgresUser.phone = mongoUser.phone;
        postgresUser = await postgresUserRepository.save(postgresUser);
      }

      console.log(`Synced ${modifiedMongoUsers.length} users`);
    } catch (error) {
      console.error('Error syncing users:', error);
    }
  }, {
    scheduled: true,
    timezone: timezone
  });
};

async function getLastSyncTime(): Promise<Date> {
  return dayjs().subtract(24, 'hours').toDate();
}

