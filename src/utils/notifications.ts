import { CalendarEvent } from '../types';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported in this browser.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendLocalNotification(title: string, body: string, icon = '/icon.svg') {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon,
        dir: 'rtl',
      });
    } catch (e) {
      console.warn('Error displaying native notification:', e);
    }
  }
}

export function checkUpcomingReminders(events: CalendarEvent[]) {
  const now = new Date();
  const currentDateStr = now.toISOString().split('T')[0];
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeTotal = currentHours * 60 + currentMinutes;

  events.forEach((evt) => {
    if (evt.is_completed || evt.reminder === 'none' || !evt.start_time) return;
    if (evt.date !== currentDateStr) return;

    const [h, m] = evt.start_time.split(':').map(Number);
    const eventTimeTotal = h * 60 + m;
    const diffMinutes = eventTimeTotal - currentTimeTotal;

    let shouldTrigger = false;
    let reminderText = '';

    switch (evt.reminder) {
      case 'at_time':
        if (diffMinutes === 0) {
          shouldTrigger = true;
          reminderText = `حان موعد: ${evt.title}`;
        }
        break;
      case '5_min':
        if (diffMinutes === 5) {
          shouldTrigger = true;
          reminderText = `تذكير: باقي 5 دقائق على ${evt.title}`;
        }
        break;
      case '15_min':
        if (diffMinutes === 15) {
          shouldTrigger = true;
          reminderText = `تذكير: باقي 15 دقيقة على ${evt.title}`;
        }
        break;
      case '30_min':
        if (diffMinutes === 30) {
          shouldTrigger = true;
          reminderText = `تذكير: باقي 30 دقيقة على ${evt.title}`;
        }
        break;
      case '1_hour':
        if (diffMinutes === 60) {
          shouldTrigger = true;
          reminderText = `تذكير: باقي ساعة على ${evt.title}`;
        }
        break;
      default:
        break;
    }

    if (shouldTrigger) {
      sendLocalNotification('تنبيه عزم', reminderText);
    }
  });
}
