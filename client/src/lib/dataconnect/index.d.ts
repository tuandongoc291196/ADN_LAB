import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AddPaymentDetailsData {
  payment_update?: Payment_Key | null;
}

export interface AddPaymentDetailsVariables {
  paymentId: string;
  otherDetails?: string[] | null;
}

export interface AssignBookingStaffData {
  booking_update?: Booking_Key | null;
}

export interface AssignBookingStaffVariables {
  bookingId: string;
  staffId: string;
}

export interface AssignTestResultManagerData {
  testResult_update?: TestResult_Key | null;
}

export interface AssignTestResultManagerVariables {
  resultId: string;
  managerId: string;
}

export interface Blog_Key {
  id: string;
  __typename?: 'Blog_Key';
}

export interface BookingHistory_Key {
  id: string;
  __typename?: 'BookingHistory_Key';
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
  title: string;
  content: string;
  imageUrl?: string | null;
}

export interface CreateBookingData {
  booking_insert: Booking_Key;
}

export interface CreateBookingHistoryData {
  bookingHistory_insert: BookingHistory_Key;
}

export interface CreateBookingHistoryVariables {
  id: string;
  bookingId: string;
  description: string;
  status: string;
}

export interface CreateBookingVariables {
  id: string;
  userId: string;
  staffId?: string | null;
  timeSlotId?: string | null;
  serviceId: string;
  methodId: string;
  totalAmount: number;
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

export interface CreateManagerData {
  manager_insert: Manager_Key;
}

export interface CreateManagerVariables {
  id: string;
  hireDate?: DateString | null;
  slot?: number | null;
  specification?: string[] | null;
  certifications?: string[] | null;
}

export interface CreateMethodData {
  method_insert: Method_Key;
}

export interface CreateMethodVariables {
  id: string;
  name: string;
  description?: string | null;
  price: number;
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
  address?: string | null;
  roleId?: string | null;
  authProvider: string;
}

export interface CreateParticipantData {
  participant_insert: Participant_Key;
}

export interface CreateParticipantVariables {
  id: string;
  bookingId: string;
  name: string;
  age: number;
  identification?: string | null;
  gender: string;
  relationship?: string | null;
}

export interface CreatePaymentData {
  payment_insert: Payment_Key;
}

export interface CreatePaymentVariables {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  status?: string | null;
  paymentDate?: DateString | null;
  refundDetail?: string | null;
  otherDetails?: string[] | null;
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
  staffId?: string | null;
  participantId?: string | null;
  collectionDate?: DateString | null;
  sampleQuality: string;
  sampleConcentration?: number | null;
  notes?: string | null;
}

export interface CreateServiceCategoryData {
  serviceCategory_insert: ServiceCategory_Key;
}

export interface CreateServiceCategoryVariables {
  id: string;
  name: string;
  description?: string | null;
  hasLegalValue: boolean;
}

export interface CreateServiceData {
  service_insert: Service_Key;
}

export interface CreateServiceMethodData {
  serviceMethod_insert: ServiceMethod_Key;
}

export interface CreateServiceMethodVariables {
  serviceId: string;
  methodId: string;
}

export interface CreateServiceVariables {
  id: string;
  title: string;
  description: string;
  fullDescription?: string | null;
  price: number;
  duration: string;
  categoryId: string;
  icon?: string | null;
  featured: boolean;
}

export interface CreateStaffData {
  staff_insert: Staff_Key;
}

export interface CreateStaffVariables {
  id: string;
  hireDate?: DateString | null;
  slot?: number | null;
  specification?: string[] | null;
  certifications?: string[] | null;
  position?: string | null;
}

export interface CreateTestResultData {
  testResult_insert: TestResult_Key;
}

export interface CreateTestResultVariables {
  id: string;
  bookingId: string;
  sampleId: string;
  managerId?: string | null;
  testMethod: string;
  positive: boolean;
  accuracy: number;
  testType: string;
  testDate?: DateString | null;
  reportDate?: DateString | null;
  resultData?: string | null;
  resultNotes?: string | null;
  status?: string | null;
}

export interface CreateTimeSlotData {
  timeSlot_insert: TimeSlot_Key;
}

export interface CreateTimeSlotVariables {
  id: string;
  slotDate: DateString;
  startTime: string;
  endTime: string;
  notes?: string | null;
}

export interface DeleteBlogData {
  blog_delete?: Blog_Key | null;
}

export interface DeleteBlogVariables {
  blogId: string;
}

export interface DeleteBookingData {
  booking_delete?: Booking_Key | null;
}

export interface DeleteBookingVariables {
  bookingId: string;
}

export interface DeleteManagerData {
  manager_delete?: Manager_Key | null;
}

export interface DeleteManagerVariables {
  managerId: string;
}

export interface DeleteMethodData {
  method_delete?: Method_Key | null;
}

export interface DeleteMethodVariables {
  methodId: string;
}

export interface DeleteNotificationData {
  notification_delete?: Notification_Key | null;
}

export interface DeleteNotificationVariables {
  notificationId: string;
}

export interface DeleteParticipantData {
  participant_delete?: Participant_Key | null;
}

export interface DeleteParticipantVariables {
  participantId: string;
}

export interface DeleteRoleData {
  role_delete?: Role_Key | null;
}

export interface DeleteRoleVariables {
  roleId: string;
}

export interface DeleteSampleData {
  sample_delete?: Sample_Key | null;
}

export interface DeleteSampleVariables {
  sampleId: string;
}

export interface DeleteServiceCategoryData {
  serviceCategory_delete?: ServiceCategory_Key | null;
}

export interface DeleteServiceCategoryVariables {
  categoryId: string;
}

export interface DeleteServiceData {
  service_delete?: Service_Key | null;
}

export interface DeleteServiceMethodData {
  serviceMethod_delete?: ServiceMethod_Key | null;
}

export interface DeleteServiceMethodVariables {
  serviceId: string;
  methodId: string;
}

export interface DeleteServiceVariables {
  serviceId: string;
}

export interface DeleteStaffData {
  staff_delete?: Staff_Key | null;
}

export interface DeleteStaffVariables {
  staffId: string;
}

export interface DeleteTestResultData {
  testResult_delete?: TestResult_Key | null;
}

export interface DeleteTestResultVariables {
  resultId: string;
}

export interface DeleteTimeSlotData {
  timeSlot_delete?: TimeSlot_Key | null;
}

export interface DeleteTimeSlotVariables {
  timeSlotId: string;
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

export interface GetAllSamplesData {
  samples: ({
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
      };
        service: {
          title: string;
          category: {
            name: string;
          };
        };
    } & Booking_Key;
      staff?: {
        user: {
          fullname: string;
        };
      };
        participant?: {
          name: string;
          age: number;
          gender: string;
        };
          collectionDate?: DateString | null;
          sampleQuality: string;
          sampleConcentration?: number | null;
          notes?: string | null;
          createdAt: TimestampString;
  } & Sample_Key)[];
}

export interface GetAllSamplesVariables {
  limit?: number | null;
  offset?: number | null;
}

export interface GetAvailableStaffData {
  staffs: ({
    id: string;
    user: {
      fullname: string;
      email: string;
    };
      slot?: number | null;
      specification?: string[] | null;
      position?: string | null;
      createdAt: TimestampString;
  } & Staff_Key)[];
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
      title: string;
      content: string;
      imageUrl?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Blog_Key;
}

export interface GetBlogByIdVariables {
  blogId: string;
}

export interface GetBlogsByUserData {
  blogs: ({
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
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
      title: string;
      content: string;
      imageUrl?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
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
      address?: string | null;
    } & User_Key;
      staff: {
        id: string;
        user: {
          fullname: string;
        };
      } & Staff_Key;
        service: {
          id: string;
          title: string;
          description: string;
          fullDescription?: string | null;
          price: number;
          duration: string;
          category: {
            id: string;
            name: string;
            description?: string | null;
            hasLegalValue: boolean;
          } & ServiceCategory_Key;
        } & Service_Key;
          method: {
            id: string;
            name: string;
            description?: string | null;
            price: number;
          } & Method_Key;
            timeSlot?: {
              slotDate: DateString;
              startTime: string;
              endTime: string;
            };
              totalAmount: number;
              createdAt: TimestampString;
  } & Booking_Key;
}

export interface GetBookingByIdVariables {
  bookingId: string;
}

export interface GetBookingCountByDateRangeData {
  bookings: ({
    id: string;
    createdAt: TimestampString;
  } & Booking_Key)[];
}

export interface GetBookingCountByDateRangeVariables {
  startDate: DateString;
  endDate: DateString;
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

export interface GetBookingHistoryData {
  bookingHistories: ({
    id: string;
    description: string;
    status: string;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & BookingHistory_Key)[];
}

export interface GetBookingHistoryVariables {
  bookingId: string;
}

export interface GetBookingParticipantsData {
  participants: ({
    id: string;
    name: string;
    age: number;
    identification?: string | null;
    gender: string;
    relationship?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Participant_Key)[];
}

export interface GetBookingParticipantsVariables {
  bookingId: string;
}

export interface GetBookingPaymentData {
  payments: ({
    id: string;
    amount: number;
    paymentMethod: string;
    status: string;
    paymentDate?: DateString | null;
    refundDetail?: string | null;
    otherDetails?: string[] | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Payment_Key)[];
}

export interface GetBookingPaymentVariables {
  bookingId: string;
}

export interface GetBookingSamplesData {
  samples: ({
    id: string;
    booking: {
      service: {
        title: string;
        category: {
          name: string;
        };
      };
    };
      staff?: {
        user: {
          fullname: string;
        };
      };
        participant?: {
          name: string;
          age: number;
          gender: string;
        };
          collectionDate?: DateString | null;
          sampleQuality: string;
          sampleConcentration?: number | null;
          notes?: string | null;
          createdAt: TimestampString;
          updatedAt?: TimestampString | null;
  } & Sample_Key)[];
}

export interface GetBookingSamplesVariables {
  bookingId: string;
}

export interface GetBookingStatsData {
  bookings: ({
    id: string;
    totalAmount: number;
    createdAt: TimestampString;
  } & Booking_Key)[];
}

export interface GetBookingTestResultsData {
  testResults: ({
    id: string;
    sample: {
      id: string;
      participant?: {
        name: string;
      };
    } & Sample_Key;
      booking: {
        service: {
          title: string;
        };
      };
        manager?: {
          user: {
            fullname: string;
          };
        };
          testMethod: string;
          positive: boolean;
          accuracy: number;
          testType: string;
          testDate?: DateString | null;
          reportDate?: DateString | null;
          status: string;
          createdAt: TimestampString;
          updatedAt?: TimestampString | null;
  } & TestResult_Key)[];
}

export interface GetBookingTestResultsVariables {
  bookingId: string;
}

export interface GetCustomerSatisfactionStatsData {
  feedbacks: ({
    rating: number;
    createdAt: TimestampString;
  })[];
}

export interface GetFeaturedServicesData {
  services: ({
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    price: number;
    duration: string;
    category: {
      id: string;
      name: string;
      hasLegalValue: boolean;
    } & ServiceCategory_Key;
      icon?: string | null;
      featured: boolean;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Service_Key)[];
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

export interface GetManagerByIdData {
  manager?: {
    id: string;
    user: {
      id: string;
      fullname: string;
      gender?: string | null;
      avatar?: string | null;
      email: string;
      phone?: string | null;
      address?: string | null;
      accountStatus: string;
    } & User_Key;
      hireDate?: DateString | null;
      slot?: number | null;
      specification?: string[] | null;
      certifications?: string[] | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Manager_Key;
}

export interface GetManagerByIdVariables {
  managerId: string;
}

export interface GetManagerTestResultsData {
  testResults: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
        service: {
          title: string;
        };
    };
      sample: {
        participant?: {
          name: string;
        };
      };
        testMethod: string;
        positive: boolean;
        accuracy: number;
        testType: string;
        testDate?: DateString | null;
        reportDate?: DateString | null;
        status: string;
        createdAt: TimestampString;
  } & TestResult_Key)[];
}

export interface GetManagerTestResultsVariables {
  managerId: string;
}

export interface GetManagersBySpecificationData {
  managers: ({
    id: string;
    user: {
      fullname: string;
      email: string;
      phone?: string | null;
    };
      hireDate?: DateString | null;
      slot?: number | null;
      specification?: string[] | null;
      certifications?: string[] | null;
      createdAt: TimestampString;
  } & Manager_Key)[];
}

export interface GetManagersBySpecificationVariables {
  specification: string;
}

export interface GetManagersData {
  managers: ({
    id: string;
    user: {
      id: string;
      fullname: string;
      gender?: string | null;
      avatar?: string | null;
      email: string;
      accountStatus: string;
    } & User_Key;
      hireDate?: DateString | null;
      slot?: number | null;
      specification?: string[] | null;
      certifications?: string[] | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Manager_Key)[];
}

export interface GetMethodByIdData {
  method?: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Method_Key;
}

export interface GetMethodByIdVariables {
  methodId: string;
}

export interface GetMethodsData {
  methods: ({
    id: string;
    name: string;
    description?: string | null;
    price: number;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Method_Key)[];
}

export interface GetMethodsForServiceData {
  serviceMethods: ({
    serviceId: string;
    methodId: string;
    method: {
      id: string;
      name: string;
      description?: string | null;
      price: number;
    } & Method_Key;
      createdAt: TimestampString;
  } & ServiceMethod_Key)[];
}

export interface GetMethodsForServiceVariables {
  serviceId: string;
}

export interface GetMonthlyRevenueData {
  payments: ({
    amount: number;
    paymentDate?: DateString | null;
  })[];
}

export interface GetMonthlyRevenueVariables {
  startDate: DateString;
  endDate: DateString;
}

export interface GetMyBlogsData {
  blogs: ({
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Blog_Key)[];
}

export interface GetMyBookingsData {
  bookings: ({
    id: string;
    totalAmount: number;
    service: {
      id: string;
      title: string;
      description: string;
      duration: string;
      category: {
        name: string;
      };
    } & Service_Key;
      method: {
        id: string;
        name: string;
        description?: string | null;
        price: number;
      } & Method_Key;
        timeSlot?: {
          slotDate: DateString;
          startTime: string;
          endTime: string;
        };
          staff: {
            user: {
              fullname: string;
            };
          };
            createdAt: TimestampString;
  } & Booking_Key)[];
}

export interface GetMyNotificationsData {
  notifications: ({
    id: string;
    staff?: {
      user: {
        fullname: string;
      };
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
        user: {
          fullname: string;
        };
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

export interface GetParticipantByIdData {
  participant?: {
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
      };
        service: {
          title: string;
        };
    } & Booking_Key;
      name: string;
      age: number;
      identification?: string | null;
      gender: string;
      relationship?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Participant_Key;
}

export interface GetParticipantByIdVariables {
  participantId: string;
}

export interface GetParticipantSamplesData {
  samples: ({
    id: string;
    booking: {
      id: string;
      service: {
        title: string;
      };
    } & Booking_Key;
      collectionDate?: DateString | null;
      sampleQuality: string;
      sampleConcentration?: number | null;
      notes?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Sample_Key)[];
}

export interface GetParticipantSamplesVariables {
  participantId: string;
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
      status: string;
      paymentDate?: DateString | null;
      refundDetail?: string | null;
      otherDetails?: string[] | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
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
      paymentDate?: DateString | null;
      refundDetail?: string | null;
      otherDetails?: string[] | null;
      createdAt: TimestampString;
  } & Payment_Key)[];
}

export interface GetPaymentsByStatusVariables {
  status: string;
}

export interface GetPositiveTestResultsData {
  testResults: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
        service: {
          title: string;
        };
    };
      sample: {
        participant?: {
          name: string;
        };
      };
        testMethod: string;
        accuracy: number;
        testType: string;
        testDate?: DateString | null;
        reportDate?: DateString | null;
        status: string;
        createdAt: TimestampString;
  } & TestResult_Key)[];
}

export interface GetRevenueByCategoryData {
  payments: ({
    amount: number;
    booking: {
      service: {
        category: {
          name: string;
        };
      };
    };
      paymentDate?: DateString | null;
  })[];
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
        service: {
          title: string;
          description: string;
          category: {
            name: string;
          };
        };
          method: {
            name: string;
          };
    } & Booking_Key;
      staff?: {
        user: {
          fullname: string;
        };
      };
        participant?: {
          name: string;
          age: number;
          gender: string;
          identification?: string | null;
          relationship?: string | null;
        };
          collectionDate?: DateString | null;
          sampleQuality: string;
          sampleConcentration?: number | null;
          notes?: string | null;
          createdAt: TimestampString;
          updatedAt?: TimestampString | null;
  } & Sample_Key;
}

export interface GetSampleByIdVariables {
  sampleId: string;
}

export interface GetSamplesByQualityData {
  samples: ({
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
      };
        service: {
          title: string;
          category: {
            name: string;
          };
        };
    } & Booking_Key;
      staff?: {
        user: {
          fullname: string;
        };
      };
        participant?: {
          name: string;
          age: number;
          gender: string;
        };
          collectionDate?: DateString | null;
          sampleQuality: string;
          sampleConcentration?: number | null;
          notes?: string | null;
          createdAt: TimestampString;
  } & Sample_Key)[];
}

export interface GetSamplesByQualityVariables {
  sampleQuality: string;
}

export interface GetServiceByIdData {
  service?: {
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    price: number;
    duration: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
      description?: string | null;
      hasLegalValue: boolean;
    } & ServiceCategory_Key;
      icon?: string | null;
      featured: boolean;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Service_Key;
}

export interface GetServiceByIdVariables {
  serviceId: string;
}

export interface GetServiceCategoriesData {
  serviceCategories: ({
    id: string;
    name: string;
    description?: string | null;
    hasLegalValue: boolean;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & ServiceCategory_Key)[];
}

export interface GetServiceCategoryByIdData {
  serviceCategory?: {
    id: string;
    name: string;
    description?: string | null;
    hasLegalValue: boolean;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & ServiceCategory_Key;
}

export interface GetServiceCategoryByIdVariables {
  categoryId: string;
}

export interface GetServiceMethodData {
  serviceMethod?: {
    serviceId: string;
    methodId: string;
    service: {
      id: string;
      title: string;
      description: string;
      price: number;
    } & Service_Key;
      method: {
        id: string;
        name: string;
        description?: string | null;
        price: number;
      } & Method_Key;
        createdAt: TimestampString;
        updatedAt?: TimestampString | null;
  } & ServiceMethod_Key;
}

export interface GetServiceMethodVariables {
  serviceId: string;
  methodId: string;
}

export interface GetServiceMethodsData {
  serviceMethods: ({
    serviceId: string;
    methodId: string;
    service: {
      id: string;
      title: string;
    } & Service_Key;
      method: {
        id: string;
        name: string;
        description?: string | null;
        price: number;
      } & Method_Key;
        createdAt: TimestampString;
        updatedAt?: TimestampString | null;
  } & ServiceMethod_Key)[];
}

export interface GetServiceMethodsVariables {
  serviceId: string;
}

export interface GetServicePopularityData {
  bookings: ({
    service: {
      id: string;
      title: string;
    } & Service_Key;
  })[];
}

export interface GetServiceWithMethodsData {
  service?: {
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    price: number;
    duration: string;
    category: {
      id: string;
      name: string;
      description?: string | null;
      hasLegalValue: boolean;
    } & ServiceCategory_Key;
      icon?: string | null;
      featured: boolean;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Service_Key;
    serviceMethods: ({
      serviceId: string;
      methodId: string;
      method: {
        id: string;
        name: string;
        description?: string | null;
        price: number;
      } & Method_Key;
        createdAt: TimestampString;
    } & ServiceMethod_Key)[];
}

export interface GetServiceWithMethodsVariables {
  serviceId: string;
}

export interface GetServicesByCategoryData {
  services: ({
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    price: number;
    duration: string;
    category: {
      id: string;
      name: string;
      hasLegalValue: boolean;
    } & ServiceCategory_Key;
      icon?: string | null;
      featured: boolean;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Service_Key)[];
}

export interface GetServicesByCategoryVariables {
  categoryId: string;
}

export interface GetServicesData {
  services: ({
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    price: number;
    duration: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
      description?: string | null;
      hasLegalValue: boolean;
    } & ServiceCategory_Key;
      icon?: string | null;
      featured: boolean;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Service_Key)[];
}

export interface GetServicesForMethodData {
  serviceMethods: ({
    serviceId: string;
    methodId: string;
    service: {
      id: string;
      title: string;
      description: string;
      price: number;
      duration: string;
      category: {
        name: string;
        hasLegalValue: boolean;
      };
        icon?: string | null;
        featured: boolean;
    } & Service_Key;
      createdAt: TimestampString;
  } & ServiceMethod_Key)[];
}

export interface GetServicesForMethodVariables {
  methodId: string;
}

export interface GetStaffBookingsData {
  bookings: ({
    id: string;
    user: {
      fullname: string;
      email: string;
      phone?: string | null;
    };
      totalAmount: number;
      service: {
        id: string;
        title: string;
        category: {
          name: string;
        };
      } & Service_Key;
        method: {
          name: string;
          price: number;
        };
          timeSlot?: {
            slotDate: DateString;
            startTime: string;
            endTime: string;
          };
            createdAt: TimestampString;
  } & Booking_Key)[];
}

export interface GetStaffBookingsVariables {
  staffId: string;
}

export interface GetStaffByIdData {
  staff?: {
    id: string;
    user: {
      id: string;
      fullname: string;
      gender?: string | null;
      avatar?: string | null;
      email: string;
      phone?: string | null;
      address?: string | null;
      accountStatus: string;
    } & User_Key;
      hireDate?: DateString | null;
      slot?: number | null;
      specification?: string[] | null;
      certifications?: string[] | null;
      position?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Staff_Key;
}

export interface GetStaffByIdVariables {
  staffId: string;
}

export interface GetStaffBySpecificationData {
  staffs: ({
    id: string;
    user: {
      fullname: string;
      email: string;
      phone?: string | null;
    };
      hireDate?: DateString | null;
      slot?: number | null;
      specification?: string[] | null;
      certifications?: string[] | null;
      position?: string | null;
      createdAt: TimestampString;
  } & Staff_Key)[];
}

export interface GetStaffBySpecificationVariables {
  specification: string;
}

export interface GetStaffMembersData {
  staffs: ({
    id: string;
    user: {
      id: string;
      fullname: string;
      gender?: string | null;
      avatar?: string | null;
      email: string;
      accountStatus: string;
    } & User_Key;
      hireDate?: DateString | null;
      slot?: number | null;
      specification?: string[] | null;
      certifications?: string[] | null;
      position?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Staff_Key)[];
}

export interface GetStaffSamplesData {
  samples: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
        service: {
          title: string;
          category: {
            name: string;
          };
        };
    };
      participant?: {
        name: string;
        age: number;
        gender: string;
      };
        collectionDate?: DateString | null;
        sampleQuality: string;
        sampleConcentration?: number | null;
        notes?: string | null;
        createdAt: TimestampString;
  } & Sample_Key)[];
}

export interface GetStaffSamplesVariables {
  staffId: string;
}

export interface GetStaffWorkloadData {
  staffs: ({
    id: string;
    user: {
      fullname: string;
    };
      slot?: number | null;
  } & Staff_Key)[];
    bookings: ({
      staffId: string;
      createdAt: TimestampString;
    })[];
}

export interface GetTestCompletionStatsData {
  testResults: ({
    id: string;
    status: string;
    testDate?: DateString | null;
    reportDate?: DateString | null;
  } & TestResult_Key)[];
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
        service: {
          title: string;
          description: string;
        };
          method: {
            name: string;
          };
    } & Booking_Key;
      sample: {
        id: string;
        collectionDate?: DateString | null;
        participant?: {
          name: string;
          age: number;
          gender: string;
        };
      } & Sample_Key;
        manager?: {
          user: {
            fullname: string;
          };
        };
          testMethod: string;
          positive: boolean;
          accuracy: number;
          testType: string;
          testDate?: DateString | null;
          reportDate?: DateString | null;
          resultData?: string | null;
          resultNotes?: string | null;
          status: string;
          createdAt: TimestampString;
          updatedAt?: TimestampString | null;
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
        service: {
          title: string;
        };
    };
      sample: {
        participant?: {
          name: string;
        };
      };
        manager?: {
          user: {
            fullname: string;
          };
        };
          testMethod: string;
          positive: boolean;
          accuracy: number;
          testType: string;
          testDate?: DateString | null;
          reportDate?: DateString | null;
          status: string;
          createdAt: TimestampString;
  } & TestResult_Key)[];
}

export interface GetTestResultsByStatusVariables {
  status: string;
}

export interface GetTestResultsByTypeData {
  testResults: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
        service: {
          title: string;
        };
    };
      testMethod: string;
      positive: boolean;
      accuracy: number;
      testDate?: DateString | null;
      status: string;
      createdAt: TimestampString;
  } & TestResult_Key)[];
}

export interface GetTestResultsByTypeVariables {
  testType: string;
}

export interface GetTimeSlotByIdData {
  timeSlot?: {
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    currentBookings: number;
    notes?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & TimeSlot_Key;
}

export interface GetTimeSlotByIdVariables {
  timeSlotId: string;
}

export interface GetTimeSlotsData {
  timeSlots: ({
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    currentBookings: number;
    notes?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & TimeSlot_Key)[];
}

export interface GetTimeSlotsInRangeData {
  timeSlots: ({
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    currentBookings: number;
    notes?: string | null;
    createdAt: TimestampString;
  } & TimeSlot_Key)[];
}

export interface GetTimeSlotsInRangeVariables {
  startDate: DateString;
  endDate: DateString;
}

export interface GetTimeSlotsVariables {
  slotDate: DateString;
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
    totalAmount: number;
    service: {
      id: string;
      title: string;
      description: string;
      category: {
        name: string;
      };
    } & Service_Key;
      method: {
        id: string;
        name: string;
        description?: string | null;
        price: number;
      } & Method_Key;
        timeSlot?: {
          slotDate: DateString;
          startTime: string;
          endTime: string;
        };
          staff: {
            user: {
              fullname: string;
            };
          };
            createdAt: TimestampString;
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
    address?: string | null;
    roleId: string;
    role: {
      id: string;
      name: string;
      description?: string | null;
    } & Role_Key;
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
    address?: string | null;
    roleId: string;
    role: {
      id: string;
      name: string;
      description?: string | null;
    } & Role_Key;
      createdAt: TimestampString;
      lastLogin?: TimestampString | null;
  } & User_Key;
}

export interface GetUserNotificationsData {
  notifications: ({
    id: string;
    staff?: {
      user: {
        fullname: string;
      };
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
    refundDetail?: string | null;
    otherDetails?: string[] | null;
    createdAt: TimestampString;
  } & Payment_Key)[];
}

export interface GetUserPaymentsVariables {
  userId: string;
}

export interface GetUserTestResultsData {
  testResults: ({
    id: string;
    booking: {
      service: {
        title: string;
      };
    };
      testMethod: string;
      positive: boolean;
      accuracy: number;
      testType: string;
      testDate?: DateString | null;
      reportDate?: DateString | null;
      status: string;
      createdAt: TimestampString;
  } & TestResult_Key)[];
}

export interface GetUserTestResultsVariables {
  userId: string;
}

export interface GetUsersByRoleData {
  users: ({
    id: string;
    fullname: string;
    gender?: string | null;
    avatar?: string | null;
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
    gender?: string | null;
    avatar?: string | null;
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

export interface Manager_Key {
  id: string;
  __typename?: 'Manager_Key';
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

export interface Method_Key {
  id: string;
  __typename?: 'Method_Key';
}

export interface Notification_Key {
  id: string;
  __typename?: 'Notification_Key';
}

export interface Participant_Key {
  id: string;
  __typename?: 'Participant_Key';
}

export interface Payment_Key {
  id: string;
  __typename?: 'Payment_Key';
}

export interface Role_Key {
  id: string;
  __typename?: 'Role_Key';
}

export interface Sample_Key {
  id: string;
  __typename?: 'Sample_Key';
}

export interface ServiceCategory_Key {
  id: string;
  __typename?: 'ServiceCategory_Key';
}

export interface ServiceMethod_Key {
  serviceId: string;
  methodId: string;
  __typename?: 'ServiceMethod_Key';
}

export interface Service_Key {
  id: string;
  __typename?: 'Service_Key';
}

export interface Staff_Key {
  id: string;
  __typename?: 'Staff_Key';
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
  title?: string | null;
  content?: string | null;
  imageUrl?: string | null;
}

export interface UpdateBookingData {
  booking_update?: Booking_Key | null;
}

export interface UpdateBookingHistoryData {
  bookingHistory_update?: BookingHistory_Key | null;
}

export interface UpdateBookingHistoryVariables {
  historyId: string;
  description?: string | null;
  status?: string | null;
}

export interface UpdateBookingVariables {
  bookingId: string;
  staffId?: string | null;
  timeSlotId?: string | null;
  serviceId?: string | null;
  methodId?: string | null;
  totalAmount?: number | null;
}

export interface UpdateFeedbackData {
  feedback_update?: Feedback_Key | null;
}

export interface UpdateFeedbackVariables {
  feedbackId: string;
  rating?: number | null;
  comment?: string | null;
}

export interface UpdateManagerData {
  manager_update?: Manager_Key | null;
}

export interface UpdateManagerVariables {
  managerId: string;
  hireDate?: DateString | null;
  slot?: number | null;
  specification?: string[] | null;
  certifications?: string[] | null;
}

export interface UpdateMethodData {
  method_update?: Method_Key | null;
}

export interface UpdateMethodVariables {
  methodId: string;
  name?: string | null;
  description?: string | null;
  price?: number | null;
}

export interface UpdateParticipantData {
  participant_update?: Participant_Key | null;
}

export interface UpdateParticipantVariables {
  participantId: string;
  name?: string | null;
  age?: number | null;
  identification?: string | null;
  gender?: string | null;
  relationship?: string | null;
}

export interface UpdatePaymentStatusData {
  payment_update?: Payment_Key | null;
}

export interface UpdatePaymentStatusVariables {
  paymentId: string;
  status: string;
  paymentDate?: DateString | null;
}

export interface UpdateRefundDetailData {
  payment_update?: Payment_Key | null;
}

export interface UpdateRefundDetailVariables {
  paymentId: string;
  refundDetail: string;
}

export interface UpdateRoleData {
  role_update?: Role_Key | null;
}

export interface UpdateRoleVariables {
  roleId: string;
  name?: string | null;
  description?: string | null;
}

export interface UpdateSampleData {
  sample_update?: Sample_Key | null;
}

export interface UpdateSampleVariables {
  sampleId: string;
  staffId?: string | null;
  participantId?: string | null;
  collectionDate?: DateString | null;
  sampleQuality?: string | null;
  sampleConcentration?: number | null;
  notes?: string | null;
}

export interface UpdateServiceCategoryData {
  serviceCategory_update?: ServiceCategory_Key | null;
}

export interface UpdateServiceCategoryVariables {
  categoryId: string;
  name?: string | null;
  description?: string | null;
  hasLegalValue?: boolean | null;
}

export interface UpdateServiceData {
  service_update?: Service_Key | null;
}

export interface UpdateServiceVariables {
  serviceId: string;
  title?: string | null;
  description?: string | null;
  fullDescription?: string | null;
  price?: number | null;
  duration?: string | null;
  categoryId?: string | null;
  icon?: string | null;
  featured?: boolean | null;
}

export interface UpdateStaffData {
  staff_update?: Staff_Key | null;
}

export interface UpdateStaffVariables {
  staffId: string;
  hireDate?: DateString | null;
  slot?: number | null;
  specification?: string[] | null;
  certifications?: string[] | null;
  position?: string | null;
}

export interface UpdateTestResultData {
  testResult_update?: TestResult_Key | null;
}

export interface UpdateTestResultVariables {
  resultId: string;
  testMethod?: string | null;
  positive?: boolean | null;
  accuracy?: number | null;
  testType?: string | null;
  testDate?: DateString | null;
  reportDate?: DateString | null;
  resultData?: string | null;
  resultNotes?: string | null;
  status?: string | null;
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
  notes?: string | null;
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
  address?: string | null;
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

interface CreateStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStaffVariables): MutationRef<CreateStaffData, CreateStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateStaffVariables): MutationRef<CreateStaffData, CreateStaffVariables>;
  operationName: string;
}
export const createStaffRef: CreateStaffRef;

export function createStaff(vars: CreateStaffVariables): MutationPromise<CreateStaffData, CreateStaffVariables>;
export function createStaff(dc: DataConnect, vars: CreateStaffVariables): MutationPromise<CreateStaffData, CreateStaffVariables>;

interface UpdateStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffVariables): MutationRef<UpdateStaffData, UpdateStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStaffVariables): MutationRef<UpdateStaffData, UpdateStaffVariables>;
  operationName: string;
}
export const updateStaffRef: UpdateStaffRef;

export function updateStaff(vars: UpdateStaffVariables): MutationPromise<UpdateStaffData, UpdateStaffVariables>;
export function updateStaff(dc: DataConnect, vars: UpdateStaffVariables): MutationPromise<UpdateStaffData, UpdateStaffVariables>;

interface CreateManagerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateManagerVariables): MutationRef<CreateManagerData, CreateManagerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateManagerVariables): MutationRef<CreateManagerData, CreateManagerVariables>;
  operationName: string;
}
export const createManagerRef: CreateManagerRef;

export function createManager(vars: CreateManagerVariables): MutationPromise<CreateManagerData, CreateManagerVariables>;
export function createManager(dc: DataConnect, vars: CreateManagerVariables): MutationPromise<CreateManagerData, CreateManagerVariables>;

interface UpdateManagerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateManagerVariables): MutationRef<UpdateManagerData, UpdateManagerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateManagerVariables): MutationRef<UpdateManagerData, UpdateManagerVariables>;
  operationName: string;
}
export const updateManagerRef: UpdateManagerRef;

export function updateManager(vars: UpdateManagerVariables): MutationPromise<UpdateManagerData, UpdateManagerVariables>;
export function updateManager(dc: DataConnect, vars: UpdateManagerVariables): MutationPromise<UpdateManagerData, UpdateManagerVariables>;

interface CreateServiceCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceCategoryVariables): MutationRef<CreateServiceCategoryData, CreateServiceCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceCategoryVariables): MutationRef<CreateServiceCategoryData, CreateServiceCategoryVariables>;
  operationName: string;
}
export const createServiceCategoryRef: CreateServiceCategoryRef;

export function createServiceCategory(vars: CreateServiceCategoryVariables): MutationPromise<CreateServiceCategoryData, CreateServiceCategoryVariables>;
export function createServiceCategory(dc: DataConnect, vars: CreateServiceCategoryVariables): MutationPromise<CreateServiceCategoryData, CreateServiceCategoryVariables>;

interface UpdateServiceCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceCategoryVariables): MutationRef<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateServiceCategoryVariables): MutationRef<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;
  operationName: string;
}
export const updateServiceCategoryRef: UpdateServiceCategoryRef;

export function updateServiceCategory(vars: UpdateServiceCategoryVariables): MutationPromise<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;
export function updateServiceCategory(dc: DataConnect, vars: UpdateServiceCategoryVariables): MutationPromise<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;

interface CreateMethodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMethodVariables): MutationRef<CreateMethodData, CreateMethodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMethodVariables): MutationRef<CreateMethodData, CreateMethodVariables>;
  operationName: string;
}
export const createMethodRef: CreateMethodRef;

export function createMethod(vars: CreateMethodVariables): MutationPromise<CreateMethodData, CreateMethodVariables>;
export function createMethod(dc: DataConnect, vars: CreateMethodVariables): MutationPromise<CreateMethodData, CreateMethodVariables>;

interface UpdateMethodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMethodVariables): MutationRef<UpdateMethodData, UpdateMethodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMethodVariables): MutationRef<UpdateMethodData, UpdateMethodVariables>;
  operationName: string;
}
export const updateMethodRef: UpdateMethodRef;

export function updateMethod(vars: UpdateMethodVariables): MutationPromise<UpdateMethodData, UpdateMethodVariables>;
export function updateMethod(dc: DataConnect, vars: UpdateMethodVariables): MutationPromise<UpdateMethodData, UpdateMethodVariables>;

interface CreateServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
  operationName: string;
}
export const createServiceRef: CreateServiceRef;

export function createService(vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;
export function createService(dc: DataConnect, vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface UpdateServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
  operationName: string;
}
export const updateServiceRef: UpdateServiceRef;

export function updateService(vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;
export function updateService(dc: DataConnect, vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;

interface CreateServiceMethodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceMethodVariables): MutationRef<CreateServiceMethodData, CreateServiceMethodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceMethodVariables): MutationRef<CreateServiceMethodData, CreateServiceMethodVariables>;
  operationName: string;
}
export const createServiceMethodRef: CreateServiceMethodRef;

export function createServiceMethod(vars: CreateServiceMethodVariables): MutationPromise<CreateServiceMethodData, CreateServiceMethodVariables>;
export function createServiceMethod(dc: DataConnect, vars: CreateServiceMethodVariables): MutationPromise<CreateServiceMethodData, CreateServiceMethodVariables>;

interface DeleteServiceMethodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceMethodVariables): MutationRef<DeleteServiceMethodData, DeleteServiceMethodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServiceMethodVariables): MutationRef<DeleteServiceMethodData, DeleteServiceMethodVariables>;
  operationName: string;
}
export const deleteServiceMethodRef: DeleteServiceMethodRef;

export function deleteServiceMethod(vars: DeleteServiceMethodVariables): MutationPromise<DeleteServiceMethodData, DeleteServiceMethodVariables>;
export function deleteServiceMethod(dc: DataConnect, vars: DeleteServiceMethodVariables): MutationPromise<DeleteServiceMethodData, DeleteServiceMethodVariables>;

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

interface UpdateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
  operationName: string;
}
export const updateBookingRef: UpdateBookingRef;

export function updateBooking(vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;
export function updateBooking(dc: DataConnect, vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;

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

interface CreateBookingHistoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingHistoryVariables): MutationRef<CreateBookingHistoryData, CreateBookingHistoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBookingHistoryVariables): MutationRef<CreateBookingHistoryData, CreateBookingHistoryVariables>;
  operationName: string;
}
export const createBookingHistoryRef: CreateBookingHistoryRef;

export function createBookingHistory(vars: CreateBookingHistoryVariables): MutationPromise<CreateBookingHistoryData, CreateBookingHistoryVariables>;
export function createBookingHistory(dc: DataConnect, vars: CreateBookingHistoryVariables): MutationPromise<CreateBookingHistoryData, CreateBookingHistoryVariables>;

interface UpdateBookingHistoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingHistoryVariables): MutationRef<UpdateBookingHistoryData, UpdateBookingHistoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBookingHistoryVariables): MutationRef<UpdateBookingHistoryData, UpdateBookingHistoryVariables>;
  operationName: string;
}
export const updateBookingHistoryRef: UpdateBookingHistoryRef;

export function updateBookingHistory(vars: UpdateBookingHistoryVariables): MutationPromise<UpdateBookingHistoryData, UpdateBookingHistoryVariables>;
export function updateBookingHistory(dc: DataConnect, vars: UpdateBookingHistoryVariables): MutationPromise<UpdateBookingHistoryData, UpdateBookingHistoryVariables>;

interface CreateParticipantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateParticipantVariables): MutationRef<CreateParticipantData, CreateParticipantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateParticipantVariables): MutationRef<CreateParticipantData, CreateParticipantVariables>;
  operationName: string;
}
export const createParticipantRef: CreateParticipantRef;

export function createParticipant(vars: CreateParticipantVariables): MutationPromise<CreateParticipantData, CreateParticipantVariables>;
export function createParticipant(dc: DataConnect, vars: CreateParticipantVariables): MutationPromise<CreateParticipantData, CreateParticipantVariables>;

interface UpdateParticipantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateParticipantVariables): MutationRef<UpdateParticipantData, UpdateParticipantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateParticipantVariables): MutationRef<UpdateParticipantData, UpdateParticipantVariables>;
  operationName: string;
}
export const updateParticipantRef: UpdateParticipantRef;

export function updateParticipant(vars: UpdateParticipantVariables): MutationPromise<UpdateParticipantData, UpdateParticipantVariables>;
export function updateParticipant(dc: DataConnect, vars: UpdateParticipantVariables): MutationPromise<UpdateParticipantData, UpdateParticipantVariables>;

interface DeleteParticipantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteParticipantVariables): MutationRef<DeleteParticipantData, DeleteParticipantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteParticipantVariables): MutationRef<DeleteParticipantData, DeleteParticipantVariables>;
  operationName: string;
}
export const deleteParticipantRef: DeleteParticipantRef;

export function deleteParticipant(vars: DeleteParticipantVariables): MutationPromise<DeleteParticipantData, DeleteParticipantVariables>;
export function deleteParticipant(dc: DataConnect, vars: DeleteParticipantVariables): MutationPromise<DeleteParticipantData, DeleteParticipantVariables>;

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

interface UpdateSampleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSampleVariables): MutationRef<UpdateSampleData, UpdateSampleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSampleVariables): MutationRef<UpdateSampleData, UpdateSampleVariables>;
  operationName: string;
}
export const updateSampleRef: UpdateSampleRef;

export function updateSample(vars: UpdateSampleVariables): MutationPromise<UpdateSampleData, UpdateSampleVariables>;
export function updateSample(dc: DataConnect, vars: UpdateSampleVariables): MutationPromise<UpdateSampleData, UpdateSampleVariables>;

interface DeleteSampleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSampleVariables): MutationRef<DeleteSampleData, DeleteSampleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSampleVariables): MutationRef<DeleteSampleData, DeleteSampleVariables>;
  operationName: string;
}
export const deleteSampleRef: DeleteSampleRef;

export function deleteSample(vars: DeleteSampleVariables): MutationPromise<DeleteSampleData, DeleteSampleVariables>;
export function deleteSample(dc: DataConnect, vars: DeleteSampleVariables): MutationPromise<DeleteSampleData, DeleteSampleVariables>;

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

interface AssignTestResultManagerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignTestResultManagerVariables): MutationRef<AssignTestResultManagerData, AssignTestResultManagerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AssignTestResultManagerVariables): MutationRef<AssignTestResultManagerData, AssignTestResultManagerVariables>;
  operationName: string;
}
export const assignTestResultManagerRef: AssignTestResultManagerRef;

export function assignTestResultManager(vars: AssignTestResultManagerVariables): MutationPromise<AssignTestResultManagerData, AssignTestResultManagerVariables>;
export function assignTestResultManager(dc: DataConnect, vars: AssignTestResultManagerVariables): MutationPromise<AssignTestResultManagerData, AssignTestResultManagerVariables>;

interface DeleteTestResultRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTestResultVariables): MutationRef<DeleteTestResultData, DeleteTestResultVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTestResultVariables): MutationRef<DeleteTestResultData, DeleteTestResultVariables>;
  operationName: string;
}
export const deleteTestResultRef: DeleteTestResultRef;

export function deleteTestResult(vars: DeleteTestResultVariables): MutationPromise<DeleteTestResultData, DeleteTestResultVariables>;
export function deleteTestResult(dc: DataConnect, vars: DeleteTestResultVariables): MutationPromise<DeleteTestResultData, DeleteTestResultVariables>;

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

interface AddPaymentDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddPaymentDetailsVariables): MutationRef<AddPaymentDetailsData, AddPaymentDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddPaymentDetailsVariables): MutationRef<AddPaymentDetailsData, AddPaymentDetailsVariables>;
  operationName: string;
}
export const addPaymentDetailsRef: AddPaymentDetailsRef;

export function addPaymentDetails(vars: AddPaymentDetailsVariables): MutationPromise<AddPaymentDetailsData, AddPaymentDetailsVariables>;
export function addPaymentDetails(dc: DataConnect, vars: AddPaymentDetailsVariables): MutationPromise<AddPaymentDetailsData, AddPaymentDetailsVariables>;

interface UpdateRefundDetailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRefundDetailVariables): MutationRef<UpdateRefundDetailData, UpdateRefundDetailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateRefundDetailVariables): MutationRef<UpdateRefundDetailData, UpdateRefundDetailVariables>;
  operationName: string;
}
export const updateRefundDetailRef: UpdateRefundDetailRef;

export function updateRefundDetail(vars: UpdateRefundDetailVariables): MutationPromise<UpdateRefundDetailData, UpdateRefundDetailVariables>;
export function updateRefundDetail(dc: DataConnect, vars: UpdateRefundDetailVariables): MutationPromise<UpdateRefundDetailData, UpdateRefundDetailVariables>;

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

interface DeleteServiceCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceCategoryVariables): MutationRef<DeleteServiceCategoryData, DeleteServiceCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServiceCategoryVariables): MutationRef<DeleteServiceCategoryData, DeleteServiceCategoryVariables>;
  operationName: string;
}
export const deleteServiceCategoryRef: DeleteServiceCategoryRef;

export function deleteServiceCategory(vars: DeleteServiceCategoryVariables): MutationPromise<DeleteServiceCategoryData, DeleteServiceCategoryVariables>;
export function deleteServiceCategory(dc: DataConnect, vars: DeleteServiceCategoryVariables): MutationPromise<DeleteServiceCategoryData, DeleteServiceCategoryVariables>;

interface DeleteMethodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMethodVariables): MutationRef<DeleteMethodData, DeleteMethodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteMethodVariables): MutationRef<DeleteMethodData, DeleteMethodVariables>;
  operationName: string;
}
export const deleteMethodRef: DeleteMethodRef;

export function deleteMethod(vars: DeleteMethodVariables): MutationPromise<DeleteMethodData, DeleteMethodVariables>;
export function deleteMethod(dc: DataConnect, vars: DeleteMethodVariables): MutationPromise<DeleteMethodData, DeleteMethodVariables>;

interface DeleteServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceVariables): MutationRef<DeleteServiceData, DeleteServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServiceVariables): MutationRef<DeleteServiceData, DeleteServiceVariables>;
  operationName: string;
}
export const deleteServiceRef: DeleteServiceRef;

export function deleteService(vars: DeleteServiceVariables): MutationPromise<DeleteServiceData, DeleteServiceVariables>;
export function deleteService(dc: DataConnect, vars: DeleteServiceVariables): MutationPromise<DeleteServiceData, DeleteServiceVariables>;

interface DeleteTimeSlotRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTimeSlotVariables): MutationRef<DeleteTimeSlotData, DeleteTimeSlotVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTimeSlotVariables): MutationRef<DeleteTimeSlotData, DeleteTimeSlotVariables>;
  operationName: string;
}
export const deleteTimeSlotRef: DeleteTimeSlotRef;

export function deleteTimeSlot(vars: DeleteTimeSlotVariables): MutationPromise<DeleteTimeSlotData, DeleteTimeSlotVariables>;
export function deleteTimeSlot(dc: DataConnect, vars: DeleteTimeSlotVariables): MutationPromise<DeleteTimeSlotData, DeleteTimeSlotVariables>;

interface DeleteBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBookingVariables): MutationRef<DeleteBookingData, DeleteBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBookingVariables): MutationRef<DeleteBookingData, DeleteBookingVariables>;
  operationName: string;
}
export const deleteBookingRef: DeleteBookingRef;

export function deleteBooking(vars: DeleteBookingVariables): MutationPromise<DeleteBookingData, DeleteBookingVariables>;
export function deleteBooking(dc: DataConnect, vars: DeleteBookingVariables): MutationPromise<DeleteBookingData, DeleteBookingVariables>;

interface DeleteStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStaffVariables): MutationRef<DeleteStaffData, DeleteStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteStaffVariables): MutationRef<DeleteStaffData, DeleteStaffVariables>;
  operationName: string;
}
export const deleteStaffRef: DeleteStaffRef;

export function deleteStaff(vars: DeleteStaffVariables): MutationPromise<DeleteStaffData, DeleteStaffVariables>;
export function deleteStaff(dc: DataConnect, vars: DeleteStaffVariables): MutationPromise<DeleteStaffData, DeleteStaffVariables>;

interface DeleteManagerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteManagerVariables): MutationRef<DeleteManagerData, DeleteManagerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteManagerVariables): MutationRef<DeleteManagerData, DeleteManagerVariables>;
  operationName: string;
}
export const deleteManagerRef: DeleteManagerRef;

export function deleteManager(vars: DeleteManagerVariables): MutationPromise<DeleteManagerData, DeleteManagerVariables>;
export function deleteManager(dc: DataConnect, vars: DeleteManagerVariables): MutationPromise<DeleteManagerData, DeleteManagerVariables>;

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

interface GetStaffByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByIdVariables): QueryRef<GetStaffByIdData, GetStaffByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStaffByIdVariables): QueryRef<GetStaffByIdData, GetStaffByIdVariables>;
  operationName: string;
}
export const getStaffByIdRef: GetStaffByIdRef;

export function getStaffById(vars: GetStaffByIdVariables): QueryPromise<GetStaffByIdData, GetStaffByIdVariables>;
export function getStaffById(dc: DataConnect, vars: GetStaffByIdVariables): QueryPromise<GetStaffByIdData, GetStaffByIdVariables>;

interface GetManagersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetManagersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetManagersData, undefined>;
  operationName: string;
}
export const getManagersRef: GetManagersRef;

export function getManagers(): QueryPromise<GetManagersData, undefined>;
export function getManagers(dc: DataConnect): QueryPromise<GetManagersData, undefined>;

interface GetManagerByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetManagerByIdVariables): QueryRef<GetManagerByIdData, GetManagerByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetManagerByIdVariables): QueryRef<GetManagerByIdData, GetManagerByIdVariables>;
  operationName: string;
}
export const getManagerByIdRef: GetManagerByIdRef;

export function getManagerById(vars: GetManagerByIdVariables): QueryPromise<GetManagerByIdData, GetManagerByIdVariables>;
export function getManagerById(dc: DataConnect, vars: GetManagerByIdVariables): QueryPromise<GetManagerByIdData, GetManagerByIdVariables>;

interface GetServiceCategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetServiceCategoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetServiceCategoriesData, undefined>;
  operationName: string;
}
export const getServiceCategoriesRef: GetServiceCategoriesRef;

export function getServiceCategories(): QueryPromise<GetServiceCategoriesData, undefined>;
export function getServiceCategories(dc: DataConnect): QueryPromise<GetServiceCategoriesData, undefined>;

interface GetServiceCategoryByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceCategoryByIdVariables): QueryRef<GetServiceCategoryByIdData, GetServiceCategoryByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServiceCategoryByIdVariables): QueryRef<GetServiceCategoryByIdData, GetServiceCategoryByIdVariables>;
  operationName: string;
}
export const getServiceCategoryByIdRef: GetServiceCategoryByIdRef;

export function getServiceCategoryById(vars: GetServiceCategoryByIdVariables): QueryPromise<GetServiceCategoryByIdData, GetServiceCategoryByIdVariables>;
export function getServiceCategoryById(dc: DataConnect, vars: GetServiceCategoryByIdVariables): QueryPromise<GetServiceCategoryByIdData, GetServiceCategoryByIdVariables>;

interface GetMethodsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMethodsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMethodsData, undefined>;
  operationName: string;
}
export const getMethodsRef: GetMethodsRef;

export function getMethods(): QueryPromise<GetMethodsData, undefined>;
export function getMethods(dc: DataConnect): QueryPromise<GetMethodsData, undefined>;

interface GetMethodByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMethodByIdVariables): QueryRef<GetMethodByIdData, GetMethodByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMethodByIdVariables): QueryRef<GetMethodByIdData, GetMethodByIdVariables>;
  operationName: string;
}
export const getMethodByIdRef: GetMethodByIdRef;

export function getMethodById(vars: GetMethodByIdVariables): QueryPromise<GetMethodByIdData, GetMethodByIdVariables>;
export function getMethodById(dc: DataConnect, vars: GetMethodByIdVariables): QueryPromise<GetMethodByIdData, GetMethodByIdVariables>;

interface GetServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetServicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetServicesData, undefined>;
  operationName: string;
}
export const getServicesRef: GetServicesRef;

export function getServices(): QueryPromise<GetServicesData, undefined>;
export function getServices(dc: DataConnect): QueryPromise<GetServicesData, undefined>;

interface GetServiceByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceByIdVariables): QueryRef<GetServiceByIdData, GetServiceByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServiceByIdVariables): QueryRef<GetServiceByIdData, GetServiceByIdVariables>;
  operationName: string;
}
export const getServiceByIdRef: GetServiceByIdRef;

export function getServiceById(vars: GetServiceByIdVariables): QueryPromise<GetServiceByIdData, GetServiceByIdVariables>;
export function getServiceById(dc: DataConnect, vars: GetServiceByIdVariables): QueryPromise<GetServiceByIdData, GetServiceByIdVariables>;

interface GetServicesByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServicesByCategoryVariables): QueryRef<GetServicesByCategoryData, GetServicesByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServicesByCategoryVariables): QueryRef<GetServicesByCategoryData, GetServicesByCategoryVariables>;
  operationName: string;
}
export const getServicesByCategoryRef: GetServicesByCategoryRef;

export function getServicesByCategory(vars: GetServicesByCategoryVariables): QueryPromise<GetServicesByCategoryData, GetServicesByCategoryVariables>;
export function getServicesByCategory(dc: DataConnect, vars: GetServicesByCategoryVariables): QueryPromise<GetServicesByCategoryData, GetServicesByCategoryVariables>;

interface GetFeaturedServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetFeaturedServicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetFeaturedServicesData, undefined>;
  operationName: string;
}
export const getFeaturedServicesRef: GetFeaturedServicesRef;

export function getFeaturedServices(): QueryPromise<GetFeaturedServicesData, undefined>;
export function getFeaturedServices(dc: DataConnect): QueryPromise<GetFeaturedServicesData, undefined>;

interface GetServiceMethodsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceMethodsVariables): QueryRef<GetServiceMethodsData, GetServiceMethodsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServiceMethodsVariables): QueryRef<GetServiceMethodsData, GetServiceMethodsVariables>;
  operationName: string;
}
export const getServiceMethodsRef: GetServiceMethodsRef;

export function getServiceMethods(vars: GetServiceMethodsVariables): QueryPromise<GetServiceMethodsData, GetServiceMethodsVariables>;
export function getServiceMethods(dc: DataConnect, vars: GetServiceMethodsVariables): QueryPromise<GetServiceMethodsData, GetServiceMethodsVariables>;

interface GetMethodsForServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMethodsForServiceVariables): QueryRef<GetMethodsForServiceData, GetMethodsForServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMethodsForServiceVariables): QueryRef<GetMethodsForServiceData, GetMethodsForServiceVariables>;
  operationName: string;
}
export const getMethodsForServiceRef: GetMethodsForServiceRef;

export function getMethodsForService(vars: GetMethodsForServiceVariables): QueryPromise<GetMethodsForServiceData, GetMethodsForServiceVariables>;
export function getMethodsForService(dc: DataConnect, vars: GetMethodsForServiceVariables): QueryPromise<GetMethodsForServiceData, GetMethodsForServiceVariables>;

interface GetServicesForMethodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServicesForMethodVariables): QueryRef<GetServicesForMethodData, GetServicesForMethodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServicesForMethodVariables): QueryRef<GetServicesForMethodData, GetServicesForMethodVariables>;
  operationName: string;
}
export const getServicesForMethodRef: GetServicesForMethodRef;

export function getServicesForMethod(vars: GetServicesForMethodVariables): QueryPromise<GetServicesForMethodData, GetServicesForMethodVariables>;
export function getServicesForMethod(dc: DataConnect, vars: GetServicesForMethodVariables): QueryPromise<GetServicesForMethodData, GetServicesForMethodVariables>;

interface GetServiceMethodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceMethodVariables): QueryRef<GetServiceMethodData, GetServiceMethodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServiceMethodVariables): QueryRef<GetServiceMethodData, GetServiceMethodVariables>;
  operationName: string;
}
export const getServiceMethodRef: GetServiceMethodRef;

export function getServiceMethod(vars: GetServiceMethodVariables): QueryPromise<GetServiceMethodData, GetServiceMethodVariables>;
export function getServiceMethod(dc: DataConnect, vars: GetServiceMethodVariables): QueryPromise<GetServiceMethodData, GetServiceMethodVariables>;

interface GetServiceWithMethodsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceWithMethodsVariables): QueryRef<GetServiceWithMethodsData, GetServiceWithMethodsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServiceWithMethodsVariables): QueryRef<GetServiceWithMethodsData, GetServiceWithMethodsVariables>;
  operationName: string;
}
export const getServiceWithMethodsRef: GetServiceWithMethodsRef;

export function getServiceWithMethods(vars: GetServiceWithMethodsVariables): QueryPromise<GetServiceWithMethodsData, GetServiceWithMethodsVariables>;
export function getServiceWithMethods(dc: DataConnect, vars: GetServiceWithMethodsVariables): QueryPromise<GetServiceWithMethodsData, GetServiceWithMethodsVariables>;

interface GetTimeSlotsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTimeSlotsVariables): QueryRef<GetTimeSlotsData, GetTimeSlotsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTimeSlotsVariables): QueryRef<GetTimeSlotsData, GetTimeSlotsVariables>;
  operationName: string;
}
export const getTimeSlotsRef: GetTimeSlotsRef;

export function getTimeSlots(vars: GetTimeSlotsVariables): QueryPromise<GetTimeSlotsData, GetTimeSlotsVariables>;
export function getTimeSlots(dc: DataConnect, vars: GetTimeSlotsVariables): QueryPromise<GetTimeSlotsData, GetTimeSlotsVariables>;

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

interface GetBookingHistoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingHistoryVariables): QueryRef<GetBookingHistoryData, GetBookingHistoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingHistoryVariables): QueryRef<GetBookingHistoryData, GetBookingHistoryVariables>;
  operationName: string;
}
export const getBookingHistoryRef: GetBookingHistoryRef;

export function getBookingHistory(vars: GetBookingHistoryVariables): QueryPromise<GetBookingHistoryData, GetBookingHistoryVariables>;
export function getBookingHistory(dc: DataConnect, vars: GetBookingHistoryVariables): QueryPromise<GetBookingHistoryData, GetBookingHistoryVariables>;

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

interface GetBookingParticipantsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingParticipantsVariables): QueryRef<GetBookingParticipantsData, GetBookingParticipantsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingParticipantsVariables): QueryRef<GetBookingParticipantsData, GetBookingParticipantsVariables>;
  operationName: string;
}
export const getBookingParticipantsRef: GetBookingParticipantsRef;

export function getBookingParticipants(vars: GetBookingParticipantsVariables): QueryPromise<GetBookingParticipantsData, GetBookingParticipantsVariables>;
export function getBookingParticipants(dc: DataConnect, vars: GetBookingParticipantsVariables): QueryPromise<GetBookingParticipantsData, GetBookingParticipantsVariables>;

interface GetParticipantByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetParticipantByIdVariables): QueryRef<GetParticipantByIdData, GetParticipantByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetParticipantByIdVariables): QueryRef<GetParticipantByIdData, GetParticipantByIdVariables>;
  operationName: string;
}
export const getParticipantByIdRef: GetParticipantByIdRef;

export function getParticipantById(vars: GetParticipantByIdVariables): QueryPromise<GetParticipantByIdData, GetParticipantByIdVariables>;
export function getParticipantById(dc: DataConnect, vars: GetParticipantByIdVariables): QueryPromise<GetParticipantByIdData, GetParticipantByIdVariables>;

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

interface GetSamplesByQualityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSamplesByQualityVariables): QueryRef<GetSamplesByQualityData, GetSamplesByQualityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSamplesByQualityVariables): QueryRef<GetSamplesByQualityData, GetSamplesByQualityVariables>;
  operationName: string;
}
export const getSamplesByQualityRef: GetSamplesByQualityRef;

export function getSamplesByQuality(vars: GetSamplesByQualityVariables): QueryPromise<GetSamplesByQualityData, GetSamplesByQualityVariables>;
export function getSamplesByQuality(dc: DataConnect, vars: GetSamplesByQualityVariables): QueryPromise<GetSamplesByQualityData, GetSamplesByQualityVariables>;

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

interface GetParticipantSamplesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetParticipantSamplesVariables): QueryRef<GetParticipantSamplesData, GetParticipantSamplesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetParticipantSamplesVariables): QueryRef<GetParticipantSamplesData, GetParticipantSamplesVariables>;
  operationName: string;
}
export const getParticipantSamplesRef: GetParticipantSamplesRef;

export function getParticipantSamples(vars: GetParticipantSamplesVariables): QueryPromise<GetParticipantSamplesData, GetParticipantSamplesVariables>;
export function getParticipantSamples(dc: DataConnect, vars: GetParticipantSamplesVariables): QueryPromise<GetParticipantSamplesData, GetParticipantSamplesVariables>;

interface GetAllSamplesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetAllSamplesVariables): QueryRef<GetAllSamplesData, GetAllSamplesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: GetAllSamplesVariables): QueryRef<GetAllSamplesData, GetAllSamplesVariables>;
  operationName: string;
}
export const getAllSamplesRef: GetAllSamplesRef;

export function getAllSamples(vars?: GetAllSamplesVariables): QueryPromise<GetAllSamplesData, GetAllSamplesVariables>;
export function getAllSamples(dc: DataConnect, vars?: GetAllSamplesVariables): QueryPromise<GetAllSamplesData, GetAllSamplesVariables>;

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

interface GetManagerTestResultsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetManagerTestResultsVariables): QueryRef<GetManagerTestResultsData, GetManagerTestResultsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetManagerTestResultsVariables): QueryRef<GetManagerTestResultsData, GetManagerTestResultsVariables>;
  operationName: string;
}
export const getManagerTestResultsRef: GetManagerTestResultsRef;

export function getManagerTestResults(vars: GetManagerTestResultsVariables): QueryPromise<GetManagerTestResultsData, GetManagerTestResultsVariables>;
export function getManagerTestResults(dc: DataConnect, vars: GetManagerTestResultsVariables): QueryPromise<GetManagerTestResultsData, GetManagerTestResultsVariables>;

interface GetTestResultsByTypeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTestResultsByTypeVariables): QueryRef<GetTestResultsByTypeData, GetTestResultsByTypeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTestResultsByTypeVariables): QueryRef<GetTestResultsByTypeData, GetTestResultsByTypeVariables>;
  operationName: string;
}
export const getTestResultsByTypeRef: GetTestResultsByTypeRef;

export function getTestResultsByType(vars: GetTestResultsByTypeVariables): QueryPromise<GetTestResultsByTypeData, GetTestResultsByTypeVariables>;
export function getTestResultsByType(dc: DataConnect, vars: GetTestResultsByTypeVariables): QueryPromise<GetTestResultsByTypeData, GetTestResultsByTypeVariables>;

interface GetPositiveTestResultsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPositiveTestResultsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPositiveTestResultsData, undefined>;
  operationName: string;
}
export const getPositiveTestResultsRef: GetPositiveTestResultsRef;

export function getPositiveTestResults(): QueryPromise<GetPositiveTestResultsData, undefined>;
export function getPositiveTestResults(dc: DataConnect): QueryPromise<GetPositiveTestResultsData, undefined>;

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

interface GetStaffBySpecificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffBySpecificationVariables): QueryRef<GetStaffBySpecificationData, GetStaffBySpecificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStaffBySpecificationVariables): QueryRef<GetStaffBySpecificationData, GetStaffBySpecificationVariables>;
  operationName: string;
}
export const getStaffBySpecificationRef: GetStaffBySpecificationRef;

export function getStaffBySpecification(vars: GetStaffBySpecificationVariables): QueryPromise<GetStaffBySpecificationData, GetStaffBySpecificationVariables>;
export function getStaffBySpecification(dc: DataConnect, vars: GetStaffBySpecificationVariables): QueryPromise<GetStaffBySpecificationData, GetStaffBySpecificationVariables>;

interface GetAvailableStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAvailableStaffData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAvailableStaffData, undefined>;
  operationName: string;
}
export const getAvailableStaffRef: GetAvailableStaffRef;

export function getAvailableStaff(): QueryPromise<GetAvailableStaffData, undefined>;
export function getAvailableStaff(dc: DataConnect): QueryPromise<GetAvailableStaffData, undefined>;

interface GetManagersBySpecificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetManagersBySpecificationVariables): QueryRef<GetManagersBySpecificationData, GetManagersBySpecificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetManagersBySpecificationVariables): QueryRef<GetManagersBySpecificationData, GetManagersBySpecificationVariables>;
  operationName: string;
}
export const getManagersBySpecificationRef: GetManagersBySpecificationRef;

export function getManagersBySpecification(vars: GetManagersBySpecificationVariables): QueryPromise<GetManagersBySpecificationData, GetManagersBySpecificationVariables>;
export function getManagersBySpecification(dc: DataConnect, vars: GetManagersBySpecificationVariables): QueryPromise<GetManagersBySpecificationData, GetManagersBySpecificationVariables>;

interface GetBookingCountByDateRangeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingCountByDateRangeVariables): QueryRef<GetBookingCountByDateRangeData, GetBookingCountByDateRangeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingCountByDateRangeVariables): QueryRef<GetBookingCountByDateRangeData, GetBookingCountByDateRangeVariables>;
  operationName: string;
}
export const getBookingCountByDateRangeRef: GetBookingCountByDateRangeRef;

export function getBookingCountByDateRange(vars: GetBookingCountByDateRangeVariables): QueryPromise<GetBookingCountByDateRangeData, GetBookingCountByDateRangeVariables>;
export function getBookingCountByDateRange(dc: DataConnect, vars: GetBookingCountByDateRangeVariables): QueryPromise<GetBookingCountByDateRangeData, GetBookingCountByDateRangeVariables>;

interface GetRevenueByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetRevenueByCategoryData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetRevenueByCategoryData, undefined>;
  operationName: string;
}
export const getRevenueByCategoryRef: GetRevenueByCategoryRef;

export function getRevenueByCategory(): QueryPromise<GetRevenueByCategoryData, undefined>;
export function getRevenueByCategory(dc: DataConnect): QueryPromise<GetRevenueByCategoryData, undefined>;

interface GetStaffWorkloadRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetStaffWorkloadData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetStaffWorkloadData, undefined>;
  operationName: string;
}
export const getStaffWorkloadRef: GetStaffWorkloadRef;

export function getStaffWorkload(): QueryPromise<GetStaffWorkloadData, undefined>;
export function getStaffWorkload(dc: DataConnect): QueryPromise<GetStaffWorkloadData, undefined>;

interface GetTestCompletionStatsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetTestCompletionStatsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetTestCompletionStatsData, undefined>;
  operationName: string;
}
export const getTestCompletionStatsRef: GetTestCompletionStatsRef;

export function getTestCompletionStats(): QueryPromise<GetTestCompletionStatsData, undefined>;
export function getTestCompletionStats(dc: DataConnect): QueryPromise<GetTestCompletionStatsData, undefined>;

interface GetCustomerSatisfactionStatsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCustomerSatisfactionStatsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCustomerSatisfactionStatsData, undefined>;
  operationName: string;
}
export const getCustomerSatisfactionStatsRef: GetCustomerSatisfactionStatsRef;

export function getCustomerSatisfactionStats(): QueryPromise<GetCustomerSatisfactionStatsData, undefined>;
export function getCustomerSatisfactionStats(dc: DataConnect): QueryPromise<GetCustomerSatisfactionStatsData, undefined>;

