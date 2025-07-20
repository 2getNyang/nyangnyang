
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Index from "./pages/Index";
import Animals from "./pages/Animals";
import Board from "./pages/Board";
import CreatePost from "./pages/CreatePost";
import CreateSNSPost from "./pages/CreateSNSPost";
import CreateAdoptionReviewPost from "./pages/CreateAdoptionReviewPost";
import CreateMissingPost from "./pages/CreateMissingPost";
import EditMissingPost from "./pages/EditMissingPost";
import SNSPostDetail from "./pages/SNSPostDetail";
import EditSNSPost from "./pages/EditSNSPost";
import EditAdoptionReviewPost from "./pages/EditAdoptionReviewPost";
import AdoptionReviewDetail from "./pages/AdoptionReviewDetail";
import Shelters from "./pages/Shelters";
import ShelterDetail from "./pages/ShelterDetail";
import MyPage from "./pages/MyPage";
import EditProfile from "./pages/EditProfile";
import MyPosts from "./pages/MyPosts";
import MyLikedPosts from "./pages/MyLikedPosts";
import MyFavoriteAdoptions from "./pages/MyFavoriteAdoptions";
import MyAdoptionApplications from "./pages/MyAdoptionApplications";
import MissingAnimalDetail from "./pages/MissingAnimalDetail";
import WithdrawalTerms from "./pages/WithdrawalTerms";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";
import ChatRoom from "./pages/ChatRoom";
import TestPage from "./pages/TestPage";
import TestPage6 from "./pages/TestPage6";
import TestPage7 from "./pages/TestPage7";
import LoginCallback from "./pages/LoginCallback";
import AnimalDetail from "./pages/AnimalDetail";
import AdoptionFormPage from "./pages/adoption/AdoptionFormPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/board" element={<Board />} />
          <Route path="/create-post" element={<CreatePost />} />
           <Route path="/create-sns-post" element={<CreateSNSPost />} />
           <Route path="/create-adoption-review-post" element={<CreateAdoptionReviewPost />} />
           <Route path="/create-missing-post" element={<CreateMissingPost />} />
           <Route path="/sns-post/:id" element={<SNSPostDetail />} />
           <Route path="/edit-sns-post/:boardId" element={<EditSNSPost />} />
        <Route path="/adoption-review/:id" element={<AdoptionReviewDetail />} />
        <Route path="/edit-adoption-review/:id" element={<EditAdoptionReviewPost />} />
        <Route path="/adoption-review/edit/:id" element={<div>입양후기 수정 페이지</div>} />
           <Route path="/animal/:id" element={<AnimalDetail />} />
           <Route path="/adoption-form/:desertionNo" element={<AdoptionFormPage />} />
           <Route path="/adoption-form/:desertionNo/:formId" element={<AdoptionFormPage />} />
           <Route path="/missing-post/:id" element={<MissingAnimalDetail />} />
           <Route path="/missing-post/edit/:id" element={<EditMissingPost />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/chat-list" element={<ChatList />} />
          <Route path="/chat/room/:roomId" element={<ChatRoom />} />
          <Route path="/shelters" element={<Shelters />} />
          <Route path="/shelter/:id" element={<ShelterDetail />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
           <Route path="/my-posts" element={<MyPosts />} />
           <Route path="/my-liked-posts" element={<MyLikedPosts />} />
           <Route path="/my-favorite-adoptions" element={<MyFavoriteAdoptions />} />
           <Route path="/my-adoption-applications" element={<MyAdoptionApplications />} />
          <Route path="/withdrawal-terms" element={<WithdrawalTerms />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/test6" element={<TestPage6 />} />
            <Route path="/test7" element={<TestPage7 />} />
            <Route path="/login/callback" element={<LoginCallback />} />
            <Route path="/oauth2/redirect" element={<LoginCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
