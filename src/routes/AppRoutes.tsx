import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";

const Home = lazy(() => import ("../pages/welcomePage/WelcomePage"));
// Auth
const AuthLayout = lazy(() => import ("../components/layouts/AuthLayout"));
const NotFound = lazy(() => import ("../pages/notFound/NotFound"));
const Login = lazy(() => import ("../pages/auth/Login"));
const ForgetPassword = lazy(() => import ("../pages/auth/ForgetPassword"));
const VerifyOTP = lazy(() => import ("../pages/auth/VerifyOTP"));
const ResetPassword = lazy(() => import ("../pages/auth/ResetPassword"));
const SignUp = lazy(() => import ("../pages/auth/SignUp"));
const VerifyEmail = lazy(() => import ("../pages/auth/VerifyEmail"));
const CompleteProfile = lazy(() => import ("../pages/auth/CompleteProfile"));
// main dashboard
const MainDashboard = lazy(() => import ("../pages/dashboard/MainDashboard"));
// resident dashboard
const ResidentDashboard = lazy(() => import ("../components/layouts/ResidentLayout"));
const ResidentProfile = lazy(() => import ("../components/resident/ResidentProfile"));
const ResidentServices = lazy(() => import ("../components/resident/ResidentServices"));
const ServiceBookDoctor = lazy(() => import ("../pages/resident/ServiceBookDoctor"));
const DoctorViewDetailes = lazy(() => import ("../pages/resident/DoctorViewDetailes"));
const ResidentMyBooking = lazy(() => import ("../pages/resident/ResidentMyBooking"));
const ResidentMyFavourites = lazy(() => import ("../pages/resident/ResidentMyFavourites"));
const ServiceBookGyms = lazy(() => import ("../pages/resident/ServiceBookGyms"));
const GymViewDetailes = lazy(() => import ("../pages/resident/GymViewDetails"));
const PaymentSuccessPage = lazy(() => import ("../pages/resident/payments/PaymentSuccessPage"));
const PaymentFailedPage = lazy(() => import ("../pages/resident/payments/PaymentFailedPage"));
const ServiceBookTechnician = lazy(() => import ("../pages/resident/ServiceBookTechnicians"));
const TechnicianViewDetails = lazy(() => import ("../pages/resident/TechnicianViewDetails"));
const ServiceBookRestaurants= lazy(() => import ("../pages/resident/ServiceBookRestaurants"));
const RestaurnatViewDetails = lazy(() => import ("../pages/resident/RestaurantViewDetails"));
// doctor dashboard
const DoctorDashboard = lazy(() => import ("../components/serviceDashboards/DoctorDashboard"));
const DoctorHomeDashboard = lazy(() => import ("../components/doctor/DoctorHomeDahboard"));
const DoctorServiceManage = lazy(() => import ("../components/doctor/DoctorServiceManage"));
const DoctorProfile = lazy(() => import ("../components/doctor/DoctorProfile"));
const ServiceProviderReviews = lazy(() => import ("../components/common/ServiceProviderReviews"));
// Admin dashboard
const AdminDashboard = lazy(() => import ("../components/serviceDashboards/AdminDashboard"));
const AdminReports = lazy(() => import ("../components/admin/AdminReports"));
const AdminManageUsers = lazy(() => import ("../components/admin/AdminManageUsers"));
const AdminOverview = lazy(() => import ("../components/admin/AdminOverview"));
const AdminViewDetails = lazy(() => import ("../components/admin/AdminViewDetails"));
const AdminServiceDashboard = lazy(() => import ("../components/admin/AdminServiceOverview"));
// gym dashboard
const GymDashboard = lazy(() => import ("../components/serviceDashboards/GymDashboard"));
const GymProfile = lazy(() => import ("../components/gym/GymProfile"));
const GymMembers = lazy(() => import ("../components/gym/GymMembers"));
const GymServicesPage = lazy(() => import ("../components/gym/GymServicePage"));
const GymHomeDashboard = lazy(() => import ("../components/gym/GymHomeDashboard"));
// techniican dashboard
const TechnicianDashboardLayout = lazy(() => import ("../components/serviceDashboards/TechnicanDashboard"));
const TechnicianProfile = lazy(() => import ("../components/technician/TechnicianProfile"));
const TechnicianOverView = lazy(() => import ("../components/technician/TechnicianOverView"));
// restaurant dashboard
const RestaurantDashboard = lazy(() => import ("../components/serviceDashboards/RestaurantDashboard"));
const RestaurantProfile = lazy(() => import ("../components/restaurant/RestaurantProfile"));
const RestaurantReversation = lazy(() => import ("../components/restaurant/RestaurantReversation"));
// social media
const CommunityLoader = lazy(() => import ("../pages/community/CommunityLoader"));
const CommunityLayout = lazy(() => import ("../pages/community/CommuintyLayout"));
const ProfileSocialPage = lazy(() => import ("../components/community/ProfileSocialPage"));
const MainFeed = lazy(() => import ("../components/community/MainFeed"));
const SocialSettings = lazy(() => import ("../components/community/SociallSettings"));
const SavedPostsPage = lazy(() => import ("../components/community/SavedPostsPage"));
const CommentPage = lazy(() => import ("../components/community/comments/CommentPage"));
// chat
const ChatLayout = lazy(() => import ("../components/chat/ChatLayout"));
const NewChatPage = lazy(() => import ("../components/chat/NewChatPage"));
const ChatList = lazy(() => import ("../components/chat/ChatList"));
const UserProfileChatPage = lazy(() => import ("../components/chat/UserProfileChatPage"));
const ChatConversationPage = lazy(() => import ("../components/chat/ChatConversationPage"));

export default function AppRoutes() {
  return (
      <Routes>
        {/* welcome page */}
        <Route path="/" element={<Home />} /> 
        {/* not found */}
        <Route path="*" element={<NotFound />} />
        {/* Auth Layout */}
        <Route element={<AuthLayout />} >
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgetPassword />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
        </Route>
          <Route path="/auth/complete-profile" element={<CompleteProfile />} />
        {/* End Auth Layout */}

        {/* main Dashboard */}
          <Route path="/dashboard" element={<MainDashboard />} />
        {/* end main Dashboard */}

        {/* resident Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["resident"]} />}>
          <Route path="/resident" element={<ResidentDashboard />}>
            <Route path="profile" element={<ResidentProfile />} />
            <Route path="profile/my-bookings" element={<ResidentMyBooking />} />
            <Route path="profile/my-favorites" element={<ResidentMyFavourites />} />
            <Route path="service" element={<ResidentServices />} /> 
            <Route path="service/doctors" element={<ServiceBookDoctor />} /> 
            <Route path="service/doctors/:doctorId" element={<DoctorViewDetailes />} /> 
            <Route path="service/gyms" element={<ServiceBookGyms />} /> 
            <Route path="service/gyms/:gymId" element={<GymViewDetailes />} /> 
            <Route path="service/technicians" element={<ServiceBookTechnician />} /> 
            <Route path="service/technicians/:techniciansId" element={<TechnicianViewDetails />} /> 
            <Route path="service/restaurants" element={<ServiceBookRestaurants />} /> 
            <Route path="service/restaurants/:restaurantId" element={<RestaurnatViewDetails />} /> 
          </Route>
            <Route path="/resident/payment-success" element={<PaymentSuccessPage />} /> 
            <Route path="/resident/payment-failed" element={<PaymentFailedPage />} /> 
        </Route>  
        {/* end resident Dashboard */}

        {/* doctor Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
        {/* Doctor layout */}
        <Route path="/doctor" element={<DoctorDashboard />}>
          <Route index element={<Navigate to="manage-dashboard" replace />} />
          <Route path="manage-dashboard" element={<DoctorHomeDashboard />} />
          <Route path="manage-service" element={<DoctorServiceManage />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="reviews" element={<ServiceProviderReviews />} />
        </Route>
      </Route> 
        {/* end doctor Dashboard */}

        {/* admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        {/* aDmin layout */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="manage-users" element={<AdminManageUsers />} />
          <Route path="services-overview" element={<AdminServiceDashboard />} />
          <Route path="manage-users/:userId" element={<AdminViewDetails />} />
        </Route>
      </Route> 
        {/* end admin Dashboard */}

        {/* gym Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["gym"]} />}>
        <Route path="/gym" element={<GymDashboard />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<GymHomeDashboard />} />
          <Route path="services" element={<GymServicesPage />} />
          <Route path="profile" element={<GymProfile />} />
          <Route path="members" element={<GymMembers />} />
          <Route path="reviews" element={<ServiceProviderReviews />} />
        </Route>
      </Route> 
        {/* end gym Dashboard */}

        {/* tech Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
        <Route path="/technician" element={<TechnicianDashboardLayout />}>
          <Route index element={<Navigate to="overView" replace />} />
          <Route path="overView" element={<TechnicianOverView />} />
          <Route path="profile" element={<TechnicianProfile />} />
          <Route path="reviews" element={<ServiceProviderReviews />} />
        </Route>
      </Route> 
        {/* end tech Dashboard */}

        {/* restaurant Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["restaurant"]} />}>
        <Route path="/restaurant" element={<RestaurantDashboard />}>
          <Route index element={<Navigate to="overView" replace />} />
          <Route path="overView" element={<TechnicianOverView />} />
          <Route path="profile" element={<RestaurantProfile />} />
          <Route path="reviews" element={<ServiceProviderReviews />} />
          <Route path="orders" element={<RestaurantReversation />} />
        </Route>
      </Route> 
        {/* end restaurant Dashboard */}

        {/* socila media */}
        <Route element={<ProtectedRoute allowedRoles={["gym" , "doctor" , "resident" , "technician" , "restaurant"]} />}>
          <Route path="community-loader" element={<CommunityLoader />} />
          <Route path="community" element={<CommunityLayout />} >
          <Route path="home" index element={<MainFeed />} />
          <Route path="profile/me" element={<ProfileSocialPage />} />
          <Route path="profile/:userId" element={<ProfileSocialPage />} />
          <Route path="settings" element={<SocialSettings />} />
          <Route path="bookmarks" element={<SavedPostsPage />} />
          <Route path="post/:postId" element={<CommentPage currentUserId={sessionStorage.getItem("user_id")!} />} />
          </Route>
        </Route>
        {/* end socila media */}

        {/* Chatting*/}
        <Route element={<ProtectedRoute allowedRoles={["gym" , "doctor" , "resident" , "technician" ,  "restaurant"]} />}>
          <Route path="/chat" element={<ChatLayout />}>
            <Route index element={<ChatList />} />
            <Route path="new" element={<NewChatPage />}/>
            <Route path=":receiverId" element={<ChatConversationPage />} />
            <Route path="profile/:userId" element={<UserProfileChatPage />} />
          </Route>
        </Route>
        {/* end Chatting */}
      </Routes>
  );
}