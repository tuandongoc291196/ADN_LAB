import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AddBookingItemData {
  bookingItem_insert: BookingItem_Key;
}

export interface AddBookingItemVariables {
  id: string;
  bookingId: string;
  serviceId: string;
  price: number;
  quantity: number;
  notes?: string | null;
}

export interface AssignBookingStaffData {
  booking_update?: Booking_Key | null;
}

export interface AssignBookingStaffVariables {
  bookingId: string;
  staffId: string;
}

export interface Blog_Key {
  id: string;
  __typename?: 'Blog_Key';
}

export interface BookingItem_Key {
  id: string;
  __typename?: 'BookingItem_Key';
}

export interface Booking_Key {
  id: string;
  __typename?: 'Booking_Key';
}

export interface CreateBlogData {
  blog_insert: Blog_Key;
}

export interface CreateBlogVariables {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string | null;
}

export interface CreateBookingData {
  booking_insert: Booking_Key;
}

export interface CreateBookingVariables {
  id: string;
  userId: string;
  staffId?: string | null;
  kitId?: string | null;
  timeSlotId?: string | null;
  collectionMethod: string;
  notes?: string | null;
  totalAmount: number;
}

export interface CreateDnaServiceData {
  dnaService_insert: DnaService_Key;
}

export interface CreateDnaServiceVariables {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;
  sampleType: string;
  atHomeAvailable: boolean;
  kitCost: number;
}

export interface CreateFeedbackData {
  feedback_insert: Feedback_Key;
}

export interface CreateFeedbackVariables {
  id: string;
  bookingId: string;
  rating: number;
  comment?: string | null;
}

export interface CreateKitData {
  kit_insert: Kit_Key;
}

export interface CreateKitVariables {
  id: string;
  amount: number;
}

export interface CreateNotificationData {
  notification_insert: Notification_Key;
}

export interface CreateNotificationVariables {
  id: string;
  userId?: string | null;
  staffId?: string | null;
  title: string;
  message: string;
  type: string;
}

export interface CreateOrUpdateUserData {
  user_upsert: User_Key;
}

export interface CreateOrUpdateUserVariables {
  fullname: string;
  gender?: string | null;
  avatar?: string | null;
  email: string;
  phone?: string | null;
  shippingAddress?: string | null;
  roleId?: string | null;
  authProvider: string;
}

export interface CreatePaymentData {
  payment_insert: Payment_Key;
}

export interface CreatePaymentVariables {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string | null;
  paymentDate: DateString;
}

export interface CreateRoleData {
  role_insert: Role_Key;
}

export interface CreateRoleVariables {
  id: string;
  name: string;
  description?: string | null;
}

export interface CreateSampleData {
  sample_insert: Sample_Key;
}

export interface CreateSampleVariables {
  id: string;
  bookingId: string;
  serviceId: string;
  staffId?: string | null;
  collectionDate?: DateString | null;
  notes?: string | null;
}

export interface CreateTestResultData {
  testResult_insert: TestResult_Key;
}

export interface CreateTestResultVariables {
  id: string;
  bookingId: string;
  sampleId: string;
  serviceId: string;
  staffId?: string | null;
  testDate?: DateString | null;
  resultData?: string | null;
  notes?: string | null;
}

export interface CreateTimeSlotData {
  timeSlot_insert: TimeSlot_Key;
}

export interface CreateTimeSlotVariables {
  id: string;
  slotDate: DateString;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  staffId?: string | null;
  notes?: string | null;
}

export interface DeleteBlogData {
  blog_delete?: Blog_Key | null;
}

export interface DeleteBlogVariables {
  blogId: string;
}

export interface DeleteNotificationData {
  notification_delete?: Notification_Key | null;
}

export interface DeleteNotificationVariables {
  notificationId: string;
}

export interface DeleteRoleData {
  role_delete?: Role_Key | null;
}

export interface DeleteRoleVariables {
  roleId: string;
}

export interface DnaService_Key {
  id: string;
  __typename?: 'DnaService_Key';
}

export interface Feedback_Key {
  id: string;
  __typename?: 'Feedback_Key';
}

export interface GetAllFeedbackData {
  feedbacks: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
    };
      rating: number;
      comment?: string | null;
      createdAt: TimestampString;
  } & Feedback_Key)[];
}

export interface GetAllFeedbackVariables {
  limit?: number | null;
  offset?: number | null;
}

export interface GetAtHomeServicesData {
  dnaServices: ({
    id: string;
    name: string;
    description?: string | null;
    price: number;
    durationDays: number;
    sampleType: string;
    kitCost: number;
  } & DnaService_Key)[];
}

export interface GetAvailableKitsData {
  kits: ({
    id: string;
    amount: number;
    createdAt: TimestampString;
  } & Kit_Key)[];
}

export interface GetAvailableTimeSlotsData {
  timeSlots: ({
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    currentBookings: number;
    staff?: {
      id: string;
      fullname: string;
    } & User_Key;
      notes?: string | null;
  } & TimeSlot_Key)[];
}

export interface GetAvailableTimeSlotsVariables {
  slotDate: DateString;
}

export interface GetBlogByIdData {
  blog?: {
    id: string;
    user: {
      id: string;
      fullname: string;
      avatar?: string | null;
      role: {
        name: string;
      };
    } & User_Key;
      content: string;
      imageUrl?: string | null;
      createdAt: TimestampString;
  } & Blog_Key;
}

export interface GetBlogByIdVariables {
  blogId: string;
}

export interface GetBlogsByUserData {
  blogs: ({
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
  } & Blog_Key)[];
}

export interface GetBlogsByUserVariables {
  userId: string;
}

export interface GetBlogsData {
  blogs: ({
    id: string;
    user: {
      id: string;
      fullname: string;
      avatar?: string | null;
    } & User_Key;
      content: string;
      imageUrl?: string | null;
      createdAt: TimestampString;
  } & Blog_Key)[];
}

export interface GetBlogsVariables {
  limit?: number | null;
  offset?: number | null;
}

export interface GetBookingByIdData {
  booking?: {
    id: string;
    user: {
      id: string;
      fullname: string;
      email: string;
      phone?: string | null;
      shippingAddress?: string | null;
    } & User_Key;
      staff?: {
        id: string;
        fullname: string;
      } & User_Key;
        kit?: {
          id: string;
          status: string;
          amount: number;
        } & Kit_Key;
          timeSlot?: {
            slotDate: DateString;
            startTime: string;
            endTime: string;
            staff?: {
              fullname: string;
            };
          };
            status: string;
            collectionMethod: string;
            notes?: string | null;
            totalAmount: number;
            createdAt: TimestampString;
            updatedAt?: TimestampString | null;
  } & Booking_Key;
}

export interface GetBookingByIdVariables {
  bookingId: string;
}

export interface GetBookingFeedbackData {
  feedbacks: ({
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: TimestampString;
  } & Feedback_Key)[];
}

export interface GetBookingFeedbackVariables {
  bookingId: string;
}

export interface GetBookingItemByIdData {
  bookingItem?: {
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
      };
    } & Booking_Key;
      service: {
        id: string;
        name: string;
        price: number;
      } & DnaService_Key;
        price: number;
        quantity: number;
        notes?: string | null;
  } & BookingItem_Key;
}

export interface GetBookingItemByIdVariables {
  itemId: string;
}

export interface GetBookingItemsData {
  bookingItems: ({
    id: string;
    service: {
      id: string;
      name: string;
      description?: string | null;
      price: number;
      durationDays: number;
      sampleType: string;
    } & DnaService_Key;
      price: number;
      quantity: number;
      notes?: string | null;
  } & BookingItem_Key)[];
}

export interface GetBookingItemsVariables {
  bookingId: string;
}

export interface GetBookingPaymentData {
  payments: ({
    id: string;
    amount: number;
    paymentMethod: string;
    transactionId?: string | null;
    status: string;
    paymentDate?: DateString | null;
    refundDetail?: string | null;
  } & Payment_Key)[];
}

export interface GetBookingPaymentVariables {
  bookingId: string;
}

export interface GetBookingSamplesData {
  samples: ({
    id: string;
    service: {
      name: string;
      sampleType: string;
    };
      staff?: {
        fullname: string;
      };
        collectionDate?: DateString | null;
        status: string;
        notes?: string | null;
  } & Sample_Key)[];
}

export interface GetBookingSamplesVariables {
  bookingId: string;
}

export interface GetBookingStatsData {
  bookings: ({
    id: string;
    status: string;
    totalAmount: number;
    createdAt: TimestampString;
  } & Booking_Key)[];
}

export interface GetBookingTestResultsData {
  testResults: ({
    id: string;
    sample: {
      id: string;
    } & Sample_Key;
      service: {
        name: string;
      };
        staff?: {
          fullname: string;
        };
          verifier?: {
            fullname: string;
          };
            testDate?: DateString | null;
            reportDate?: DateString | null;
            status: string;
            reportUrl?: string | null;
            notes?: string | null;
  } & TestResult_Key)[];
}

export interface GetBookingTestResultsVariables {
  bookingId: string;
}

export interface GetBookingsByStatusData {
  bookings: ({
    id: string;
    user: {
      fullname: string;
      email: string;
    };
      status: string;
      collectionMethod: string;
      totalAmount: number;
      timeSlot?: {
        slotDate: DateString;
        startTime: string;
      };
        staff?: {
          fullname: string;
        };
          createdAt: TimestampString;
  } & Booking_Key)[];
}

export interface GetBookingsByStatusVariables {
  status: string;
}

export interface GetDnaServiceByIdData {
  dnaService?: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    durationDays: number;
    sampleType: string;
    atHomeAvailable: boolean;
    active: boolean;
    kitCost: number;
    createdAt: TimestampString;
  } & DnaService_Key;
}

export interface GetDnaServiceByIdVariables {
  serviceId: string;
}

export interface GetDnaServicesBySampleTypeData {
  dnaServices: ({
    id: string;
    name: string;
    description?: string | null;
    price: number;
    durationDays: number;
    atHomeAvailable: boolean;
    kitCost: number;
  } & DnaService_Key)[];
}

export interface GetDnaServicesBySampleTypeVariables {
  sampleType: string;
}

export interface GetDnaServicesData {
  dnaServices: ({
    id: string;
    name: string;
    description?: string | null;
    price: number;
    durationDays: number;
    sampleType: string;
    atHomeAvailable: boolean;
    kitCost: number;
    createdAt: TimestampString;
  } & DnaService_Key)[];
}

export interface GetFeedbackByRatingData {
  feedbacks: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
    };
      rating: number;
      comment?: string | null;
      createdAt: TimestampString;
  } & Feedback_Key)[];
}

export interface GetFeedbackByRatingVariables {
  rating: number;
}

export interface GetKitByIdData {
  kit?: {
    id: string;
    status: string;
    amount: number;
    createdAt: TimestampString;
  } & Kit_Key;
}

export interface GetKitByIdVariables {
  kitId: string;
}

export interface GetKitsData {
  kits: ({
    id: string;
    status: string;
    amount: number;
    createdAt: TimestampString;
  } & Kit_Key)[];
}

export interface GetMonthlyRevenueData {
  payments: ({
    amount: number;
    paymentDate?: DateString | null;
  })[];
}

export interface GetMonthlyRevenueVariables {
  year: number;
  month: number;
  startDate: DateString;
  endDate: DateString;
}

export interface GetMyBlogsData {
  blogs: ({
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
  } & Blog_Key)[];
}

export interface GetMyBookingsData {
  bookings: ({
    id: string;
    status: string;
    collectionMethod: string;
    totalAmount: number;
    notes?: string | null;
    timeSlot?: {
      slotDate: DateString;
      startTime: string;
      endTime: string;
    };
      staff?: {
        fullname: string;
      };
        kit?: {
          id: string;
          status: string;
        } & Kit_Key;
          createdAt: TimestampString;
          updatedAt?: TimestampString | null;
  } & Booking_Key)[];
}

export interface GetMyNotificationsData {
  notifications: ({
    id: string;
    staff?: {
      fullname: string;
    };
      title: string;
      message: string;
      isRead: boolean;
      type: string;
      createdAt: TimestampString;
  } & Notification_Key)[];
}

export interface GetNotificationByIdData {
  notification?: {
    id: string;
    user?: {
      fullname: string;
    };
      staff?: {
        fullname: string;
      };
        title: string;
        message: string;
        isRead: boolean;
        type: string;
        createdAt: TimestampString;
  } & Notification_Key;
}

export interface GetNotificationByIdVariables {
  notificationId: string;
}

export interface GetPaymentByIdData {
  payment?: {
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
        email: string;
      };
        totalAmount: number;
    } & Booking_Key;
      amount: number;
      paymentMethod: string;
      transactionId?: string | null;
      status: string;
      paymentDate?: DateString | null;
      refundDetail?: string | null;
  } & Payment_Key;
}

export interface GetPaymentByIdVariables {
  paymentId: string;
}

export interface GetPaymentsByStatusData {
  payments: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
    };
      amount: number;
      paymentMethod: string;
      transactionId?: string | null;
      paymentDate?: DateString | null;
  } & Payment_Key)[];
}

export interface GetPaymentsByStatusVariables {
  status: string;
}

export interface GetRoleByIdData {
  role?: {
    id: string;
    name: string;
    description?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Role_Key;
}

export interface GetRoleByIdVariables {
  roleId: string;
}

export interface GetRoleByNameData {
  roles: ({
    id: string;
    name: string;
    description?: string | null;
  } & Role_Key)[];
}

export interface GetRoleByNameVariables {
  roleName: string;
}

export interface GetRolesData {
  roles: ({
    id: string;
    name: string;
    description?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Role_Key)[];
}

export interface GetSampleByIdData {
  sample?: {
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
        email: string;
      };
    } & Booking_Key;
      service: {
        name: string;
        sampleType: string;
        description?: string | null;
      };
        staff?: {
          fullname: string;
        };
          collectionDate?: DateString | null;
          status: string;
          notes?: string | null;
  } & Sample_Key;
}

export interface GetSampleByIdVariables {
  sampleId: string;
}

export interface GetSamplesByStatusData {
  samples: ({
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
      };
    } & Booking_Key;
      service: {
        name: string;
        sampleType: string;
      };
        staff?: {
          fullname: string;
        };
          collectionDate?: DateString | null;
          status: string;
          notes?: string | null;
  } & Sample_Key)[];
}

export interface GetSamplesByStatusVariables {
  status: string;
}

export interface GetServicePopularityData {
  bookingItems: ({
    service: {
      id: string;
      name: string;
    } & DnaService_Key;
      quantity: number;
  })[];
}

export interface GetStaffBookingsData {
  bookings: ({
    id: string;
    user: {
      fullname: string;
      email: string;
      phone?: string | null;
    };
      status: string;
      collectionMethod: string;
      totalAmount: number;
      timeSlot?: {
        slotDate: DateString;
        startTime: string;
        endTime: string;
      };
        notes?: string | null;
        createdAt: TimestampString;
  } & Booking_Key)[];
}

export interface GetStaffBookingsVariables {
  staffId: string;
}

export interface GetStaffMembersData {
  users: ({
    id: string;
    fullname: string;
    email: string;
    role: {
      name: string;
    };
      accountStatus: string;
  } & User_Key)[];
}

export interface GetStaffSamplesData {
  samples: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
    };
      service: {
        name: string;
        sampleType: string;
      };
        collectionDate?: DateString | null;
        status: string;
        notes?: string | null;
  } & Sample_Key)[];
}

export interface GetStaffSamplesVariables {
  staffId: string;
}

export interface GetTestResultByIdData {
  testResult?: {
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
        email: string;
      };
    } & Booking_Key;
      sample: {
        id: string;
        collectionDate?: DateString | null;
      } & Sample_Key;
        service: {
          name: string;
          description?: string | null;
        };
          staff?: {
            fullname: string;
          };
            verifier?: {
              fullname: string;
            };
              testDate?: DateString | null;
              reportDate?: DateString | null;
              resultData?: string | null;
              status: string;
              reportUrl?: string | null;
              notes?: string | null;
  } & TestResult_Key;
}

export interface GetTestResultByIdVariables {
  resultId: string;
}

export interface GetTestResultsByStatusData {
  testResults: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
    };
      service: {
        name: string;
      };
        staff?: {
          fullname: string;
        };
          testDate?: DateString | null;
          status: string;
  } & TestResult_Key)[];
}

export interface GetTestResultsByStatusVariables {
  status: string;
}

export interface GetTimeSlotByIdData {
  timeSlot?: {
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    currentBookings: number;
    available: boolean;
    staff?: {
      id: string;
      fullname: string;
    } & User_Key;
      notes?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & TimeSlot_Key;
}

export interface GetTimeSlotByIdVariables {
  timeSlotId: string;
}

export interface GetTimeSlotsByStaffData {
  timeSlots: ({
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    currentBookings: number;
    available: boolean;
    notes?: string | null;
  } & TimeSlot_Key)[];
}

export interface GetTimeSlotsByStaffVariables {
  staffId: string;
}

export interface GetTimeSlotsInRangeData {
  timeSlots: ({
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    currentBookings: number;
    available: boolean;
    staff?: {
      fullname: string;
    };
  } & TimeSlot_Key)[];
}

export interface GetTimeSlotsInRangeVariables {
  startDate: DateString;
  endDate: DateString;
}

export interface GetUnreadNotificationsCountData {
  notifications: ({
    id: string;
  } & Notification_Key)[];
}

export interface GetUnreadNotificationsCountVariables {
  userId: string;
}

export interface GetUserBookingsData {
  bookings: ({
    id: string;
    status: string;
    collectionMethod: string;
    totalAmount: number;
    timeSlot?: {
      slotDate: DateString;
      startTime: string;
      endTime: string;
    };
      staff?: {
        fullname: string;
      };
        kit?: {
          id: string;
          status: string;
        } & Kit_Key;
          createdAt: TimestampString;
          updatedAt?: TimestampString | null;
  } & Booking_Key)[];
}

export interface GetUserBookingsVariables {
  userId: string;
}

export interface GetUserByIdData {
  user?: {
    id: string;
    fullname: string;
    gender?: string | null;
    avatar?: string | null;
    email: string;
    accountStatus: string;
    authProvider: string;
    phone?: string | null;
    shippingAddress?: string | null;
    roleId: string;
    role: {
      id: string;
      name: string;
      description?: string | null;
    } & Role_Key;
      dailySlotCount: number;
      maxDailySlots: number;
      createdAt: TimestampString;
      lastLogin?: TimestampString | null;
  } & User_Key;
}

export interface GetUserByIdVariables {
  userId: string;
}

export interface GetUserData {
  user?: {
    id: string;
    fullname: string;
    gender?: string | null;
    avatar?: string | null;
    email: string;
    accountStatus: string;
    authProvider: string;
    phone?: string | null;
    shippingAddress?: string | null;
    roleId: string;
    role: {
      id: string;
      name: string;
      description?: string | null;
    } & Role_Key;
      dailySlotCount: number;
      maxDailySlots: number;
      createdAt: TimestampString;
      lastLogin?: TimestampString | null;
  } & User_Key;
}

export interface GetUserNotificationsData {
  notifications: ({
    id: string;
    staff?: {
      fullname: string;
    };
      title: string;
      message: string;
      isRead: boolean;
      type: string;
      createdAt: TimestampString;
  } & Notification_Key)[];
}

export interface GetUserNotificationsVariables {
  userId: string;
}

export interface GetUserPaymentsData {
  payments: ({
    id: string;
    amount: number;
    paymentMethod: string;
    status: string;
    paymentDate?: DateString | null;
  } & Payment_Key)[];
}

export interface GetUserPaymentsVariables {
  userId: string;
}

export interface GetUserTestResultsData {
  testResults: ({
    id: string;
    service: {
      name: string;
    };
      testDate?: DateString | null;
      reportDate?: DateString | null;
      status: string;
      reportUrl?: string | null;
  } & TestResult_Key)[];
}

export interface GetUserTestResultsVariables {
  userId: string;
}

export interface GetUsersByRoleData {
  users: ({
    id: string;
    fullname: string;
    email: string;
    accountStatus: string;
    role: {
      name: string;
    };
      createdAt: TimestampString;
  } & User_Key)[];
}

export interface GetUsersByRoleVariables {
  roleId: string;
}

export interface GetUsersData {
  users: ({
    id: string;
    fullname: string;
    email: string;
    accountStatus: string;
    role: {
      id: string;
      name: string;
    } & Role_Key;
      createdAt: TimestampString;
      lastLogin?: TimestampString | null;
  } & User_Key)[];
}

export interface GetUsersVariables {
  limit?: number | null;
  offset?: number | null;
}

export interface Kit_Key {
  id: string;
  __typename?: 'Kit_Key';
}

export interface MarkAllNotificationsReadData {
  notification_updateMany: number;
}

export interface MarkAllNotificationsReadVariables {
  userId: string;
}

export interface MarkNotificationReadData {
  notification_update?: Notification_Key | null;
}

export interface MarkNotificationReadVariables {
  notificationId: string;
}

export interface Notification_Key {
  id: string;
  __typename?: 'Notification_Key';
}

export interface Payment_Key {
  id: string;
  __typename?: 'Payment_Key';
}

export interface RemoveBookingItemData {
  bookingItem_delete?: BookingItem_Key | null;
}

export interface RemoveBookingItemVariables {
  itemId: string;
}

export interface Role_Key {
  id: string;
  __typename?: 'Role_Key';
}

export interface Sample_Key {
  id: string;
  __typename?: 'Sample_Key';
}

export interface TestResult_Key {
  id: string;
  __typename?: 'TestResult_Key';
}

export interface TimeSlot_Key {
  id: string;
  __typename?: 'TimeSlot_Key';
}

export interface UpdateBlogData {
  blog_update?: Blog_Key | null;
}

export interface UpdateBlogVariables {
  blogId: string;
  content?: string | null;
  imageUrl?: string | null;
}

export interface UpdateBookingItemData {
  bookingItem_update?: BookingItem_Key | null;
}

export interface UpdateBookingItemVariables {
  itemId: string;
  price?: number | null;
  quantity?: number | null;
  notes?: string | null;
}

export interface UpdateBookingStatusData {
  booking_update?: Booking_Key | null;
}

export interface UpdateBookingStatusVariables {
  bookingId: string;
  status: string;
  staffId?: string | null;
}

export interface UpdateDnaServiceData {
  dnaService_update?: DnaService_Key | null;
}

export interface UpdateDnaServiceVariables {
  serviceId: string;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  durationDays?: number | null;
  sampleType?: string | null;
  atHomeAvailable?: boolean | null;
  kitCost?: number | null;
  active?: boolean | null;
}

export interface UpdateFeedbackData {
  feedback_update?: Feedback_Key | null;
}

export interface UpdateFeedbackVariables {
  feedbackId: string;
  rating?: number | null;
  comment?: string | null;
}

export interface UpdateKitStatusData {
  kit_update?: Kit_Key | null;
}

export interface UpdateKitStatusVariables {
  kitId: string;
  status: string;
}

export interface UpdatePaymentStatusData {
  payment_update?: Payment_Key | null;
}

export interface UpdatePaymentStatusVariables {
  paymentId: string;
  status: string;
  transactionId?: string | null;
  refundDetail?: string | null;
}

export interface UpdateRoleData {
  role_update?: Role_Key | null;
}

export interface UpdateRoleVariables {
  roleId: string;
  name?: string | null;
  description?: string | null;
}

export interface UpdateSampleStatusData {
  sample_update?: Sample_Key | null;
}

export interface UpdateSampleStatusVariables {
  sampleId: string;
  status: string;
  staffId?: string | null;
  collectionDate?: DateString | null;
  notes?: string | null;
}

export interface UpdateTestResultData {
  testResult_update?: TestResult_Key | null;
}

export interface UpdateTestResultVariables {
  resultId: string;
  resultData?: string | null;
  status?: string | null;
  reportDate?: DateString | null;
  reportUrl?: string | null;
  notes?: string | null;
}

export interface UpdateTimeSlotBookingsData {
  timeSlot_update?: TimeSlot_Key | null;
}

export interface UpdateTimeSlotBookingsVariables {
  timeSlotId: string;
  currentBookings: number;
}

export interface UpdateTimeSlotData {
  timeSlot_update?: TimeSlot_Key | null;
}

export interface UpdateTimeSlotVariables {
  timeSlotId: string;
  slotDate?: DateString | null;
  startTime?: string | null;
  endTime?: string | null;
  maxCapacity?: number | null;
  staffId?: string | null;
  notes?: string | null;
  available?: boolean | null;
}

export interface UpdateUserAccountStatusData {
  user_update?: User_Key | null;
}

export interface UpdateUserAccountStatusVariables {
  userId: string;
  accountStatus: string;
}

export interface UpdateUserProfileData {
  user_update?: User_Key | null;
}

export interface UpdateUserProfileVariables {
  fullname?: string | null;
  gender?: string | null;
  avatar?: string | null;
  phone?: string | null;
  shippingAddress?: string | null;
}

export interface UpdateUserRoleData {
  user_update?: User_Key | null;
}

export interface UpdateUserRoleVariables {
  userId: string;
  roleId: string;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface VerifyTestResultData {
  testResult_update?: TestResult_Key | null;
}

export interface VerifyTestResultVariables {
  resultId: string;
  verifiedBy: string;
}

interface CreateRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRoleVariables): MutationRef<CreateRoleData, CreateRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateRoleVariables): MutationRef<CreateRoleData, CreateRoleVariables>;
  operationName: string;
}
export const createRoleRef: CreateRoleRef;

export function createRole(vars: CreateRoleVariables): MutationPromise<CreateRoleData, CreateRoleVariables>;
export function createRole(dc: DataConnect, vars: CreateRoleVariables): MutationPromise<CreateRoleData, CreateRoleVariables>;

interface UpdateRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRoleVariables): MutationRef<UpdateRoleData, UpdateRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateRoleVariables): MutationRef<UpdateRoleData, UpdateRoleVariables>;
  operationName: string;
}
export const updateRoleRef: UpdateRoleRef;

export function updateRole(vars: UpdateRoleVariables): MutationPromise<UpdateRoleData, UpdateRoleVariables>;
export function updateRole(dc: DataConnect, vars: UpdateRoleVariables): MutationPromise<UpdateRoleData, UpdateRoleVariables>;

interface DeleteRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteRoleVariables): MutationRef<DeleteRoleData, DeleteRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteRoleVariables): MutationRef<DeleteRoleData, DeleteRoleVariables>;
  operationName: string;
}
export const deleteRoleRef: DeleteRoleRef;

export function deleteRole(vars: DeleteRoleVariables): MutationPromise<DeleteRoleData, DeleteRoleVariables>;
export function deleteRole(dc: DataConnect, vars: DeleteRoleVariables): MutationPromise<DeleteRoleData, DeleteRoleVariables>;

interface CreateOrUpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrUpdateUserVariables): MutationRef<CreateOrUpdateUserData, CreateOrUpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrUpdateUserVariables): MutationRef<CreateOrUpdateUserData, CreateOrUpdateUserVariables>;
  operationName: string;
}
export const createOrUpdateUserRef: CreateOrUpdateUserRef;

export function createOrUpdateUser(vars: CreateOrUpdateUserVariables): MutationPromise<CreateOrUpdateUserData, CreateOrUpdateUserVariables>;
export function createOrUpdateUser(dc: DataConnect, vars: CreateOrUpdateUserVariables): MutationPromise<CreateOrUpdateUserData, CreateOrUpdateUserVariables>;

interface UpdateUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  operationName: string;
}
export const updateUserProfileRef: UpdateUserProfileRef;

export function updateUserProfile(vars?: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;
export function updateUserProfile(dc: DataConnect, vars?: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
  operationName: string;
}
export const updateUserRoleRef: UpdateUserRoleRef;

export function updateUserRole(vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;
export function updateUserRole(dc: DataConnect, vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface UpdateUserAccountStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserAccountStatusVariables): MutationRef<UpdateUserAccountStatusData, UpdateUserAccountStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserAccountStatusVariables): MutationRef<UpdateUserAccountStatusData, UpdateUserAccountStatusVariables>;
  operationName: string;
}
export const updateUserAccountStatusRef: UpdateUserAccountStatusRef;

export function updateUserAccountStatus(vars: UpdateUserAccountStatusVariables): MutationPromise<UpdateUserAccountStatusData, UpdateUserAccountStatusVariables>;
export function updateUserAccountStatus(dc: DataConnect, vars: UpdateUserAccountStatusVariables): MutationPromise<UpdateUserAccountStatusData, UpdateUserAccountStatusVariables>;

interface CreateDnaServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDnaServiceVariables): MutationRef<CreateDnaServiceData, CreateDnaServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDnaServiceVariables): MutationRef<CreateDnaServiceData, CreateDnaServiceVariables>;
  operationName: string;
}
export const createDnaServiceRef: CreateDnaServiceRef;

export function createDnaService(vars: CreateDnaServiceVariables): MutationPromise<CreateDnaServiceData, CreateDnaServiceVariables>;
export function createDnaService(dc: DataConnect, vars: CreateDnaServiceVariables): MutationPromise<CreateDnaServiceData, CreateDnaServiceVariables>;

interface UpdateDnaServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDnaServiceVariables): MutationRef<UpdateDnaServiceData, UpdateDnaServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDnaServiceVariables): MutationRef<UpdateDnaServiceData, UpdateDnaServiceVariables>;
  operationName: string;
}
export const updateDnaServiceRef: UpdateDnaServiceRef;

export function updateDnaService(vars: UpdateDnaServiceVariables): MutationPromise<UpdateDnaServiceData, UpdateDnaServiceVariables>;
export function updateDnaService(dc: DataConnect, vars: UpdateDnaServiceVariables): MutationPromise<UpdateDnaServiceData, UpdateDnaServiceVariables>;

interface CreateKitRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateKitVariables): MutationRef<CreateKitData, CreateKitVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateKitVariables): MutationRef<CreateKitData, CreateKitVariables>;
  operationName: string;
}
export const createKitRef: CreateKitRef;

export function createKit(vars: CreateKitVariables): MutationPromise<CreateKitData, CreateKitVariables>;
export function createKit(dc: DataConnect, vars: CreateKitVariables): MutationPromise<CreateKitData, CreateKitVariables>;

interface UpdateKitStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateKitStatusVariables): MutationRef<UpdateKitStatusData, UpdateKitStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateKitStatusVariables): MutationRef<UpdateKitStatusData, UpdateKitStatusVariables>;
  operationName: string;
}
export const updateKitStatusRef: UpdateKitStatusRef;

export function updateKitStatus(vars: UpdateKitStatusVariables): MutationPromise<UpdateKitStatusData, UpdateKitStatusVariables>;
export function updateKitStatus(dc: DataConnect, vars: UpdateKitStatusVariables): MutationPromise<UpdateKitStatusData, UpdateKitStatusVariables>;

interface CreateTimeSlotRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTimeSlotVariables): MutationRef<CreateTimeSlotData, CreateTimeSlotVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTimeSlotVariables): MutationRef<CreateTimeSlotData, CreateTimeSlotVariables>;
  operationName: string;
}
export const createTimeSlotRef: CreateTimeSlotRef;

export function createTimeSlot(vars: CreateTimeSlotVariables): MutationPromise<CreateTimeSlotData, CreateTimeSlotVariables>;
export function createTimeSlot(dc: DataConnect, vars: CreateTimeSlotVariables): MutationPromise<CreateTimeSlotData, CreateTimeSlotVariables>;

interface UpdateTimeSlotRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTimeSlotVariables): MutationRef<UpdateTimeSlotData, UpdateTimeSlotVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTimeSlotVariables): MutationRef<UpdateTimeSlotData, UpdateTimeSlotVariables>;
  operationName: string;
}
export const updateTimeSlotRef: UpdateTimeSlotRef;

export function updateTimeSlot(vars: UpdateTimeSlotVariables): MutationPromise<UpdateTimeSlotData, UpdateTimeSlotVariables>;
export function updateTimeSlot(dc: DataConnect, vars: UpdateTimeSlotVariables): MutationPromise<UpdateTimeSlotData, UpdateTimeSlotVariables>;

interface UpdateTimeSlotBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTimeSlotBookingsVariables): MutationRef<UpdateTimeSlotBookingsData, UpdateTimeSlotBookingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTimeSlotBookingsVariables): MutationRef<UpdateTimeSlotBookingsData, UpdateTimeSlotBookingsVariables>;
  operationName: string;
}
export const updateTimeSlotBookingsRef: UpdateTimeSlotBookingsRef;

export function updateTimeSlotBookings(vars: UpdateTimeSlotBookingsVariables): MutationPromise<UpdateTimeSlotBookingsData, UpdateTimeSlotBookingsVariables>;
export function updateTimeSlotBookings(dc: DataConnect, vars: UpdateTimeSlotBookingsVariables): MutationPromise<UpdateTimeSlotBookingsData, UpdateTimeSlotBookingsVariables>;

interface CreateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  operationName: string;
}
export const createBookingRef: CreateBookingRef;

export function createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;
export function createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface UpdateBookingStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingStatusVariables): MutationRef<UpdateBookingStatusData, UpdateBookingStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBookingStatusVariables): MutationRef<UpdateBookingStatusData, UpdateBookingStatusVariables>;
  operationName: string;
}
export const updateBookingStatusRef: UpdateBookingStatusRef;

export function updateBookingStatus(vars: UpdateBookingStatusVariables): MutationPromise<UpdateBookingStatusData, UpdateBookingStatusVariables>;
export function updateBookingStatus(dc: DataConnect, vars: UpdateBookingStatusVariables): MutationPromise<UpdateBookingStatusData, UpdateBookingStatusVariables>;

interface AssignBookingStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignBookingStaffVariables): MutationRef<AssignBookingStaffData, AssignBookingStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AssignBookingStaffVariables): MutationRef<AssignBookingStaffData, AssignBookingStaffVariables>;
  operationName: string;
}
export const assignBookingStaffRef: AssignBookingStaffRef;

export function assignBookingStaff(vars: AssignBookingStaffVariables): MutationPromise<AssignBookingStaffData, AssignBookingStaffVariables>;
export function assignBookingStaff(dc: DataConnect, vars: AssignBookingStaffVariables): MutationPromise<AssignBookingStaffData, AssignBookingStaffVariables>;

interface AddBookingItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddBookingItemVariables): MutationRef<AddBookingItemData, AddBookingItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddBookingItemVariables): MutationRef<AddBookingItemData, AddBookingItemVariables>;
  operationName: string;
}
export const addBookingItemRef: AddBookingItemRef;

export function addBookingItem(vars: AddBookingItemVariables): MutationPromise<AddBookingItemData, AddBookingItemVariables>;
export function addBookingItem(dc: DataConnect, vars: AddBookingItemVariables): MutationPromise<AddBookingItemData, AddBookingItemVariables>;

interface UpdateBookingItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingItemVariables): MutationRef<UpdateBookingItemData, UpdateBookingItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBookingItemVariables): MutationRef<UpdateBookingItemData, UpdateBookingItemVariables>;
  operationName: string;
}
export const updateBookingItemRef: UpdateBookingItemRef;

export function updateBookingItem(vars: UpdateBookingItemVariables): MutationPromise<UpdateBookingItemData, UpdateBookingItemVariables>;
export function updateBookingItem(dc: DataConnect, vars: UpdateBookingItemVariables): MutationPromise<UpdateBookingItemData, UpdateBookingItemVariables>;

interface RemoveBookingItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveBookingItemVariables): MutationRef<RemoveBookingItemData, RemoveBookingItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveBookingItemVariables): MutationRef<RemoveBookingItemData, RemoveBookingItemVariables>;
  operationName: string;
}
export const removeBookingItemRef: RemoveBookingItemRef;

export function removeBookingItem(vars: RemoveBookingItemVariables): MutationPromise<RemoveBookingItemData, RemoveBookingItemVariables>;
export function removeBookingItem(dc: DataConnect, vars: RemoveBookingItemVariables): MutationPromise<RemoveBookingItemData, RemoveBookingItemVariables>;

interface CreateSampleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSampleVariables): MutationRef<CreateSampleData, CreateSampleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSampleVariables): MutationRef<CreateSampleData, CreateSampleVariables>;
  operationName: string;
}
export const createSampleRef: CreateSampleRef;

export function createSample(vars: CreateSampleVariables): MutationPromise<CreateSampleData, CreateSampleVariables>;
export function createSample(dc: DataConnect, vars: CreateSampleVariables): MutationPromise<CreateSampleData, CreateSampleVariables>;

interface UpdateSampleStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSampleStatusVariables): MutationRef<UpdateSampleStatusData, UpdateSampleStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSampleStatusVariables): MutationRef<UpdateSampleStatusData, UpdateSampleStatusVariables>;
  operationName: string;
}
export const updateSampleStatusRef: UpdateSampleStatusRef;

export function updateSampleStatus(vars: UpdateSampleStatusVariables): MutationPromise<UpdateSampleStatusData, UpdateSampleStatusVariables>;
export function updateSampleStatus(dc: DataConnect, vars: UpdateSampleStatusVariables): MutationPromise<UpdateSampleStatusData, UpdateSampleStatusVariables>;

interface CreateTestResultRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTestResultVariables): MutationRef<CreateTestResultData, CreateTestResultVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTestResultVariables): MutationRef<CreateTestResultData, CreateTestResultVariables>;
  operationName: string;
}
export const createTestResultRef: CreateTestResultRef;

export function createTestResult(vars: CreateTestResultVariables): MutationPromise<CreateTestResultData, CreateTestResultVariables>;
export function createTestResult(dc: DataConnect, vars: CreateTestResultVariables): MutationPromise<CreateTestResultData, CreateTestResultVariables>;

interface UpdateTestResultRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTestResultVariables): MutationRef<UpdateTestResultData, UpdateTestResultVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTestResultVariables): MutationRef<UpdateTestResultData, UpdateTestResultVariables>;
  operationName: string;
}
export const updateTestResultRef: UpdateTestResultRef;

export function updateTestResult(vars: UpdateTestResultVariables): MutationPromise<UpdateTestResultData, UpdateTestResultVariables>;
export function updateTestResult(dc: DataConnect, vars: UpdateTestResultVariables): MutationPromise<UpdateTestResultData, UpdateTestResultVariables>;

interface VerifyTestResultRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: VerifyTestResultVariables): MutationRef<VerifyTestResultData, VerifyTestResultVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: VerifyTestResultVariables): MutationRef<VerifyTestResultData, VerifyTestResultVariables>;
  operationName: string;
}
export const verifyTestResultRef: VerifyTestResultRef;

export function verifyTestResult(vars: VerifyTestResultVariables): MutationPromise<VerifyTestResultData, VerifyTestResultVariables>;
export function verifyTestResult(dc: DataConnect, vars: VerifyTestResultVariables): MutationPromise<VerifyTestResultData, VerifyTestResultVariables>;

interface CreatePaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
  operationName: string;
}
export const createPaymentRef: CreatePaymentRef;

export function createPayment(vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;
export function createPayment(dc: DataConnect, vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;

interface UpdatePaymentStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePaymentStatusVariables): MutationRef<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePaymentStatusVariables): MutationRef<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;
  operationName: string;
}
export const updatePaymentStatusRef: UpdatePaymentStatusRef;

export function updatePaymentStatus(vars: UpdatePaymentStatusVariables): MutationPromise<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;
export function updatePaymentStatus(dc: DataConnect, vars: UpdatePaymentStatusVariables): MutationPromise<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;

interface CreateFeedbackRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFeedbackVariables): MutationRef<CreateFeedbackData, CreateFeedbackVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFeedbackVariables): MutationRef<CreateFeedbackData, CreateFeedbackVariables>;
  operationName: string;
}
export const createFeedbackRef: CreateFeedbackRef;

export function createFeedback(vars: CreateFeedbackVariables): MutationPromise<CreateFeedbackData, CreateFeedbackVariables>;
export function createFeedback(dc: DataConnect, vars: CreateFeedbackVariables): MutationPromise<CreateFeedbackData, CreateFeedbackVariables>;

interface UpdateFeedbackRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFeedbackVariables): MutationRef<UpdateFeedbackData, UpdateFeedbackVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateFeedbackVariables): MutationRef<UpdateFeedbackData, UpdateFeedbackVariables>;
  operationName: string;
}
export const updateFeedbackRef: UpdateFeedbackRef;

export function updateFeedback(vars: UpdateFeedbackVariables): MutationPromise<UpdateFeedbackData, UpdateFeedbackVariables>;
export function updateFeedback(dc: DataConnect, vars: UpdateFeedbackVariables): MutationPromise<UpdateFeedbackData, UpdateFeedbackVariables>;

interface CreateBlogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBlogVariables): MutationRef<CreateBlogData, CreateBlogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBlogVariables): MutationRef<CreateBlogData, CreateBlogVariables>;
  operationName: string;
}
export const createBlogRef: CreateBlogRef;

export function createBlog(vars: CreateBlogVariables): MutationPromise<CreateBlogData, CreateBlogVariables>;
export function createBlog(dc: DataConnect, vars: CreateBlogVariables): MutationPromise<CreateBlogData, CreateBlogVariables>;

interface UpdateBlogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBlogVariables): MutationRef<UpdateBlogData, UpdateBlogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBlogVariables): MutationRef<UpdateBlogData, UpdateBlogVariables>;
  operationName: string;
}
export const updateBlogRef: UpdateBlogRef;

export function updateBlog(vars: UpdateBlogVariables): MutationPromise<UpdateBlogData, UpdateBlogVariables>;
export function updateBlog(dc: DataConnect, vars: UpdateBlogVariables): MutationPromise<UpdateBlogData, UpdateBlogVariables>;

interface DeleteBlogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBlogVariables): MutationRef<DeleteBlogData, DeleteBlogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBlogVariables): MutationRef<DeleteBlogData, DeleteBlogVariables>;
  operationName: string;
}
export const deleteBlogRef: DeleteBlogRef;

export function deleteBlog(vars: DeleteBlogVariables): MutationPromise<DeleteBlogData, DeleteBlogVariables>;
export function deleteBlog(dc: DataConnect, vars: DeleteBlogVariables): MutationPromise<DeleteBlogData, DeleteBlogVariables>;

interface CreateNotificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
  operationName: string;
}
export const createNotificationRef: CreateNotificationRef;

export function createNotification(vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;
export function createNotification(dc: DataConnect, vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface MarkNotificationReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  operationName: string;
}
export const markNotificationReadRef: MarkNotificationReadRef;

export function markNotificationRead(vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;
export function markNotificationRead(dc: DataConnect, vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface MarkAllNotificationsReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAllNotificationsReadVariables): MutationRef<MarkAllNotificationsReadData, MarkAllNotificationsReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkAllNotificationsReadVariables): MutationRef<MarkAllNotificationsReadData, MarkAllNotificationsReadVariables>;
  operationName: string;
}
export const markAllNotificationsReadRef: MarkAllNotificationsReadRef;

export function markAllNotificationsRead(vars: MarkAllNotificationsReadVariables): MutationPromise<MarkAllNotificationsReadData, MarkAllNotificationsReadVariables>;
export function markAllNotificationsRead(dc: DataConnect, vars: MarkAllNotificationsReadVariables): MutationPromise<MarkAllNotificationsReadData, MarkAllNotificationsReadVariables>;

interface DeleteNotificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
  operationName: string;
}
export const deleteNotificationRef: DeleteNotificationRef;

export function deleteNotification(vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;
export function deleteNotification(dc: DataConnect, vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;

interface GetRolesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetRolesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetRolesData, undefined>;
  operationName: string;
}
export const getRolesRef: GetRolesRef;

export function getRoles(): QueryPromise<GetRolesData, undefined>;
export function getRoles(dc: DataConnect): QueryPromise<GetRolesData, undefined>;

interface GetRoleByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRoleByIdVariables): QueryRef<GetRoleByIdData, GetRoleByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRoleByIdVariables): QueryRef<GetRoleByIdData, GetRoleByIdVariables>;
  operationName: string;
}
export const getRoleByIdRef: GetRoleByIdRef;

export function getRoleById(vars: GetRoleByIdVariables): QueryPromise<GetRoleByIdData, GetRoleByIdVariables>;
export function getRoleById(dc: DataConnect, vars: GetRoleByIdVariables): QueryPromise<GetRoleByIdData, GetRoleByIdVariables>;

interface GetRoleByNameRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRoleByNameVariables): QueryRef<GetRoleByNameData, GetRoleByNameVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRoleByNameVariables): QueryRef<GetRoleByNameData, GetRoleByNameVariables>;
  operationName: string;
}
export const getRoleByNameRef: GetRoleByNameRef;

export function getRoleByName(vars: GetRoleByNameVariables): QueryPromise<GetRoleByNameData, GetRoleByNameVariables>;
export function getRoleByName(dc: DataConnect, vars: GetRoleByNameVariables): QueryPromise<GetRoleByNameData, GetRoleByNameVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect): QueryPromise<GetUserData, undefined>;

interface GetUserByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
  operationName: string;
}
export const getUserByIdRef: GetUserByIdRef;

export function getUserById(vars: GetUserByIdVariables): QueryPromise<GetUserByIdData, GetUserByIdVariables>;
export function getUserById(dc: DataConnect, vars: GetUserByIdVariables): QueryPromise<GetUserByIdData, GetUserByIdVariables>;

interface GetUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetUsersVariables): QueryRef<GetUsersData, GetUsersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: GetUsersVariables): QueryRef<GetUsersData, GetUsersVariables>;
  operationName: string;
}
export const getUsersRef: GetUsersRef;

export function getUsers(vars?: GetUsersVariables): QueryPromise<GetUsersData, GetUsersVariables>;
export function getUsers(dc: DataConnect, vars?: GetUsersVariables): QueryPromise<GetUsersData, GetUsersVariables>;

interface GetUsersByRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUsersByRoleVariables): QueryRef<GetUsersByRoleData, GetUsersByRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUsersByRoleVariables): QueryRef<GetUsersByRoleData, GetUsersByRoleVariables>;
  operationName: string;
}
export const getUsersByRoleRef: GetUsersByRoleRef;

export function getUsersByRole(vars: GetUsersByRoleVariables): QueryPromise<GetUsersByRoleData, GetUsersByRoleVariables>;
export function getUsersByRole(dc: DataConnect, vars: GetUsersByRoleVariables): QueryPromise<GetUsersByRoleData, GetUsersByRoleVariables>;

interface GetStaffMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetStaffMembersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetStaffMembersData, undefined>;
  operationName: string;
}
export const getStaffMembersRef: GetStaffMembersRef;

export function getStaffMembers(): QueryPromise<GetStaffMembersData, undefined>;
export function getStaffMembers(dc: DataConnect): QueryPromise<GetStaffMembersData, undefined>;

interface GetDnaServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetDnaServicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetDnaServicesData, undefined>;
  operationName: string;
}
export const getDnaServicesRef: GetDnaServicesRef;

export function getDnaServices(): QueryPromise<GetDnaServicesData, undefined>;
export function getDnaServices(dc: DataConnect): QueryPromise<GetDnaServicesData, undefined>;

interface GetDnaServiceByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDnaServiceByIdVariables): QueryRef<GetDnaServiceByIdData, GetDnaServiceByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDnaServiceByIdVariables): QueryRef<GetDnaServiceByIdData, GetDnaServiceByIdVariables>;
  operationName: string;
}
export const getDnaServiceByIdRef: GetDnaServiceByIdRef;

export function getDnaServiceById(vars: GetDnaServiceByIdVariables): QueryPromise<GetDnaServiceByIdData, GetDnaServiceByIdVariables>;
export function getDnaServiceById(dc: DataConnect, vars: GetDnaServiceByIdVariables): QueryPromise<GetDnaServiceByIdData, GetDnaServiceByIdVariables>;

interface GetDnaServicesBySampleTypeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDnaServicesBySampleTypeVariables): QueryRef<GetDnaServicesBySampleTypeData, GetDnaServicesBySampleTypeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDnaServicesBySampleTypeVariables): QueryRef<GetDnaServicesBySampleTypeData, GetDnaServicesBySampleTypeVariables>;
  operationName: string;
}
export const getDnaServicesBySampleTypeRef: GetDnaServicesBySampleTypeRef;

export function getDnaServicesBySampleType(vars: GetDnaServicesBySampleTypeVariables): QueryPromise<GetDnaServicesBySampleTypeData, GetDnaServicesBySampleTypeVariables>;
export function getDnaServicesBySampleType(dc: DataConnect, vars: GetDnaServicesBySampleTypeVariables): QueryPromise<GetDnaServicesBySampleTypeData, GetDnaServicesBySampleTypeVariables>;

interface GetAtHomeServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAtHomeServicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAtHomeServicesData, undefined>;
  operationName: string;
}
export const getAtHomeServicesRef: GetAtHomeServicesRef;

export function getAtHomeServices(): QueryPromise<GetAtHomeServicesData, undefined>;
export function getAtHomeServices(dc: DataConnect): QueryPromise<GetAtHomeServicesData, undefined>;

interface GetKitsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetKitsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetKitsData, undefined>;
  operationName: string;
}
export const getKitsRef: GetKitsRef;

export function getKits(): QueryPromise<GetKitsData, undefined>;
export function getKits(dc: DataConnect): QueryPromise<GetKitsData, undefined>;

interface GetAvailableKitsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAvailableKitsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAvailableKitsData, undefined>;
  operationName: string;
}
export const getAvailableKitsRef: GetAvailableKitsRef;

export function getAvailableKits(): QueryPromise<GetAvailableKitsData, undefined>;
export function getAvailableKits(dc: DataConnect): QueryPromise<GetAvailableKitsData, undefined>;

interface GetKitByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetKitByIdVariables): QueryRef<GetKitByIdData, GetKitByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetKitByIdVariables): QueryRef<GetKitByIdData, GetKitByIdVariables>;
  operationName: string;
}
export const getKitByIdRef: GetKitByIdRef;

export function getKitById(vars: GetKitByIdVariables): QueryPromise<GetKitByIdData, GetKitByIdVariables>;
export function getKitById(dc: DataConnect, vars: GetKitByIdVariables): QueryPromise<GetKitByIdData, GetKitByIdVariables>;

interface GetAvailableTimeSlotsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAvailableTimeSlotsVariables): QueryRef<GetAvailableTimeSlotsData, GetAvailableTimeSlotsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAvailableTimeSlotsVariables): QueryRef<GetAvailableTimeSlotsData, GetAvailableTimeSlotsVariables>;
  operationName: string;
}
export const getAvailableTimeSlotsRef: GetAvailableTimeSlotsRef;

export function getAvailableTimeSlots(vars: GetAvailableTimeSlotsVariables): QueryPromise<GetAvailableTimeSlotsData, GetAvailableTimeSlotsVariables>;
export function getAvailableTimeSlots(dc: DataConnect, vars: GetAvailableTimeSlotsVariables): QueryPromise<GetAvailableTimeSlotsData, GetAvailableTimeSlotsVariables>;

interface GetTimeSlotsByStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTimeSlotsByStaffVariables): QueryRef<GetTimeSlotsByStaffData, GetTimeSlotsByStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTimeSlotsByStaffVariables): QueryRef<GetTimeSlotsByStaffData, GetTimeSlotsByStaffVariables>;
  operationName: string;
}
export const getTimeSlotsByStaffRef: GetTimeSlotsByStaffRef;

export function getTimeSlotsByStaff(vars: GetTimeSlotsByStaffVariables): QueryPromise<GetTimeSlotsByStaffData, GetTimeSlotsByStaffVariables>;
export function getTimeSlotsByStaff(dc: DataConnect, vars: GetTimeSlotsByStaffVariables): QueryPromise<GetTimeSlotsByStaffData, GetTimeSlotsByStaffVariables>;

interface GetTimeSlotByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTimeSlotByIdVariables): QueryRef<GetTimeSlotByIdData, GetTimeSlotByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTimeSlotByIdVariables): QueryRef<GetTimeSlotByIdData, GetTimeSlotByIdVariables>;
  operationName: string;
}
export const getTimeSlotByIdRef: GetTimeSlotByIdRef;

export function getTimeSlotById(vars: GetTimeSlotByIdVariables): QueryPromise<GetTimeSlotByIdData, GetTimeSlotByIdVariables>;
export function getTimeSlotById(dc: DataConnect, vars: GetTimeSlotByIdVariables): QueryPromise<GetTimeSlotByIdData, GetTimeSlotByIdVariables>;

interface GetTimeSlotsInRangeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTimeSlotsInRangeVariables): QueryRef<GetTimeSlotsInRangeData, GetTimeSlotsInRangeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTimeSlotsInRangeVariables): QueryRef<GetTimeSlotsInRangeData, GetTimeSlotsInRangeVariables>;
  operationName: string;
}
export const getTimeSlotsInRangeRef: GetTimeSlotsInRangeRef;

export function getTimeSlotsInRange(vars: GetTimeSlotsInRangeVariables): QueryPromise<GetTimeSlotsInRangeData, GetTimeSlotsInRangeVariables>;
export function getTimeSlotsInRange(dc: DataConnect, vars: GetTimeSlotsInRangeVariables): QueryPromise<GetTimeSlotsInRangeData, GetTimeSlotsInRangeVariables>;

interface GetUserBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserBookingsVariables): QueryRef<GetUserBookingsData, GetUserBookingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserBookingsVariables): QueryRef<GetUserBookingsData, GetUserBookingsVariables>;
  operationName: string;
}
export const getUserBookingsRef: GetUserBookingsRef;

export function getUserBookings(vars: GetUserBookingsVariables): QueryPromise<GetUserBookingsData, GetUserBookingsVariables>;
export function getUserBookings(dc: DataConnect, vars: GetUserBookingsVariables): QueryPromise<GetUserBookingsData, GetUserBookingsVariables>;

interface GetMyBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyBookingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyBookingsData, undefined>;
  operationName: string;
}
export const getMyBookingsRef: GetMyBookingsRef;

export function getMyBookings(): QueryPromise<GetMyBookingsData, undefined>;
export function getMyBookings(dc: DataConnect): QueryPromise<GetMyBookingsData, undefined>;

interface GetBookingByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingByIdVariables): QueryRef<GetBookingByIdData, GetBookingByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingByIdVariables): QueryRef<GetBookingByIdData, GetBookingByIdVariables>;
  operationName: string;
}
export const getBookingByIdRef: GetBookingByIdRef;

export function getBookingById(vars: GetBookingByIdVariables): QueryPromise<GetBookingByIdData, GetBookingByIdVariables>;
export function getBookingById(dc: DataConnect, vars: GetBookingByIdVariables): QueryPromise<GetBookingByIdData, GetBookingByIdVariables>;

interface GetBookingsByStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingsByStatusVariables): QueryRef<GetBookingsByStatusData, GetBookingsByStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingsByStatusVariables): QueryRef<GetBookingsByStatusData, GetBookingsByStatusVariables>;
  operationName: string;
}
export const getBookingsByStatusRef: GetBookingsByStatusRef;

export function getBookingsByStatus(vars: GetBookingsByStatusVariables): QueryPromise<GetBookingsByStatusData, GetBookingsByStatusVariables>;
export function getBookingsByStatus(dc: DataConnect, vars: GetBookingsByStatusVariables): QueryPromise<GetBookingsByStatusData, GetBookingsByStatusVariables>;

interface GetStaffBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffBookingsVariables): QueryRef<GetStaffBookingsData, GetStaffBookingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStaffBookingsVariables): QueryRef<GetStaffBookingsData, GetStaffBookingsVariables>;
  operationName: string;
}
export const getStaffBookingsRef: GetStaffBookingsRef;

export function getStaffBookings(vars: GetStaffBookingsVariables): QueryPromise<GetStaffBookingsData, GetStaffBookingsVariables>;
export function getStaffBookings(dc: DataConnect, vars: GetStaffBookingsVariables): QueryPromise<GetStaffBookingsData, GetStaffBookingsVariables>;

interface GetBookingItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingItemsVariables): QueryRef<GetBookingItemsData, GetBookingItemsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingItemsVariables): QueryRef<GetBookingItemsData, GetBookingItemsVariables>;
  operationName: string;
}
export const getBookingItemsRef: GetBookingItemsRef;

export function getBookingItems(vars: GetBookingItemsVariables): QueryPromise<GetBookingItemsData, GetBookingItemsVariables>;
export function getBookingItems(dc: DataConnect, vars: GetBookingItemsVariables): QueryPromise<GetBookingItemsData, GetBookingItemsVariables>;

interface GetBookingItemByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingItemByIdVariables): QueryRef<GetBookingItemByIdData, GetBookingItemByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingItemByIdVariables): QueryRef<GetBookingItemByIdData, GetBookingItemByIdVariables>;
  operationName: string;
}
export const getBookingItemByIdRef: GetBookingItemByIdRef;

export function getBookingItemById(vars: GetBookingItemByIdVariables): QueryPromise<GetBookingItemByIdData, GetBookingItemByIdVariables>;
export function getBookingItemById(dc: DataConnect, vars: GetBookingItemByIdVariables): QueryPromise<GetBookingItemByIdData, GetBookingItemByIdVariables>;

interface GetBookingSamplesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingSamplesVariables): QueryRef<GetBookingSamplesData, GetBookingSamplesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingSamplesVariables): QueryRef<GetBookingSamplesData, GetBookingSamplesVariables>;
  operationName: string;
}
export const getBookingSamplesRef: GetBookingSamplesRef;

export function getBookingSamples(vars: GetBookingSamplesVariables): QueryPromise<GetBookingSamplesData, GetBookingSamplesVariables>;
export function getBookingSamples(dc: DataConnect, vars: GetBookingSamplesVariables): QueryPromise<GetBookingSamplesData, GetBookingSamplesVariables>;

interface GetSamplesByStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSamplesByStatusVariables): QueryRef<GetSamplesByStatusData, GetSamplesByStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSamplesByStatusVariables): QueryRef<GetSamplesByStatusData, GetSamplesByStatusVariables>;
  operationName: string;
}
export const getSamplesByStatusRef: GetSamplesByStatusRef;

export function getSamplesByStatus(vars: GetSamplesByStatusVariables): QueryPromise<GetSamplesByStatusData, GetSamplesByStatusVariables>;
export function getSamplesByStatus(dc: DataConnect, vars: GetSamplesByStatusVariables): QueryPromise<GetSamplesByStatusData, GetSamplesByStatusVariables>;

interface GetSampleByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSampleByIdVariables): QueryRef<GetSampleByIdData, GetSampleByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSampleByIdVariables): QueryRef<GetSampleByIdData, GetSampleByIdVariables>;
  operationName: string;
}
export const getSampleByIdRef: GetSampleByIdRef;

export function getSampleById(vars: GetSampleByIdVariables): QueryPromise<GetSampleByIdData, GetSampleByIdVariables>;
export function getSampleById(dc: DataConnect, vars: GetSampleByIdVariables): QueryPromise<GetSampleByIdData, GetSampleByIdVariables>;

interface GetStaffSamplesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffSamplesVariables): QueryRef<GetStaffSamplesData, GetStaffSamplesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStaffSamplesVariables): QueryRef<GetStaffSamplesData, GetStaffSamplesVariables>;
  operationName: string;
}
export const getStaffSamplesRef: GetStaffSamplesRef;

export function getStaffSamples(vars: GetStaffSamplesVariables): QueryPromise<GetStaffSamplesData, GetStaffSamplesVariables>;
export function getStaffSamples(dc: DataConnect, vars: GetStaffSamplesVariables): QueryPromise<GetStaffSamplesData, GetStaffSamplesVariables>;

interface GetBookingTestResultsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingTestResultsVariables): QueryRef<GetBookingTestResultsData, GetBookingTestResultsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingTestResultsVariables): QueryRef<GetBookingTestResultsData, GetBookingTestResultsVariables>;
  operationName: string;
}
export const getBookingTestResultsRef: GetBookingTestResultsRef;

export function getBookingTestResults(vars: GetBookingTestResultsVariables): QueryPromise<GetBookingTestResultsData, GetBookingTestResultsVariables>;
export function getBookingTestResults(dc: DataConnect, vars: GetBookingTestResultsVariables): QueryPromise<GetBookingTestResultsData, GetBookingTestResultsVariables>;

interface GetTestResultByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTestResultByIdVariables): QueryRef<GetTestResultByIdData, GetTestResultByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTestResultByIdVariables): QueryRef<GetTestResultByIdData, GetTestResultByIdVariables>;
  operationName: string;
}
export const getTestResultByIdRef: GetTestResultByIdRef;

export function getTestResultById(vars: GetTestResultByIdVariables): QueryPromise<GetTestResultByIdData, GetTestResultByIdVariables>;
export function getTestResultById(dc: DataConnect, vars: GetTestResultByIdVariables): QueryPromise<GetTestResultByIdData, GetTestResultByIdVariables>;

interface GetTestResultsByStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTestResultsByStatusVariables): QueryRef<GetTestResultsByStatusData, GetTestResultsByStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTestResultsByStatusVariables): QueryRef<GetTestResultsByStatusData, GetTestResultsByStatusVariables>;
  operationName: string;
}
export const getTestResultsByStatusRef: GetTestResultsByStatusRef;

export function getTestResultsByStatus(vars: GetTestResultsByStatusVariables): QueryPromise<GetTestResultsByStatusData, GetTestResultsByStatusVariables>;
export function getTestResultsByStatus(dc: DataConnect, vars: GetTestResultsByStatusVariables): QueryPromise<GetTestResultsByStatusData, GetTestResultsByStatusVariables>;

interface GetUserTestResultsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserTestResultsVariables): QueryRef<GetUserTestResultsData, GetUserTestResultsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserTestResultsVariables): QueryRef<GetUserTestResultsData, GetUserTestResultsVariables>;
  operationName: string;
}
export const getUserTestResultsRef: GetUserTestResultsRef;

export function getUserTestResults(vars: GetUserTestResultsVariables): QueryPromise<GetUserTestResultsData, GetUserTestResultsVariables>;
export function getUserTestResults(dc: DataConnect, vars: GetUserTestResultsVariables): QueryPromise<GetUserTestResultsData, GetUserTestResultsVariables>;

interface GetBookingPaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingPaymentVariables): QueryRef<GetBookingPaymentData, GetBookingPaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingPaymentVariables): QueryRef<GetBookingPaymentData, GetBookingPaymentVariables>;
  operationName: string;
}
export const getBookingPaymentRef: GetBookingPaymentRef;

export function getBookingPayment(vars: GetBookingPaymentVariables): QueryPromise<GetBookingPaymentData, GetBookingPaymentVariables>;
export function getBookingPayment(dc: DataConnect, vars: GetBookingPaymentVariables): QueryPromise<GetBookingPaymentData, GetBookingPaymentVariables>;

interface GetPaymentByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPaymentByIdVariables): QueryRef<GetPaymentByIdData, GetPaymentByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPaymentByIdVariables): QueryRef<GetPaymentByIdData, GetPaymentByIdVariables>;
  operationName: string;
}
export const getPaymentByIdRef: GetPaymentByIdRef;

export function getPaymentById(vars: GetPaymentByIdVariables): QueryPromise<GetPaymentByIdData, GetPaymentByIdVariables>;
export function getPaymentById(dc: DataConnect, vars: GetPaymentByIdVariables): QueryPromise<GetPaymentByIdData, GetPaymentByIdVariables>;

interface GetPaymentsByStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPaymentsByStatusVariables): QueryRef<GetPaymentsByStatusData, GetPaymentsByStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPaymentsByStatusVariables): QueryRef<GetPaymentsByStatusData, GetPaymentsByStatusVariables>;
  operationName: string;
}
export const getPaymentsByStatusRef: GetPaymentsByStatusRef;

export function getPaymentsByStatus(vars: GetPaymentsByStatusVariables): QueryPromise<GetPaymentsByStatusData, GetPaymentsByStatusVariables>;
export function getPaymentsByStatus(dc: DataConnect, vars: GetPaymentsByStatusVariables): QueryPromise<GetPaymentsByStatusData, GetPaymentsByStatusVariables>;

interface GetUserPaymentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPaymentsVariables): QueryRef<GetUserPaymentsData, GetUserPaymentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserPaymentsVariables): QueryRef<GetUserPaymentsData, GetUserPaymentsVariables>;
  operationName: string;
}
export const getUserPaymentsRef: GetUserPaymentsRef;

export function getUserPayments(vars: GetUserPaymentsVariables): QueryPromise<GetUserPaymentsData, GetUserPaymentsVariables>;
export function getUserPayments(dc: DataConnect, vars: GetUserPaymentsVariables): QueryPromise<GetUserPaymentsData, GetUserPaymentsVariables>;

interface GetBookingFeedbackRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingFeedbackVariables): QueryRef<GetBookingFeedbackData, GetBookingFeedbackVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingFeedbackVariables): QueryRef<GetBookingFeedbackData, GetBookingFeedbackVariables>;
  operationName: string;
}
export const getBookingFeedbackRef: GetBookingFeedbackRef;

export function getBookingFeedback(vars: GetBookingFeedbackVariables): QueryPromise<GetBookingFeedbackData, GetBookingFeedbackVariables>;
export function getBookingFeedback(dc: DataConnect, vars: GetBookingFeedbackVariables): QueryPromise<GetBookingFeedbackData, GetBookingFeedbackVariables>;

interface GetAllFeedbackRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetAllFeedbackVariables): QueryRef<GetAllFeedbackData, GetAllFeedbackVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: GetAllFeedbackVariables): QueryRef<GetAllFeedbackData, GetAllFeedbackVariables>;
  operationName: string;
}
export const getAllFeedbackRef: GetAllFeedbackRef;

export function getAllFeedback(vars?: GetAllFeedbackVariables): QueryPromise<GetAllFeedbackData, GetAllFeedbackVariables>;
export function getAllFeedback(dc: DataConnect, vars?: GetAllFeedbackVariables): QueryPromise<GetAllFeedbackData, GetAllFeedbackVariables>;

interface GetFeedbackByRatingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFeedbackByRatingVariables): QueryRef<GetFeedbackByRatingData, GetFeedbackByRatingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetFeedbackByRatingVariables): QueryRef<GetFeedbackByRatingData, GetFeedbackByRatingVariables>;
  operationName: string;
}
export const getFeedbackByRatingRef: GetFeedbackByRatingRef;

export function getFeedbackByRating(vars: GetFeedbackByRatingVariables): QueryPromise<GetFeedbackByRatingData, GetFeedbackByRatingVariables>;
export function getFeedbackByRating(dc: DataConnect, vars: GetFeedbackByRatingVariables): QueryPromise<GetFeedbackByRatingData, GetFeedbackByRatingVariables>;

interface GetBlogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetBlogsVariables): QueryRef<GetBlogsData, GetBlogsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: GetBlogsVariables): QueryRef<GetBlogsData, GetBlogsVariables>;
  operationName: string;
}
export const getBlogsRef: GetBlogsRef;

export function getBlogs(vars?: GetBlogsVariables): QueryPromise<GetBlogsData, GetBlogsVariables>;
export function getBlogs(dc: DataConnect, vars?: GetBlogsVariables): QueryPromise<GetBlogsData, GetBlogsVariables>;

interface GetBlogByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBlogByIdVariables): QueryRef<GetBlogByIdData, GetBlogByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBlogByIdVariables): QueryRef<GetBlogByIdData, GetBlogByIdVariables>;
  operationName: string;
}
export const getBlogByIdRef: GetBlogByIdRef;

export function getBlogById(vars: GetBlogByIdVariables): QueryPromise<GetBlogByIdData, GetBlogByIdVariables>;
export function getBlogById(dc: DataConnect, vars: GetBlogByIdVariables): QueryPromise<GetBlogByIdData, GetBlogByIdVariables>;

interface GetBlogsByUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBlogsByUserVariables): QueryRef<GetBlogsByUserData, GetBlogsByUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBlogsByUserVariables): QueryRef<GetBlogsByUserData, GetBlogsByUserVariables>;
  operationName: string;
}
export const getBlogsByUserRef: GetBlogsByUserRef;

export function getBlogsByUser(vars: GetBlogsByUserVariables): QueryPromise<GetBlogsByUserData, GetBlogsByUserVariables>;
export function getBlogsByUser(dc: DataConnect, vars: GetBlogsByUserVariables): QueryPromise<GetBlogsByUserData, GetBlogsByUserVariables>;

interface GetMyBlogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyBlogsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyBlogsData, undefined>;
  operationName: string;
}
export const getMyBlogsRef: GetMyBlogsRef;

export function getMyBlogs(): QueryPromise<GetMyBlogsData, undefined>;
export function getMyBlogs(dc: DataConnect): QueryPromise<GetMyBlogsData, undefined>;

interface GetUserNotificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserNotificationsVariables): QueryRef<GetUserNotificationsData, GetUserNotificationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserNotificationsVariables): QueryRef<GetUserNotificationsData, GetUserNotificationsVariables>;
  operationName: string;
}
export const getUserNotificationsRef: GetUserNotificationsRef;

export function getUserNotifications(vars: GetUserNotificationsVariables): QueryPromise<GetUserNotificationsData, GetUserNotificationsVariables>;
export function getUserNotifications(dc: DataConnect, vars: GetUserNotificationsVariables): QueryPromise<GetUserNotificationsData, GetUserNotificationsVariables>;

interface GetMyNotificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyNotificationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyNotificationsData, undefined>;
  operationName: string;
}
export const getMyNotificationsRef: GetMyNotificationsRef;

export function getMyNotifications(): QueryPromise<GetMyNotificationsData, undefined>;
export function getMyNotifications(dc: DataConnect): QueryPromise<GetMyNotificationsData, undefined>;

interface GetUnreadNotificationsCountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUnreadNotificationsCountVariables): QueryRef<GetUnreadNotificationsCountData, GetUnreadNotificationsCountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUnreadNotificationsCountVariables): QueryRef<GetUnreadNotificationsCountData, GetUnreadNotificationsCountVariables>;
  operationName: string;
}
export const getUnreadNotificationsCountRef: GetUnreadNotificationsCountRef;

export function getUnreadNotificationsCount(vars: GetUnreadNotificationsCountVariables): QueryPromise<GetUnreadNotificationsCountData, GetUnreadNotificationsCountVariables>;
export function getUnreadNotificationsCount(dc: DataConnect, vars: GetUnreadNotificationsCountVariables): QueryPromise<GetUnreadNotificationsCountData, GetUnreadNotificationsCountVariables>;

interface GetNotificationByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotificationByIdVariables): QueryRef<GetNotificationByIdData, GetNotificationByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetNotificationByIdVariables): QueryRef<GetNotificationByIdData, GetNotificationByIdVariables>;
  operationName: string;
}
export const getNotificationByIdRef: GetNotificationByIdRef;

export function getNotificationById(vars: GetNotificationByIdVariables): QueryPromise<GetNotificationByIdData, GetNotificationByIdVariables>;
export function getNotificationById(dc: DataConnect, vars: GetNotificationByIdVariables): QueryPromise<GetNotificationByIdData, GetNotificationByIdVariables>;

interface GetBookingStatsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetBookingStatsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetBookingStatsData, undefined>;
  operationName: string;
}
export const getBookingStatsRef: GetBookingStatsRef;

export function getBookingStats(): QueryPromise<GetBookingStatsData, undefined>;
export function getBookingStats(dc: DataConnect): QueryPromise<GetBookingStatsData, undefined>;

interface GetServicePopularityRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetServicePopularityData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetServicePopularityData, undefined>;
  operationName: string;
}
export const getServicePopularityRef: GetServicePopularityRef;

export function getServicePopularity(): QueryPromise<GetServicePopularityData, undefined>;
export function getServicePopularity(dc: DataConnect): QueryPromise<GetServicePopularityData, undefined>;

interface GetMonthlyRevenueRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMonthlyRevenueVariables): QueryRef<GetMonthlyRevenueData, GetMonthlyRevenueVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMonthlyRevenueVariables): QueryRef<GetMonthlyRevenueData, GetMonthlyRevenueVariables>;
  operationName: string;
}
export const getMonthlyRevenueRef: GetMonthlyRevenueRef;

export function getMonthlyRevenue(vars: GetMonthlyRevenueVariables): QueryPromise<GetMonthlyRevenueData, GetMonthlyRevenueVariables>;
export function getMonthlyRevenue(dc: DataConnect, vars: GetMonthlyRevenueVariables): QueryPromise<GetMonthlyRevenueData, GetMonthlyRevenueVariables>;

