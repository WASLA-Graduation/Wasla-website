export interface ReportsData {
  id: number;
  fullName: string;
  email: string;
  message: string;
}
export interface adminUsersData {
  id: string;
  name: string;
  email: string;
  status: number;
  createdAt: string;
}
export interface AdminUsersResponse {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: adminUsersData[];
}

export interface AdminOverviewData {
  completedBookingsCount: number;
  canceledBookingsCount: number;
  countOfUsers: number;
  years: [
    {
      year: number;
      months: [
        {
          month: number;
          amount: number;
        },
      ];
    },
  ];
}

export interface UserBase {
  phone: string;
  birthDay: string;
  profilePhoto: string;
}
export interface ResidentDetails {
  nationalId: string;
}
export interface DoctorDetails {
  experienceYears: number;
  universityName: string;
  graduationYear: number;
  hospitalName: string;
  description: string;
  cv: string;
}
export interface GymDetails {
  businessName: string;
  email: string;
  description: string;
  phones: string[];
  images: string[];
}
export interface RestaurantDetails {
  businessName: string;
  description: string;
  email: string;
  images: string[];
}
export interface TechnicianDetails {
  description: string;
  documents: string[];
  experienceYears: number;
  isAvailable: boolean;
  rate: number;
  specialization: number;
}
export interface RestaurantDetails {
  businessName: string;
  description: string;
  email: string;
  images: string[];
}
export interface DriverDetails {
  carImages: string[];
  drivingExperienceYears: number;
  email: string;
  name: string;
  tripsCount: number;
  vehicleModel: string;
  vehicleNumber: string;
}

export type UserDetailsData =
  | {
      role: "resident";
      userBase: UserBase;
      details: ResidentDetails;
    }
  | {
      role: "doctor";
      userBase: UserBase;
      details: DoctorDetails;
    }
  | {
      role: "gym";
      userBase: UserBase;
      details: GymDetails;
    }
  | {
      role: "driver";
      userBase: UserBase;
      details: DriverDetails;
    }
  | {
      role: "restaurant";
      userBase: UserBase;
      details: RestaurantDetails;
    }
  | {
      role: "technician";
      userBase: UserBase;
      details: TechnicianDetails;
    };
export interface GetUserDetailsResponse {
  success: boolean;
  message: string;
  data: UserDetailsData;
}
export interface Reports{
  id: number,
  reason: string,
  userReportId: string,
  userReportProfile: string,
  userNameReport: string,
  createdAt: string
}

export interface ReportsTargetData{
  targetId: number,
  targetType: number,
  image: string,
  images: string[],
  countReports: number,
  content : string,
  reports : Reports[]
}
export interface addAdminData{
  email: string,
  password: string,
  fullName: string,
  gender: string,
  phone: string
}
export interface allAdminsData{
    id: string,
    fullName: string,
    email: string,
    phone: string,
    status: number // o -> active , 2-> suspend
}
export interface restaurantCategoryData{
    name: {
    english: string,
    arabic: string
  }
}
export interface editrestaurantCategoryData{
  id:number,  
  name: {
    english: string,
    arabic: string
  }
}