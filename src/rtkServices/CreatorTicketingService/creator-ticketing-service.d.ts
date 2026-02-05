interface Coordinates {
  lat: number;
  lng: number;
}

interface EventLocation {
  coordinates: Coordinates;
  zipCode: number;
  address: string;
}

interface Ticket {
  ticketName: string;
  originalPrice: number;
  numberOfTickets: number;
}

interface CreateEventPayload {
  eventCoverImageUrl: string;
  eventArenaImageUrl: string;
  eventName: string;
  eventDateTime: string;
  eventPublishOnDate: string;
  eventDescription: string;
  eventLocation: EventLocation;
  eventCategory: string;
  eventCurrencyType: string;
  tickets: Ticket[];
}

interface LiveEventsResponse {
  success: boolean;
  message: string;
  data: {
    events: LiveEvent[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface LiveEvent {
  _id: string;
  creatorId: {
    _id: string;
    email: string;
  };
  eventCoverImageUrl: string;
  eventName: string;
  eventDateTime: string;
  eventPublishOnDate: string;
  eventDescription: string;
  eventLocation: {
    coordinates: {
      lat: number;
      lng: number;
    };
    zipCode: number;
    address: string;
  };
  eventCategory: string;
  eventStatus: string;
  eventArenaImageUrl: string;
  eventCurrencyType: string;
  eventLimitPerUser: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  ticketSold: any;
}
