export const GENRES = [
  { id: 'all', label: 'All', emoji: '🎵' },
  { id: 'rock', label: 'Rock', emoji: '🎸' },
  { id: 'metal', label: 'Metal', emoji: '🤘' },
  { id: 'pop', label: 'Pop', emoji: '🎤' },
  { id: 'hip-hop', label: 'Hip-Hop', emoji: '🎧' },
  { id: 'electronic', label: 'Electronic', emoji: '🎛️' },
  { id: 'techno', label: 'Techno', emoji: '💿' },
  { id: 'indie', label: 'Indie', emoji: '🌙' },
  { id: 'jazz', label: 'Jazz', emoji: '🎷' },
  { id: 'r&b', label: 'R&B', emoji: '💜' },
  { id: 'classical', label: 'Classical', emoji: '🎻' },
  { id: 'folk', label: 'Folk', emoji: '🪕' },
  { id: 'country', label: 'Country', emoji: '🤠' },
  { id: 'latin', label: 'Latin', emoji: '💃' },
];

export const VENUE_TYPES = [
  { id: 'all', label: 'All Venues', emoji: '📍' },
  { id: 'arena', label: 'Arenas', emoji: '🏟️' },
  { id: 'club', label: 'Clubs', emoji: '🪩' },
  { id: 'pub', label: 'Pubs', emoji: '🍺' },
  { id: 'small', label: 'Small Venues', emoji: '🎪' },
  { id: 'festival', label: 'Festivals', emoji: '🎡' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌳' },
];

export const DATE_RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'this-week', label: 'This Week' },
  { id: 'this-weekend', label: 'Weekend' },
  { id: 'this-month', label: 'This Month' },
  { id: 'next-month', label: 'Next Month' },
];

export const PRICE_RANGES = [
  { id: 'free', label: 'Free', min: 0, max: 0 },
  { id: 'budget', label: 'Under $25', min: 0, max: 25 },
  { id: 'mid', label: '$25-$75', min: 25, max: 75 },
  { id: 'premium', label: '$75-$150', min: 75, max: 150 },
  { id: 'vip', label: '$150+', min: 150, max: 9999 },
];

export const DEFAULT_LOCATION = {
  city: 'London',
  latLong: '51.5074,-0.1278',
};

export function getDateRange(rangeId) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  
  let end = new Date(now);
  
  switch (rangeId) {
    case 'today':
      end.setHours(23, 59, 59, 999);
      break;
    case 'tomorrow':
      start.setDate(start.getDate() + 1);
      end.setDate(end.getDate() + 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'this-week':
      end.setDate(end.getDate() + (7 - end.getDay()));
      end.setHours(23, 59, 59, 999);
      break;
    case 'this-weekend':
      const dayOfWeek = start.getDay();
      const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 0;
      start.setDate(start.getDate() + daysUntilFriday);
      end.setDate(start.getDate() + 2);
      end.setHours(23, 59, 59, 999);
      break;
    case 'this-month':
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case 'next-month':
      start.setMonth(start.getMonth() + 1, 1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    default:
      end.setDate(end.getDate() + 30);
      end.setHours(23, 59, 59, 999);
  }
  
  return {
    startDateTime: start.toISOString().replace('.000', ''),
    endDateTime: end.toISOString().replace('.000', ''),
  };
}

export function classifyVenue(venue) {
  if (!venue) return 'small';
  const name = (venue.name || '').toLowerCase();
  const type = (venue.type || '').toLowerCase();
  const capacity = venue.capacity || venue.generalInfo?.generalRule?.length || 0;
  
  if (name.includes('festival') || name.includes('fest ') || type.includes('festival')) return 'festival';
  if (name.includes('outdoor') || name.includes('park') || name.includes('garden') || name.includes('amphitheatre')) return 'outdoor';
  if (name.includes('arena') || name.includes('stadium') || name.includes('center') || name.includes('centre') || capacity > 5000) return 'arena';
  if (name.includes('pub') || name.includes('bar') || name.includes('tavern') || name.includes('inn')) return 'pub';
  if (name.includes('club') || name.includes('lounge') || name.includes('nightclub')) return 'club';
  return 'small';
}

export function formatPrice(priceRanges) {
  if (!priceRanges || priceRanges.length === 0) return 'TBA';
  const range = priceRanges[0];
  if (range.min === 0 && range.max === 0) return 'Free';
  if (range.min === range.max) return `$${range.min}`;
  return `$${range.min} - $${range.max}`;
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}
