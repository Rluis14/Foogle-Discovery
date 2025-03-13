import React, { useContext, useState } from 'react';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import './Profile.css';
import { AuthContext } from '../../context/AuthContext';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const sections = [
  {
    type: 'saved_recipes',
    name: 'User Saved Recipes',
    url:'saved_recipes'
  },
  {
    type: 'created_recipes',
    name: 'User Recipe Created',
    url:'created_recipes'
  },
  {
    type: 'reviews',
    name: 'User\'s Review',
    url:'review',
  }
];
const determineSection = (path)=>{
  const subpaths = path.split('/');
  return subpaths[2]||'';
}
const Profile = () => {
  const location = useLocation();
  const [selectedSection, setSelectedSection] = useState(determineSection(location.pathname));
  const navigate = useNavigate();

  const onClickSection= (section)=>{
    navigate(section.url);
    setSelectedSection(section.type);
  }

  return (
    <div className="profile_container">
      <div className="profile_sidebar">
          {sections.map((section) => {
            const isSelected = section.type===selectedSection;
            return (
              <div className={isSelected?'selected':undefined} key={section.type+isSelected} onClick={() => onClickSection(section)}>
                {section.name}
              </div>
            )
          })}
          {/* <li onClick={() => setSelectedSection(null)}>Home</li> */}
      </div>
      <div className='display_container'>
        <Outlet/>
      </div>
    </div>
  );
};

export default Profile;