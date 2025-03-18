import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import Home from "./Page/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./Page/Profile/Profile";
import SavedRecipeCardCardList from "./components/SavedRecipeCardCardList/SavedRecipeCardCardList";
import UserReviewList from "./components/UserReviewList/UserReviewList";
import CreatedRecipesList from "./components/CreatedRecipesList/CreatedRecipesList";
import { useContext } from "react";
import RecipeEditor from "./components/RecipeEditor/RecipeEditor";
import { AuthProvider } from "./context/AuthContext";
import SearchPage from "./Page/Searchpage/SearchPage";
import Login from "./Page/Login/login";
import Signup from "./Page/Signup/signup";
import Interaction from "./Page/Interaction/Interaction";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/interaction" element={<Interaction />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          >
            <Route path="saved_recipes" element={<SavedRecipeCardCardList />} />
            <Route path="review" element={<UserReviewList />} />
            <Route path="created_recipes" element={<CreatedRecipesList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
