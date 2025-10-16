import axios from 'axios';
import * as cheerio from 'cheerio';

class CodingProfileService {
  /**
   * Fetch LeetCode profile data using GraphQL API
   * @param {string} username - LeetCode username
   * @returns {Promise<Object>} - LeetCode profile data
   */
  async fetchLeetCodeData(username) {
    try {
      const query = `
        query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              reputation
              starRating
            }
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
        }
      `;

      const response = await axios.post('https://leetcode.com/graphql', {
        query,
        variables: { username }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        }
      });

      const data = response.data.data;
      
      if (!data || !data.matchedUser) {
        throw new Error('LeetCode user not found');
      }

      const user = data.matchedUser;
      const submissions = user.submitStats.acSubmissionNum;

      // Parse problems solved by difficulty
      const problemsSolved = {
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0
      };

      submissions.forEach(item => {
        if (item.difficulty === 'Easy') {
          problemsSolved.easy = item.count;
        } else if (item.difficulty === 'Medium') {
          problemsSolved.medium = item.count;
        } else if (item.difficulty === 'Hard') {
          problemsSolved.hard = item.count;
        } else if (item.difficulty === 'All') {
          problemsSolved.total = item.count;
        }
      });

      return {
        username: user.username,
        rank: user.profile.ranking || null,
        rating: user.profile.reputation || null,
        problemsSolved,
        lastUpdated: new Date(),
        verified: true
      };
    } catch (error) {
      console.error('❌ LeetCode fetch error:', error.message);
      
      if (error.response) {
        throw new Error(`LeetCode API error: ${error.response.status}`);
      } else if (error.message.includes('not found')) {
        throw new Error('LeetCode username not found');
      } else {
        throw new Error('Failed to fetch LeetCode data. Please try again later.');
      }
    }
  }

  /**
   * Fetch CodeChef profile data using unofficial API with scraping fallback
   * @param {string} username - CodeChef username
   * @returns {Promise<Object>} - CodeChef profile data
   */
  async fetchCodeChefData(username) {
    try {
      // Try unofficial API first
      try {
        const apiResponse = await axios.get(
          `https://codechef-api.vercel.app/handle/${username}`,
          { timeout: 10000 }
        );

        if (apiResponse.data && apiResponse.data.success) {
          return this.transformCodeChefApiData(apiResponse.data);
        }
      } catch (apiError) {
        console.log('⚠️ CodeChef API failed, trying scraping...');
      }

      // Fallback to scraping
      return await this.scrapeCodeChefData(username);
    } catch (error) {
      console.error('❌ CodeChef fetch error:', error.message);
      throw new Error('Failed to fetch CodeChef data. Please verify the username.');
    }
  }

  /**
   * Transform CodeChef API response to our format
   * @param {Object} data - Raw API response
   * @returns {Object} - Transformed data
   */
  transformCodeChefApiData(data) {
    return {
      username: data.username || data.handle,
      stars: this.calculateStars(data.currentRating || 0),
      rating: data.currentRating || null,
      highestRating: data.highestRating || null,
      globalRank: data.globalRank || null,
      countryRank: data.countryRank || null,
      lastUpdated: new Date(),
      verified: true
    };
  }

  /**
   * Scrape CodeChef profile page as fallback
   * @param {string} username - CodeChef username
   * @returns {Promise<Object>} - Scraped profile data
   */
  async scrapeCodeChefData(username) {
    try {
      const response = await axios.get(
        `https://www.codechef.com/users/${username}`,
        {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );

      const $ = cheerio.load(response.data);
      
      // Check if user exists
      if ($('.user-not-found').length > 0) {
        throw new Error('CodeChef username not found');
      }

      // Extract rating
      const ratingText = $('.rating-number').text().trim();
      const rating = parseInt(ratingText) || null;

      // Extract stars
      const stars = $('.rating-star').length || this.calculateStars(rating);

      // Extract highest rating
      const highestRatingText = $('.rating-header .small').text().trim();
      const highestRatingMatch = highestRatingText.match(/\(Highest Rating (\d+)/);
      const highestRating = highestRatingMatch ? parseInt(highestRatingMatch[1]) : rating;

      // Extract ranks (if available)
      const ranksText = $('.rating-ranks').text().trim();
      const globalRankMatch = ranksText.match(/Global Rank:\s*(\d+)/);
      const countryRankMatch = ranksText.match(/Country Rank:\s*(\d+)/);

      return {
        username: username,
        stars: stars,
        rating: rating,
        highestRating: highestRating,
        globalRank: globalRankMatch ? parseInt(globalRankMatch[1]) : null,
        countryRank: countryRankMatch ? parseInt(countryRankMatch[1]) : null,
        lastUpdated: new Date(),
        verified: true
      };
    } catch (error) {
      if (error.message.includes('not found')) {
        throw error;
      }
      console.error('❌ CodeChef scraping error:', error.message);
      throw new Error('Failed to scrape CodeChef data. Please try again later.');
    }
  }

  /**
   * Calculate CodeChef stars based on rating
   * @param {number} rating - Current rating
   * @returns {number} - Number of stars (0-7)
   */
  calculateStars(rating) {
    if (rating < 1400) return 0;
    if (rating < 1600) return 1;
    if (rating < 1800) return 2;
    if (rating < 2000) return 3;
    if (rating < 2200) return 4;
    if (rating < 2500) return 5;
    if (rating < 3000) return 6;
    return 7;
  }

  /**
   * Verify if a username exists on the platform
   * @param {string} platform - 'leetcode' or 'codechef'
   * @param {string} username - Username to verify
   * @returns {Promise<boolean>} - True if username exists
   */
  async verifyUsername(platform, username) {
    try {
      if (platform === 'leetcode') {
        await this.fetchLeetCodeData(username);
      } else if (platform === 'codechef') {
        await this.fetchCodeChefData(username);
      } else {
        throw new Error('Invalid platform');
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new CodingProfileService();
