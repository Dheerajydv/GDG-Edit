// EventStatus can be 'upcoming' or 'past'
const EventStatus = {
  UPCOMING: 'upcoming',
  PAST: 'past',
};

// Event structure for documentation purposes
/**
 * @typedef {Object} Event
 * @property {string} id - Unique identifier for the event.
 * @property {string} title - Title of the event.
 * @property {string} description - Description of the event.
 * @property {string} date - Date of the event.
 * @property {string} time - Time of the event.
 * @property {string} location - Location of the event.
 * @property {string} image - URL of the event's image.
 * @property {string} status - Status of the event ('upcoming' or 'past').
 * @property {string[]} tags - List of tags related to the event.
 * @property {number} attendees - Number of attendees.
 * @property {Object[]} [speakers] - Optional list of speakers.
 * @property {string} speakers[].name - Name of the speaker.
 * @property {string} speakers[].avatar - Avatar image URL of the speaker.
 * @property {string} speakers[].title - Title/role of the speaker.
 */
