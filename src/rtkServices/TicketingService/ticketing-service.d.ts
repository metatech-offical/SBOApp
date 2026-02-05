interface EventLocation {
  coordinates: {
    lat: number;
    lng: number;
  };
  zipCode: number;
  address: string;
}

interface EventItem {
  _id: string;
  creatorId: string;
  eventCoverImageUrl?: string;
  eventName: string;
  eventDateTime?: string;
  eventPublishOnDate?: string;
  eventDescription?: string;
  eventLocation?: EventLocation;
  eventCategory?: string;
  eventStatus?: string;
  eventArenaImageUrl?: string;
  eventCurrencyType?: string;
  eventLimitPerUser?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GetEventsRes {
  success: boolean;
  message: string;
  data: {
    events: EventItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface TicketItem {
  _id: string;
  eventId: string;
  ticketName: string;
  originalPrice: number;
  numberOfTickets: number;
  numberOfSoldTickets: number;
  ticketStatus: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface GetEventDetailRes {
  success: boolean;
  message: string;
  data: {
    events: EventItem[];
    tickets: TicketItem[];
  };
}


 interface GetCreatorEventsResponse {
  success: boolean;
  message: string;
  data: {
    events: EventItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface CreateTicketPayload {
  eventId: string;
  tickets: {
    eventTicketId: string;
    quantity: number;
  }[];
}

interface CreateTicketRes {
  success: boolean;
  message: string;
  data: {
    tickets: any[];
    [key: string]: any;
  };
}
