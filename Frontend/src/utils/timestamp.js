const convertToDate = (timestamp) => {
  if (!timestamp) return null;

  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate(); // Firebase Timestamp
  } else if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
    return new Date(timestamp.seconds * 1000); // Serialized Firebase Timestamp
  } else if (timestamp instanceof Date) {
    return timestamp;
  } else if (typeof timestamp === 'number') {
    return new Date(timestamp); // Milliseconds
  } else if (typeof timestamp === 'string') {
    return new Date(timestamp); // ISO format
  }

  return null;
};

export const formatTimestamp = (timestamp, formatType = 'relative') => {
  const date = convertToDate(timestamp);
  if (!date) return '';

  switch (formatType) {
    case 'short':
      return date.toLocaleString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    case 'medium':
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    case 'long':
      return date.toLocaleString([], {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    case 'number':
      return date.getTime(); // Milliseconds since epoch

    case 'relative':
    default: {
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60)
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
      if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
      if (diffInDays < 7) return diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;

      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  }
};

export const formatRelativeGap = (timestamps) => {
  const validDates = timestamps
    .map(convertToDate)
    .filter(Boolean)
    .sort((a, b) => a.getTime() - b.getTime());

  const result = [];
  for (let i = 1; i < validDates.length; i++) {
    const prev = validDates[i - 1];
    const curr = validDates[i];
    const diffInMs = curr.getTime() - prev.getTime();

    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) result.push('Less than a minute apart');
    else if (minutes < 60) result.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'} apart`);
    else if (hours < 24) result.push(`${hours} ${hours === 1 ? 'hour' : 'hours'} apart`);
    else result.push(`${days} ${days === 1 ? 'day' : 'days'} apart`);
  }

  return result;
};