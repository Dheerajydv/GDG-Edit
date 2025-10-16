import cron from 'node-cron';
import User from '../models/User.js';
import codingProfileService from './codingProfileService.js';

class CronJobService {
  /**
   * Initialize all cron jobs
   */
  init() {
    console.log('⏰ Initializing cron jobs...');
    
    // Refresh all coding profiles daily at 3:00 AM
    this.scheduleDailyCodingProfileRefresh();
    
    console.log('✅ Cron jobs initialized successfully');
  }

  /**
   * Schedule daily refresh of all users' coding profiles
   * Runs at 3:00 AM every day
   */
  scheduleDailyCodingProfileRefresh() {
    // Run at 3:00 AM every day (0 3 * * *)
    cron.schedule('0 3 * * *', async () => {
      console.log('🔄 Starting daily coding profile refresh...');
      console.log(`⏰ Time: ${new Date().toISOString()}`);
      
      try {
        await this.refreshAllCodingProfiles();
        console.log('✅ Daily coding profile refresh completed successfully');
      } catch (error) {
        console.error('❌ Error during daily coding profile refresh:', error);
      }
    }, {
      timezone: "Asia/Kolkata" // Set to Indian timezone
    });

    console.log('✅ Daily coding profile refresh scheduled for 3:00 AM IST');
  }

  /**
   * Refresh coding profiles for all users
   * Can be called manually or by cron job
   */
  async refreshAllCodingProfiles() {
    try {
      // Find all users who have at least one coding profile
      const users = await User.find({
        $or: [
          { 'codingProfiles.leetcode.username': { $exists: true, $ne: null } },
          { 'codingProfiles.codechef.username': { $exists: true, $ne: null } }
        ]
      });

      console.log(`📊 Found ${users.length} users with coding profiles to refresh`);

      let successCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          // Refresh LeetCode profile if exists
          if (user.codingProfiles?.leetcode?.username) {
            try {
              console.log(`🔄 Refreshing LeetCode for user ${user._id}...`);
              const leetcodeData = await codingProfileService.fetchLeetCodeData(
                user.codingProfiles.leetcode.username
              );
              user.codingProfiles.leetcode = leetcodeData;
              successCount++;
            } catch (error) {
              console.error(`❌ Failed to refresh LeetCode for user ${user._id}:`, error.message);
              errorCount++;
            }
          }

          // Refresh CodeChef profile if exists
          if (user.codingProfiles?.codechef?.username) {
            try {
              console.log(`🔄 Refreshing CodeChef for user ${user._id}...`);
              const codechefData = await codingProfileService.fetchCodeChefData(
                user.codingProfiles.codechef.username
              );
              user.codingProfiles.codechef = codechefData;
              successCount++;
            } catch (error) {
              console.error(`❌ Failed to refresh CodeChef for user ${user._id}:`, error.message);
              errorCount++;
            }
          }

          // Save updated user data
          await user.save();
          
          // Add a small delay to avoid rate limiting
          await this.sleep(2000); // 2 second delay between users
        } catch (error) {
          console.error(`❌ Failed to update user ${user._id}:`, error.message);
          errorCount++;
        }
      }

      console.log(`📊 Refresh Summary:`);
      console.log(`   ✅ Successful: ${successCount}`);
      console.log(`   ❌ Failed: ${errorCount}`);
      console.log(`   👥 Total Users: ${users.length}`);

      return { successCount, errorCount, totalUsers: users.length };
    } catch (error) {
      console.error('❌ Error refreshing all coding profiles:', error);
      throw error;
    }
  }

  /**
   * Helper function to add delay
   * @param {number} ms - Milliseconds to sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Manual trigger for coding profile refresh (for testing)
   * @returns {Promise<Object>} - Refresh summary
   */
  async triggerManualRefresh() {
    console.log('🔄 Manual refresh triggered');
    return await this.refreshAllCodingProfiles();
  }
}

export default new CronJobService();
