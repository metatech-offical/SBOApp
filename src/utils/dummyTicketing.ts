const inDays = (days: number, hours = 19) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, 0, 0, 0);
  return date.toISOString();
};

const DUMMY_CREATOR = {
  _id: 'dummy-creator-1',
  username: 'wimhof',
  displayName: 'Wim Hof',
};

export const isDummyEventId = (id?: string) =>
  typeof id === 'string' && id.startsWith('dummy-');

const concertImages = [
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
  'https://images.unsplash.com/photo-1501281668745-f7f9d5265ec1?w=1200',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
];

const arenaImage =
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200';

export const DUMMY_LIVE_EVENTS: any[] = [
  {
    _id: 'dummy-live-1',
    creatorId: DUMMY_CREATOR,
    eventCoverImageUrl: concertImages[0],
    eventArenaImageUrl: arenaImage,
    startingPrice: 45,
    eventName: 'Ed Sheeran Live in Concert',
    eventDateTime: inDays(0, 20),
    eventPublishOnDate: inDays(0, 23),
    eventDescription: 'An intimate live night with hits from the latest album.',
    eventLocation: {
      coordinates: {lat: 40.758, lng: -73.9855},
      zipCode: 10036,
      address: 'Madison Square Garden, New York',
    },
    eventCategory: 'Concert',
    eventStatus: 'Live',
    eventCurrencyType: 'USD',
    eventLimitPerUser: 4,
  },
  {
    _id: 'dummy-live-2',
    creatorId: DUMMY_CREATOR,
    eventCoverImageUrl: concertImages[1],
    eventArenaImageUrl: arenaImage,
    startingPrice: 45,
    eventName: 'Coldplay — Music of the Spheres',
    eventDateTime: inDays(1, 19),
    eventPublishOnDate: inDays(1, 22),
    eventDescription: 'A stadium show with lights, color, and live anthems.',
    eventLocation: {
      coordinates: {lat: 34.043, lng: -118.267},
      zipCode: 90015,
      address: 'Crypto.com Arena, Los Angeles',
    },
    eventCategory: 'Concert',
    eventStatus: 'Live',
    eventCurrencyType: 'USD',
    eventLimitPerUser: 6,
  },
  {
    _id: 'dummy-live-3',
    creatorId: DUMMY_CREATOR,
    eventCoverImageUrl: concertImages[2],
    eventArenaImageUrl: arenaImage,
    startingPrice: 45,
    eventName: 'The Weeknd — After Hours Til Dawn',
    eventDateTime: inDays(2, 21),
    eventPublishOnDate: inDays(2, 23),
    eventDescription: 'Night visuals and a full live set.',
    eventLocation: {
      coordinates: {lat: 41.8806, lng: -87.6742},
      zipCode: 60612,
      address: 'United Center, Chicago',
    },
    eventCategory: 'Concert',
    eventStatus: 'Live',
    eventCurrencyType: 'USD',
    eventLimitPerUser: 4,
  },
  {
    _id: 'dummy-live-4',
    creatorId: DUMMY_CREATOR,
    eventCoverImageUrl: concertImages[3],
    eventArenaImageUrl: arenaImage,
    startingPrice: 45,
    eventName: 'Drake — It\'s All a Blur Tour',
    eventDateTime: inDays(3, 20),
    eventPublishOnDate: inDays(3, 23),
    eventDescription: 'Special guests and a late-night set.',
    eventLocation: {
      coordinates: {lat: 43.6435, lng: -79.3791},
      zipCode: 10065,
      address: 'Scotiabank Arena, Toronto',
    },
    eventCategory: 'Concert',
    eventStatus: 'Live',
    eventCurrencyType: 'USD',
    eventLimitPerUser: 4,
  },
];

export const DUMMY_UPCOMING_EVENTS: any[] = [
  {
    _id: 'dummy-soon-1',
    creatorId: DUMMY_CREATOR,
    eventCoverImageUrl: concertImages[1],
    eventArenaImageUrl: arenaImage,
    startingPrice: 45,
    eventName: 'Taylor Swift — The Eras Tour',
    eventDateTime: inDays(21, 19),
    eventPublishOnDate: inDays(21, 23),
    eventDescription: 'A career-spanning live show.',
    eventLocation: {
      coordinates: {lat: 33.7573, lng: -84.3963},
      zipCode: 30313,
      address: 'State Farm Arena, Atlanta',
    },
    eventCategory: 'Concert',
    eventStatus: 'Upcoming',
    eventCurrencyType: 'USD',
    eventLimitPerUser: 4,
  },
  {
    _id: 'dummy-soon-2',
    creatorId: DUMMY_CREATOR,
    eventCoverImageUrl: concertImages[2],
    eventArenaImageUrl: arenaImage,
    startingPrice: 45,
    eventName: 'Beyoncé — Renaissance World Tour',
    eventDateTime: inDays(28, 20),
    eventPublishOnDate: inDays(28, 23),
    eventDescription: 'A full production live experience.',
    eventLocation: {
      coordinates: {lat: 29.7508, lng: -95.3621},
      zipCode: 77002,
      address: 'Toyota Center, Houston',
    },
    eventCategory: 'Concert',
    eventStatus: 'Upcoming',
    eventCurrencyType: 'USD',
    eventLimitPerUser: 4,
  },
  {
    _id: 'dummy-soon-3',
    creatorId: DUMMY_CREATOR,
    eventCoverImageUrl: concertImages[0],
    eventArenaImageUrl: arenaImage,
    startingPrice: 45,
    eventName: 'Billie Eilish — Hit Me Hard and Soft',
    eventDateTime: inDays(35, 18),
    eventPublishOnDate: inDays(35, 21),
    eventDescription: 'An arena night with the new record.',
    eventLocation: {
      coordinates: {lat: 51.556, lng: -0.2796},
      zipCode: 10001,
      address: 'The O2, London',
    },
    eventCategory: 'Concert',
    eventStatus: 'Upcoming',
    eventCurrencyType: 'USD',
    eventLimitPerUser: 4,
  },
];

export const DUMMY_PAST_EVENTS: any[] = [
  {
    _id: 'dummy-past-1',
    creatorId: DUMMY_CREATOR,
    eventCoverImageUrl: concertImages[3],
    eventArenaImageUrl: arenaImage,
    startingPrice: 45,
    eventName: 'Arctic Monkeys — Live Archive',
    eventDateTime: inDays(-12, 20),
    eventPublishOnDate: inDays(-12, 23),
    eventDescription: 'A sold-out night from the last tour.',
    eventLocation: {
      coordinates: {lat: 40.7505, lng: -73.9934},
      zipCode: 10001,
      address: 'Madison Square Garden, New York',
    },
    eventCategory: 'Concert',
    eventStatus: 'Ended',
    eventCurrencyType: 'USD',
    eventLimitPerUser: 4,
    ticketSold: 184,
  },
  {
    _id: 'dummy-past-2',
    creatorId: DUMMY_CREATOR,
    eventCoverImageUrl: concertImages[0],
    eventArenaImageUrl: arenaImage,
    startingPrice: 38,
    eventName: 'The 1975 — Still At Their Very Best',
    eventDateTime: inDays(-21, 19),
    eventPublishOnDate: inDays(-21, 22),
    eventDescription: 'An arena show from earlier this season.',
    eventLocation: {
      coordinates: {lat: 51.5033, lng: -0.1195},
      zipCode: 10001,
      address: 'The O2, London',
    },
    eventCategory: 'Concert',
    eventStatus: 'Ended',
    eventCurrencyType: 'USD',
    eventLimitPerUser: 4,
    ticketSold: 210,
  },
  {
    _id: 'dummy-past-3',
    creatorId: DUMMY_CREATOR,
    eventCoverImageUrl: concertImages[2],
    eventArenaImageUrl: arenaImage,
    startingPrice: 42,
    eventName: 'Dua Lipa — Radical Optimism Tour',
    eventDateTime: inDays(-34, 21),
    eventPublishOnDate: inDays(-34, 23),
    eventDescription: 'Night two of the world tour.',
    eventLocation: {
      coordinates: {lat: 34.043, lng: -118.267},
      zipCode: 90015,
      address: 'Crypto.com Arena, Los Angeles',
    },
    eventCategory: 'Concert',
    eventStatus: 'Ended',
    eventCurrencyType: 'USD',
    eventLimitPerUser: 4,
    ticketSold: 156,
  },
];

export const DUMMY_BOOKING_HISTORY: BookingHistoryCardProps[] = [
  {
    date: 'Today',
    cards: [
      {
        id: 'dummy-booking-1',
        title: DUMMY_LIVE_EVENTS[0].eventName,
        ticketCount: '2',
        image: concertImages[0],
      },
      {
        id: 'dummy-booking-2',
        title: DUMMY_LIVE_EVENTS[1].eventName,
        ticketCount: '1',
        image: concertImages[1],
      },
    ],
  },
  {
    date: 'Last week',
    cards: [
      {
        id: 'dummy-booking-3',
        title: 'Arctic Monkeys — Live Archive',
        ticketCount: '4',
        image: concertImages[3],
      },
    ],
  },
];

const DUMMY_TICKETS: TicketItem[] = [
  {
    _id: 'dummy-ticket-ga',
    eventId: 'dummy-event',
    ticketName: 'General Admission',
    originalPrice: 45,
    numberOfTickets: 200,
    numberOfSoldTickets: 64,
    ticketStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'dummy-ticket-vip',
    eventId: 'dummy-event',
    ticketName: 'VIP',
    originalPrice: 120,
    numberOfTickets: 40,
    numberOfSoldTickets: 11,
    ticketStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'dummy-ticket-platinum',
    eventId: 'dummy-event',
    ticketName: 'Platinum',
    originalPrice: 220,
    numberOfTickets: 12,
    numberOfSoldTickets: 3,
    ticketStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const filterDummyEvents = (
  events: any[],
  {
    search,
    city,
    date,
  }: {
    search?: string;
    city?: string;
    date?: any;
  },
) => {
  const searchText = search?.trim().toLowerCase() || '';
  const cityText = city?.trim().toLowerCase() || '';

  return events.filter(event => {
    const name = event.eventName?.toLowerCase() || '';
    const address = event.eventLocation?.address?.toLowerCase() || '';

    if (searchText && !name.includes(searchText) && !address.includes(searchText)) {
      return false;
    }
    if (cityText && !address.includes(cityText)) {
      return false;
    }
    if (date) {
      const eventDay = new Date(event.eventDateTime).toDateString();
      const filterDay = new Date(date).toDateString();
      if (eventDay !== filterDay) {
        return false;
      }
    }
    return true;
  });
};

export const getDummyEventDetail = (event: any) => ({
  event,
  events: [event],
  tickets: DUMMY_TICKETS.map((ticket, index) => ({
    ...ticket,
    _id: `${ticket._id}-${event?._id || index}`,
    eventId: event?._id,
  })),
});
